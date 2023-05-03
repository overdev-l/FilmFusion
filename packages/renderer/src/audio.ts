import { Howl, } from "howler"
import AudioOptions from "./audioTypes"
class AudioElement {
    audios: {
        target: Howl,
        id?: number
    }[] = []

    setAudios(options: AudioOptions.Options[], callback: () => void) {
        const ps = []
        for (let index = 0; index < options.length; index++) {
            const element = options[index]
            const p = new Promise<void>((resolve, reject) => {
                const audio = new Howl({
                    src: element.audio,
                    volume: element.volume / 100,
                    mute: element.mute,
                    format: element.format || "mp3",
                    sprite: {
                        main: [element.startTime, element.endTime - element.startTime, element.loop,],
                    },
                    onload: () => {
                        resolve()
                    },
                    onloaderror: (id, error) => {
                        reject(error)
                    },
                })
                this.audios[index] = {
                    target: audio,
                }
            })
            ps.push(p)
        }
        Promise.all(ps).then(() => {
            console.log("音频加载完成")
            callback()
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
