import TimeControllerConfig from "./types"
class TimeController {
    totalDuration = 0
    totalTime = 0
    currentTime = 0
    currentDuration = 0
    /**
     * @description 用来计时减少误差
     */
    timeCtx = new AudioContext()
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
            totalTime: this.totalTime,
        })
    }
    /**
     * @description 设置当前场景总时长
     * @param currentDuration 当前时间
     */
    setCurrentTime(currentDuration: number) {
        this.currentDuration = currentDuration
        this.currentTime = 0
        this.playerStatus = 2
        this.updateTime()
    }

    play() {
        console.log(this.playerStatus)
        if (this.playerStatus === 0) {
            console.warn("the scene was over")
            return
        }
        if (this.playerStatus === 1) {
            console.warn("the scene is playing")
            return
        }
        this.playerStatus = 1
        this.timeCtx.resume().then(() => {
            this.startSceneNow = this.timeCtx.currentTime
            this.timeController()
        })
    }
    pause() {
        this.timeCtx.suspend().then(() => {
            this.playerStatus = 2
        })
    }

    next() {
        console.log("next")
    }

    timeController() {
        if (this.playerStatus !== 1) return
        const c = this.timeCtx.currentTime
        this.currentTime += c - this.startSceneNow
        this.totalTime += c - this.startSceneNow
        if (this.totalTime >= this.totalDuration) {
            this.playerStatus = 0
            return
        }
        this.startSceneNow = this.timeCtx.currentTime
        this.updateTime()
        if (this.currentTime >= this.currentDuration) {
            this.next()
            return
        }
        
        requestAnimationFrame(() => {
            this.timeController()
        })
    }
    updateTime() {
        this.onTimeUpdate({
            currentTime: this.currentTime,
            currentDuration: this.currentDuration,
            totalDuration: this.totalDuration,
            totalTime: this.totalTime,
        })
    }

}


export { TimeController, }
