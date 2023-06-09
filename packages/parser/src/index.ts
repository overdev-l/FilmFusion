import axios from "axios"
import ParserSubtitle from "srt-parser-2"
import { cloneDeep, } from "lodash-es"
import QuickLRU from "quick-lru"


import {BlobTransformBlobUrl, UrlTransformSubtitle, workString, } from "./utils"
import ParserConfig from "./types"

class Parser {
    cache = new QuickLRU<string, ParserConfig.LRUData>({
        maxSize: 500,
        onEviction: (key, value) => {
            URL.revokeObjectURL(value.url)
        },
    })
    subtitleCache: Map<string, ParserConfig.SubtitleData[]> = new Map()
    sceneFiber: ParserConfig.SceneFiber | null = null
    playerFiber: ParserConfig.SceneFiber | null
    backgroundAudio: ParserConfig.Options["backgroundAudio"] = []
    background: ParserConfig.Options["background"]
    elements: ParserConfig.Options["elements"]
    parserInstance = new ParserSubtitle()
    firstLoaded: ParserConfig.Options["firstLoaded"]
    worker = new Worker(URL.createObjectURL(new Blob([workString,], { type: "text/javascript", })))
    constructor(options: ParserConfig.Options) {
        this.firstLoaded = options.firstLoaded
        // 初始化场景链表
        this.initFiber(options)
        this.playerFiber = this.sceneFiber
        // 初始化worker
        this.initWorkerMessage()
        // 加载节点数据
        this.loadNodeData(options)
    }

    /**
     * @description 加载节点数据
     * @param options
     */
    loadNodeData(options: Omit<ParserConfig.Options, "firstLoaded">) {
        const promiseAll: Promise<any>[] = []
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
            if (!this.sceneFiber) return
            const node = cloneDeep(this.sceneFiber)
            node.nextScene = null
            this.firstLoaded(node, this.background, this.elements, this.backgroundAudio)
            this.playerFiber = this.sceneFiber?.nextScene || null
            this.coroutineParserFiber(this.sceneFiber!.nextScene)
        })
    }

    /**
     * @description 初始化场景
     * @param options
     */
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
    /**
     * @description 更新场景
     */
    update(options: ParserConfig.Options) {
        // 初始化场景链表
        this.initFiber(options)
        this.playerFiber = this.sceneFiber
        // 加载节点数据
        this.loadNodeData(options)
    }
    /**
     * @description 重置头节点
     */
    resetHeadNode() {
        this.playerFiber = this.sceneFiber
        this.firstLoaded(this.playerFiber as ParserConfig.SceneFiber, this.background, this.elements, this.backgroundAudio)
    }
    /**
     * @description 初始化worker
     */
    initWorkerMessage() {
        this.worker.onmessage = (e) => {
            if (e.data.type === 1) {
                this.cache.set(e.data.url, e.data.data)
            } else {
                this.subtitleCache.set(e.data.url, this.parserInstance.fromSrt(e.data.data))
            }
        }
    }
    /**
     * @description 解析背景音乐
     * @param options
     * @returns
     */
    async parserBackgroundAudio(options: ParserConfig.Options["backgroundAudio"]) {
        this.backgroundAudio = []
        if (!options) return
        for (let i = 0; i < options.length; i++) {
            const audio = options[i]
            if (this.cache.get(audio.audio)) {
                audio.audio = this.cache.get(audio.audio)?.url as string
                this.backgroundAudio.push(audio)
                continue
            }
            const { data, } = await axios.get(audio.audio, {
                responseType: "blob",
            })
            const result = await BlobTransformBlobUrl(data)
            this.cache.set(audio.audio, {
                source: data,
                url: result,
            })
            audio.audio = result
            this.backgroundAudio.push(audio)
        }
    }
    /**
     * @description 解析背景
     * @param options
     * @returns
     */
    async parserBackground(options: ParserConfig.Options["background"]) {
        if (!options) return
        if (options.type !== 2) return
        options.image = await this.parserData(options.image as string)
        this.background = options
    }
    /**
     * @description 解析元素
     * @param options
     * @returns
     */
    async parserElements(options: ParserConfig.Options["elements"]) {
        if (!options) return
        for (const element of options) {
            if (element!.type === 2) {
                element.image = await this.parserData(element.image)
            }
        }
        this.elements = options
    }
    /**
     * @description 解析场景
     * @param currentFiber 当前场景
     */
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
    /**
     * @description 解析资源
     * @param url
     * @returns
     */
    async parserData(url: string): Promise<string> {
        const isLoaded = this.cache.has(url)
        if (isLoaded) return this.cache.get(url)?.url as string
        const { data, } = await axios.get(url, {
            responseType: "blob",
        })
        const result = await BlobTransformBlobUrl(data)
        this.cache.set(url, {
            source: data,
            url: result,
        })
        return result
    }
    /**
     * @description 解析字幕
     * @param url 字幕地址
     */
    async parserSubtitle(url: string): Promise<ParserConfig.SubtitleData[]> {
        if (this.subtitleCache.has(url)) {
            return this.subtitleCache.get(url) as ParserConfig.SubtitleData[]
        }
        const result = await UrlTransformSubtitle(url)
        this.subtitleCache.set(url, result)
        return result
    }
    /**
     * @description 协程解析下一个场景
     * @param currentFiber 当前场景
     */
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
    /**
     * @description 播放下一个场景
     */
    async nextFiber(): Promise<ParserConfig.SceneFiber | undefined> {
        if (this.playerFiber) {
            if (!this.playerFiber.isLoaded) {
                await this.parserFiber(this.playerFiber)
            }
            this.replaceFiber()
            this.coroutineParserFiber(this.playerFiber.nextScene)
            const current = cloneDeep(this.playerFiber)
            current.nextScene = null
            this.playerFiber = this.playerFiber.nextScene
            return current
        }
        return undefined
    }
    /**
     * @description 替换当前场景的资源
     */
    replaceFiber() {
        if (!this.playerFiber) return
        this.playerFiber.sceneData.movie.url = this.cache.get(this.playerFiber.sceneData.movie.url)?.url as string
        if (this.playerFiber.sceneData.voice && !this.playerFiber.sceneData.voice.audio.startsWith("blob")) {
            this.playerFiber.sceneData.voice.audio = this.cache.get(this.playerFiber.sceneData.voice.audio)?.url as string
        }
        if (this.playerFiber.sceneData.subtitle) {
            this.playerFiber.sceneData.subtitle.data = this.subtitleCache.get(this.playerFiber.sceneData.subtitle.url) as ParserConfig.SubtitleData[]
        }
    }
    getAllCache() {
        const cache = []
        const keys = this.cache.keys()
        for (const item of keys) {
            cache.push({
                key: item,
                value: this.cache.get(item),
            })
        }
        return cache
    }
    /**
     * @description 释放内存
     * @param urls 需要释放的资源
     */
    freeMemory(urls: string[]) {
        for (const url of urls) {
            const isMedia = this.cache.has(url)
            const isSubtitle = this.subtitleCache.has(url)
            if (isMedia) {
                this.cache.delete(url)
            }
            if (isSubtitle) {
                this.subtitleCache.delete(url)
            }
        }
    }
    /**
     * @description 解析所有场景
     */
    async parserAllFiber() {
        let pointer = this.sceneFiber
        while (pointer) {
            if (!pointer.isLoaded) {
                await this.parserFiber(pointer)
                pointer.sceneData.movie.url = this.cache.get(pointer.sceneData.movie.url)?.url as string
                if (pointer.sceneData.voice) {
                    pointer.sceneData.voice.audio = this.cache.get(pointer.sceneData.voice.audio)?.url as string
                }
                if (pointer.sceneData.subtitle) {
                    pointer.sceneData.subtitle.data = this.subtitleCache.get(pointer.sceneData.subtitle.url) as ParserConfig.SubtitleData[]
                }
            }
            pointer = pointer.nextScene
        }
        return this.sceneFiber
    }

    public resetNodes(): ParserConfig.SceneFiber {
        this.playerFiber = this.sceneFiber
        this.replaceFiber()
        const current = cloneDeep(this.playerFiber)
        current!.nextScene = null
        return current as ParserConfig.SceneFiber
    }
}

export {
    Parser,
    ParserConfig,
}
