import Konva from "konva"
namespace ElementOptions {
    export interface Options {
        layer: Konva.Layer
        movieWidth: number
        movieHeight: number
    }
    type ElementType = 1 | 2
    type ElementValue<T, O, P> = T extends P ? O : never
    export interface AddElementOptions {
        type: ElementType
        text: ElementValue<ElementType, string, 1>
        image: ElementValue<ElementType, string, 2>
        name: string
        style: {
            alpha: number,
            color: ElementValue<ElementType, string, 1>,
            align: ElementValue<ElementType, "left" | "center" | "right", 1>,
            fontSize: ElementValue<ElementType, number, 1>,
            fontFamily: ElementValue<ElementType, string, 1>,
            fontItalic: ElementValue<ElementType, boolean, 1>,
            fontBold: ElementValue<ElementType, boolean, 1>,
            fontStoke: ElementValue<ElementType, string, 1>,
            fontStokeWidth: ElementValue<ElementType, number, 1>,
            backgroundColor: ElementValue<ElementType, string, 1>,
            backgroundAlpha: ElementValue<ElementType, number, 1>,
            backgroundPadding: ElementValue<ElementType, number, 1>,
        },
        position: {
            x: number
            y: number
            z: number
            w: ElementValue<ElementType, number, 2>
            h: ElementValue<ElementType, number, 2>
        }
    }
}


export default ElementOptions
