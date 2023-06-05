import JSONEditor from "jsoneditor"
import {ParserConfig,} from "@film-fusion/parser"
import {AudioConfig, ElementConfig, RendererConfig,} from "@film-fusion/renderer"
export namespace ParserData {
    export interface PageData {
        sourceEditor: JSONEditor | undefined
        currentEditor: JSONEditor | undefined
        cacheEditor: JSONEditor | undefined
    }
    export interface CurrentData {
        scene: ParserConfig.SceneFiber| undefined,
        background: RendererConfig.Background | undefined,
        elements: ElementConfig.ElementOptions[] | undefined,
        backgroundAudio: AudioConfig.Options[] | undefined
    }
}
