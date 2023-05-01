import { Howl, } from "howler"
import AudioOptions from "./audioTyps"
class AudioElement {
    audios: {
        target: Howl,
        id?: number
    }[]

    setAudios(options: AudioOptions.Options[]) {
        this.audios = options.map((audio) => {
            return {
                target: new Howl({
                    src: audio.audio,
                    volume: audio.volume / 100,
                    mute: audio.mute,
                    format: audio.format || "mp3",
                    sprite: {
                        main: [audio.startTime, audio.endTime - audio.startTime, audio.loop,],
                    },
                }),
            }
        })
    }
    /**
     * setAudiosVolume
     * 设置音频音量
     * @param volume 
     */
    public setAudiosVolume(volume: number) {
        this.audios.forEach(audio => {
            audio.target.volume(volume / 100)
        })
    }
    play() {
        this.audios.forEach((audio) => {
            console.log(audio.target)
            const id = audio.target.play("main")
            audio.id = id            
        })
    }

    pause() {
        this.audios.forEach((audio) => {
            audio.target.pause(audio.id)
        })
    }
}

export default AudioElement
