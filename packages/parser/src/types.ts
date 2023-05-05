import AudioConfig from "../../renderer/src/audioTypes"
import RendererConfig from "../../renderer/src/types"
import ElementConfig from "../../renderer/src/elementTypes"
namespace ParserConfig {
    export interface Options {
        backgroundAudio?: AudioConfig.Options[]
        scenes: RendererConfig.MovieOptions[]
        elements?: ElementConfig.ElementOptions[]
        background?: RendererConfig.Background
        cover?: RendererConfig.Cover
    }
    export interface SceneFiber {
        isHead: boolean
        isTail: boolean
        isLoaded: boolean
        movie: any
        nextScene: SceneFiber | null
    }
}

export default ParserConfig
