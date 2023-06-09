namespace TimeControllerConfig {
    export interface Options {
        duration: number
        onTimeUpdate: (time: TimeOption) => void
        nextFiber: () => void
        play: () => void
        pause: () => void
    }
    export interface TimeOption {
        currentTime: number
        currentDuration: number
        totalDuration: number
        totalTime: number
    }
}

export default TimeControllerConfig
