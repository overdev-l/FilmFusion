
namespace RendererOptions {
    export interface Options {
        target: string | HTMLDivElement
        movieWidth: number
        movieHeight: number
    }
    export interface Background {
        type: 1 | 2
        color: string
        image: string
        alpha: number
    }

    export interface Cover {
        type: 1 | 2
        image: string
        alpha: number
        color: string
    }
}

export default RendererOptions
