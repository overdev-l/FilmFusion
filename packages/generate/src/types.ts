import ParserConfig from "../../parser/src/types"
import AudioConfig from "../../renderer/src/audioTypes"
import ElementConfig from "packages/renderer/src/elementTypes"
import RendererConfig from "packages/renderer/src/types"

namespace GenerateConfig {
    export interface Options {
        data: Data
    }

    
    export interface Data {
            backgroundAudio?: AudioConfig.Options[],
            scenes: ParserConfig.SceneFiber,
            elements?: ElementConfig.ElementOptions[],
            background?: RendererConfig.Background,
    }

}

export default GenerateConfig
