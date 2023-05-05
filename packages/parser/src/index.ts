import ParserConfig from "./types"
import axios from "axios"
import { BlobTransformBase64, } from "./utils"
class Parser {
    cache: Map<string, string> = new Map()
    sceneFiber: ParserConfig.SceneFiber | null = null
    backgroundAudio: ParserConfig.Options["backgroundAudio"] = []
    background: ParserConfig.Options["background"]
    elements: ParserConfig.Options["elements"]
    constructor(options: ParserConfig.Options) {
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
        this.parserFiber(this.sceneFiber as ParserConfig.SceneFiber)
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
                movie: {
                    ...options.scenes[i],
                    subtitle: options.scenes[i].subtitle ? {
                        ...options.scenes[i].subtitle,
                        data: [],
                    } : undefined,
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
            const result = await BlobTransformBase64(data)
            this.cache.set(audio.audio, result)
            audio.audio = result
            this.backgroundAudio.push(audio)
        }
    }

    async parserBackground(options: ParserConfig.Options["background"]) {
        if (!options) return
        if (options.type !== 2) return
        const result = await this.parserData(options.image as string)
        options.image = result
        this.background = options
    }
    
    async parserElements(options: ParserConfig.Options["elements"]) {
        if (!options) return
        for (const element of options) {
            if (element!.type === 2) {
                const result = await this.parserData(element.image)
                element.image = result
            }
        }
        this.elements = options
    }

    async parserFiber(options: ParserConfig.SceneFiber) {
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
    ParserConfig,
}
