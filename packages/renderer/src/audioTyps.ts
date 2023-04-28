namespace AudioOptions {
    export interface Options {
        audio: string
        loop: boolean
        startTime: number
        endTime: number
        volume: number
        mute?: boolean
        format?: string
    }
}

export default AudioOptions

