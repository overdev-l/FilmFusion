import AudioConfig from "../../renderer/src/audioTypes"
import RendererConfig from "../../renderer/src/types"
import ElementConfig from "../../renderer/src/elementTypes"
namespace ParserConfig {
    export interface Options {
        backgroundAudio?: AudioConfig.Options[]
        scenes: RendererConfig.SceneData[]
        elements?: ElementConfig.ElementOptions[]
        background?: RendererConfig.Background
        cover?: RendererConfig.Cover
    }
    export interface SceneFiber {
        isHead: boolean
        isTail: boolean
        isLoaded: boolean
        sceneData: SceneData
        nextScene: SceneFiber | null
    }
    interface SceneData {
        movie: RendererConfig.MovieOptions
        voice?: AudioConfig.Options
        subtitle?: Omit<ElementConfig.TextElement, "type" | "text" | "name"> & {
            data: SubtitleData[],
            url: string
        }
    }
    export interface SubtitleData {
        endSeconds: number
        startSeconds: number
        startTime: string
        endTime: string
        id: string
        text: string
    }
}

export default ParserConfig
