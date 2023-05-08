import ParserConfig from "./types"
import axios from "axios"

import {BlobTransformBlobUrl, UrlTransformSubtitle, workString,} from "./utils"
import ParserSubtitle from "srt-parser-2"

class Parser {
    cache: Map<string, string> = new Map()
    subtitleCache: Map<string, ParserConfig.SubtitleData[]> = new Map()
    sceneFiber: ParserConfig.SceneFiber | null = null
    backgroundAudio: ParserConfig.Options["backgroundAudio"] = []
    background: ParserConfig.Options["background"]
    elements: ParserConfig.Options["elements"]
    parserInstance = new ParserSubtitle()
    worker = new Worker(URL.createObjectURL(new Blob([workString,], { type: "text/javascript", })))
    constructor(options: ParserConfig.Options) {
        this.initFiber(options)
        this.initWorkerMessage()
        if (options.backgroundAudio) {
            this.parserBackgroundAudio(options.backgroundAudio)
        }
        if (options.background) {
            this.parserBackground(options.background)
        }
        if (options.elements) {
            this.parserElements(options.elements)
        }
        this.parserFiber(this.sceneFiber as ParserConfig.SceneFiber)
        this.coroutineParserFiber(this.sceneFiber as ParserConfig.SceneFiber)
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
            this.cache.set(e.data.movie.key, e.data.movie.value)
            if (e.data.voice) {
                this.cache.set(e.data.voice.key, e.data.voice.value)
            }
            if (e.data.subtitle) {
                this.subtitleCache.set(e.data.subtitle.key, this.parserInstance.fromSrt(e.data.subtitle.value))
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
        currentFiber.sceneData.movie.url = await this.parserData(currentFiber.sceneData.movie.url)
        if (currentFiber.sceneData.voice) {
            currentFiber.sceneData.voice.audio = await this.parserData(currentFiber.sceneData.voice.audio)
        }
        if (currentFiber.sceneData.subtitle) {
            currentFiber.sceneData.subtitle.data = await this.parserSubtitle(currentFiber.sceneData.subtitle.url)
        }
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
            this.worker.postMessage(currentFiber)
        }
        window.requestIdleCallback(() => {
            parser()
            this.coroutineParserFiber.bind(this, currentFiber?.nextScene || null)
        })
    }

}

export {
    Parser,
    ParserConfig,
}
