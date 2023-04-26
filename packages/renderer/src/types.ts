
namespace RendererOptions {
    type ElementType = 1 | 2 // 1. (视频 | 颜色) 2. 图片
    type ElementValue<T, O, P> = T extends P ? O : never
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
        type: ElementType
        image: ElementValue<ElementType, string, 2>
        alpha: number
        color: ElementValue<ElementType, string, 1>
    }

    export interface MovieOptions {
        type: ElementType
        url: string
        volume: ElementValue<ElementType, number, 1>
        loop: ElementValue<ElementType, boolean, 1>
        startTime: ElementValue<ElementType, number, 1>
        endTime: ElementValue<ElementType, number, 1>
    }
}

export default RendererOptions
