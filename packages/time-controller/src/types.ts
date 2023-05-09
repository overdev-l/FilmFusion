namespace TimeControllerConfig {
    export interface Options {
        duration: number
        onTimeUpdate: (time: TimeOption) => void
    }
    export interface TimeOption {
        currentTime: number
        currentDuration: number
        totalDuration: number
        totalTime: number
    }
}

export default TimeControllerConfig
