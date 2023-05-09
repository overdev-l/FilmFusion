import TimeControllerConfig from "./types"
class TimeController {
    totalDuration = 0
    totalCurrentDuration = 0
    currentTime = 0
    currentDuration = 0
    /**
     * @description 1: 播放 2: 暂停 0: 停止
     */
    playerStatus = 0
    /**
     * @description 当前播放场景的计时器
     */
    startSceneNow = 0
    onTimeUpdate: TimeControllerConfig.Options["onTimeUpdate"]
    constructor(options: TimeControllerConfig.Options) {
        this.totalDuration = options.duration
        this.onTimeUpdate = options.onTimeUpdate
        options.onTimeUpdate({
            currentTime: this.currentTime,
            currentDuration: this.currentDuration,
            totalDuration: this.totalDuration,
            totalTime: this.totalCurrentDuration,
        })
    }
    /**
     * @description 设置当前场景总时长
     * @param currentDuration 当前时间
     */
    setCurrentTime(currentDuration: number) {
        this.currentDuration = currentDuration
        this.currentTime = 0
    }

    play() {
        if (this.playerStatus === 0) {
            console.warn("the scene was over")
            return
        }
        if (this.playerStatus === 1) {
            console.warn("the scene is playing")
            return
        }
        this.playerStatus = 1
        this.startSceneNow = Date.now()
        this.timeController()
    }

    next() {
        console.log("next")
    }

    timeController() {
        if (this.playerStatus !== 1) return
        const c = Date.now()
        this.currentTime += c
        if (this.currentTime >= this.currentDuration) {
            this.next()
            return
        }
        requestAnimationFrame(() => {
            this.timeController
        })
    }   

}


export { TimeController, }
