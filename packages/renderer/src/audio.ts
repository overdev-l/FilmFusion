import { Howl, } from "howler"
import AudioOptions from "./audioTyps"
class AudioElement {
    audios: Howl[]

    setAudios(options: AudioOptions.Options[]) {
        console.log(options)
    }
}

export default AudioElement
