import ParserConfig from "./types"
import axios from "axios"

import {BlobTransformBlobUrl, UrlTransformSubtitle, workString,} from "./utils"
import ParserSubtitle from "srt-parser-2"
import { cloneDeep, } from "lodash-es"

class Parser {
    cache: Map<string, string> = new Map()
    subtitleCache: Map<string, ParserConfig.SubtitleData[]> = new Map()
    sceneFiber: ParserConfig.SceneFiber | null = null
    playerFiber: ParserConfig.SceneFiber | null
    backgroundAudio: ParserConfig.Options["backgroundAudio"] = []
    background: ParserConfig.Options["background"]
    elements: ParserConfig.Options["elements"]
    parserInstance = new ParserSubtitle()
    worker = new Worker(URL.createObjectURL(new Blob([workString,], { type: "text/javascript", })))
    constructor(options: ParserConfig.Options) {
        const promiseAll: Promise<any>[] = []
        this.initFiber(options)
        this.playerFiber = this.sceneFiber
        this.initWorkerMessage()
        if (options.backgroundAudio) {
            promiseAll.push(this.parserBackgroundAudio(options.backgroundAudio))
        }
        if (options.background) {
            promiseAll.push(this.parserBackground(options.background))
        }
        if (options.elements) {
            promiseAll.push(this.parserElements(options.elements))
        }
        promiseAll.push(this.parserFiber(this.sceneFiber as ParserConfig.SceneFiber))

        Promise.all(promiseAll).then(() => {
            this.replaceFiber()
            options.firstLoaded(this.sceneFiber as ParserConfig.SceneFiber, this.background, this.elements, this.backgroundAudio)
            this.playerFiber = this.sceneFiber?.nextScene || null
            this.coroutineParserFiber(this.sceneFiber!.nextScene)
        })
    }

    initFiber(options: ParserConfig.Options) {
        let current: ParserConfig.SceneFiber | null = null
        if (options.scenes.length === 0) {
            throw new Error("scenes is empty")
        }
        for (let i = 0; i < options.scenes.length; i++) {
            const fiber: ParserConfig.SceneFiber = {
                isHead: i === 0,
                isTail: i === options.scenes.length - 1,
                isLoaded: false,
                sceneData: {
                    movie: options.scenes[i].movie,
                    voice: options.scenes[i].voice || undefined,
                    duration: options.scenes[i].duration,
                    subtitle: options.scenes[i].subtitle? {
                        style: options.scenes[i].subtitle!.style,
                        position: options.scenes[i].subtitle!.position,
                        data: [],
                        url: options.scenes[i].subtitle!.url,
                    }: undefined,
                    
                },
                nextScene: null,
            }
            if (current) {
                current.nextScene = fiber
                current = fiber
            } else {
                current = fiber
            }
            if (i === 0) {
                this.sceneFiber = fiber
            }
        }
    }

    initWorkerMessage() {
        this.worker.onmessage = (e) => {
            if (e.data.type === 1) {
                this.cache.set(e.data.url, e.data.data)
            } else {
                this.subtitleCache.set(e.data.url, this.parserInstance.fromSrt(e.data.data))
            }
        }
    }

    async parserBackgroundAudio(options: ParserConfig.Options["backgroundAudio"]) {
        this.backgroundAudio = []
        if (!options) return
        for (let i = 0; i < options.length; i++) {
            const audio = options[i]
            if (this.cache.has(audio.audio)) {
                audio.audio = this.cache.get(audio.audio) as string
                this.backgroundAudio.push(audio)
                continue
            }
            const { data, } = await axios.get(audio.audio, {
                responseType: "blob",
            })
            const result = await BlobTransformBlobUrl(data)
            this.cache.set(audio.audio, result)
            audio.audio = result
            this.backgroundAudio.push(audio)
        }
    }

    async parserBackground(options: ParserConfig.Options["background"]) {
        if (!options) return
        if (options.type !== 2) return
        options.image = await this.parserData(options.image as string)
        this.background = options
    }

    async parserElements(options: ParserConfig.Options["elements"]) {
        if (!options) return
        for (const element of options) {
            if (element!.type === 2) {
                element.image = await this.parserData(element.image)
            }
        }
        this.elements = options
    }

    async parserFiber(currentFiber: ParserConfig.SceneFiber) {
        await this.parserData(currentFiber.sceneData.movie.url)
        if (currentFiber.sceneData.voice) {
            await this.parserData(currentFiber.sceneData.voice.audio)
        }
        if (currentFiber.sceneData.subtitle) {
            await this.parserSubtitle(currentFiber.sceneData.subtitle.url)
        }
        currentFiber.isLoaded = true
    }
    async parserData(url: string): Promise<string> {
        const isLoaded = this.cache.has(url)
        if (isLoaded) return this.cache.get(url) as string
        const { data, } = await axios.get(url, {
            responseType: "blob",
        })
        const result = await BlobTransformBlobUrl(data)
        this.cache.set(url, result)
        return result
    }

    async parserSubtitle(url: string): Promise<ParserConfig.SubtitleData[]> {
        if (this.subtitleCache.has(url)) {
            return this.subtitleCache.get(url) as ParserConfig.SubtitleData[]
        }
        const result = await UrlTransformSubtitle(url)
        this.subtitleCache.set(url, result)
        return result
    }

    coroutineParserFiber(currentFiber: ParserConfig.SceneFiber| null) {
        if (!currentFiber) return
        const parser = () => {
            this.worker.postMessage({
                type: 1,
                url: currentFiber.sceneData.movie.url,
            })
            if (currentFiber.sceneData.voice) {
                this.worker.postMessage({
                    type: 1,
                    url: currentFiber.sceneData.voice.audio,
                })
            }
            if(currentFiber.sceneData.subtitle) {
                this.worker.postMessage({
                    type: 2,
                    url: currentFiber.sceneData.subtitle.url,
                })
            }
        }
        window.requestIdleCallback(() => {
            parser()
        })
    }

    async nextFiber() {
        if (this.playerFiber) {
            if (!this.playerFiber.isLoaded) {
                await this.parserFiber(this.playerFiber)
            }
            this.replaceFiber()
            this.coroutineParserFiber(this.playerFiber.nextScene)
            const current = cloneDeep(this.playerFiber)
            this.playerFiber = this.playerFiber.nextScene
            return current
        }
        return null
    }
    replaceFiber() {
        if (!this.playerFiber) return
        this.playerFiber.sceneData.movie.url = this.cache.get(this.playerFiber.sceneData.movie.url) as string
        if (this.playerFiber.sceneData.voice) {
            this.playerFiber.sceneData.voice.audio = this.cache.get(this.playerFiber.sceneData.voice.audio) as string
        }
        if (this.playerFiber.sceneData.subtitle) {
            this.playerFiber.sceneData.subtitle.data = this.subtitleCache.get(this.playerFiber.sceneData.subtitle.url) as ParserConfig.SubtitleData[]
        }
    }
    freeMemory(urls: string[]) {
        for (const url of urls) {
            const isMedia = this.cache.has(url)
            const isSubtitle = this.subtitleCache.has(url)
            if (isMedia) {
                URL.revokeObjectURL(this.cache.get(url) as string)
                this.cache.delete(url)
            }
            if (isSubtitle) {
                this.subtitleCache.delete(url)
            }
        }
    }

    async parserAllFiber() {
        let pointer = this.sceneFiber
        while (pointer) {
            if (!pointer.isLoaded) {
                await this.parserFiber(pointer)
                pointer.sceneData.movie.url = this.cache.get(pointer.sceneData.movie.url) as string
                if (pointer.sceneData.voice) {
                    pointer.sceneData.voice.audio = this.cache.get(pointer.sceneData.voice.audio) as string
                }
                if (pointer.sceneData.subtitle) {
                    pointer.sceneData.subtitle.data = this.subtitleCache.get(pointer.sceneData.subtitle.url) as ParserConfig.SubtitleData[]
                }
            }
            pointer = pointer.nextScene
        }
        return this.sceneFiber
    }
}

export {
    Parser,
    ParserConfig,
}
