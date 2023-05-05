import AudioOptions from "../../renderer/src/audioTypes"
import RendererOptions from "../../renderer/src/types"
import ElementOptions from "../../renderer/src/elementTypes"
namespace ParserOptions {
    export interface Options {
        backgroundAudio?: AudioOptions.Options[]
        scenes: RendererOptions.MovieOptions[]
        elements?: ElementOptions.AddElementOptions<1 | 2>[]
        background?: RendererOptions.Background
        cover?: RendererOptions.Cover
    }
    export interface SceneFiber {
        isHead: boolean
        isTail: boolean
        isLoaded: boolean
        movie: RendererOptions.MovieOptions
        nextScene: SceneFiber | null
    }
}

export default ParserOptions
