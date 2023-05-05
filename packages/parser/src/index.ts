import ParserOptions from "./types"
import axios from "axios"
import { BlobTransformBase64, } from "./utils"
class Parser {
    cache: Map<string, string> = new Map()
    sceneFiber: ParserOptions.SceneFiber | null = null
    backgroundAudio: ParserOptions.Options["backgroundAudio"] = []
    background: ParserOptions.Options["background"]
    elements: ParserOptions.Options["elements"]
    constructor(options: ParserOptions.Options) {
        this.initFiber(options)
        if (options.backgroundAudio) {
            this.parserBackgroundAudio(options.backgroundAudio)
        }
        if (options.background) {
            this.parserBackground(options.background)
        }
        if (options.elements) {
            this.parserElements(options.elements)
        }
        this.parserFiber(this.sceneFiber as ParserOptions.SceneFiber)
    }

    initFiber(options: ParserOptions.Options) {
        let current: ParserOptions.SceneFiber | null = null
        if (options.scenes.length === 0) {
            throw new Error("scenes is empty")
        }
        for (let i = 0; i < options.scenes.length; i++) {
            const fiber: ParserOptions.SceneFiber = {
                isHead: i === 0,
                isTail: i === options.scenes.length - 1,
                isLoaded: false,
                movie: options.scenes[i],
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

    async parserBackgroundAudio(options: ParserOptions.Options["backgroundAudio"]) {
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
            const result = await BlobTransformBase64(data)
            this.cache.set(audio.audio, result)
            audio.audio = result
            this.backgroundAudio.push(audio)
        }
    }

    async parserBackground(options: ParserOptions.Options["background"]) {
        if (!options) return
        if (options.type !== 2) return
        if (this.cache.has(options.image as string)) {
            options.image = this.cache.get(options.image as string) as string
            return
        }
        const { data, } = await axios.get(options.image as string, {
            responseType: "blob",
        })
        const result = await BlobTransformBase64(data)
        this.cache.set(options.image as string, result)
        options.image = result
        this.background = options
    }
    
    async parserElements(options: ParserOptions.Options["elements"]) {
        if (!options) return
        for (const element of options) {
            if (element!.type === 2) {
                if (this.cache.has(element.image as string)) {
                    element.image = this.cache.get(element.image as string) as string
                    continue
                }
                const { data, } = await axios.get(element.image as string, {
                    responseType: "blob",
                })
                const result = await BlobTransformBase64(data)
                this.cache.set(element.image as string, result)
                element.image = result
            }
        }
        this.elements = options
    }

    async parserFiber(options: ParserOptions.SceneFiber) {
        console.log(options)
        const currentFiber = options
        while(currentFiber !== null) {
            currentFiber.movie.url = await this.parserData(currentFiber.movie.url)
            if (currentFiber.movie.voice) {
                currentFiber.movie.voice.audio = await this.parserData(currentFiber.movie.voice.audio)
            }
            if (currentFiber.movie.subtitle) {
                currentFiber.movie.subtitle.url = await this.parserData(currentFiber.movie.subtitle.url)
            }
        }
    }
    async parserData(url: string): Promise<string> {
        const isLoaded = this.cache.has(url)
        if (isLoaded) return this.cache.get(url) as string
        const { data, } = await axios.get(url, {
            responseType: "blob",
        })
        const result = await BlobTransformBase64(data)
        this.cache.set(url, result)
        return result
    }
}

export {
    Parser,
    ParserOptions,
}
