import Konva from "konva"
namespace ElementOptions {
    export interface Options {
        layer: Konva.Layer
        movieWidth: number
        movieHeight: number
    }
    type ElementValue<T, O, P> = T extends P ? O : never
    export interface AddElementOptions<T extends (1|2)> {
        type: T
        text: ElementValue<T, string, 1>
        image: ElementValue<T, string, 2>
        name: string
        style: {
            alpha: number,
            color: ElementValue<T, string, 1>,
            align: ElementValue<T, "left" | "center" | "right", 1>,
            fontSize: ElementValue<T, number, 1>,
            fontFamily: ElementValue<T, string, 1>,
            fontItalic: ElementValue<T, boolean, 1>,
            fontBold: ElementValue<T, boolean, 1>,
            fontStoke: ElementValue<T, string, 1>,
            fontStokeWidth: ElementValue<T, number, 1>,
            backgroundColor: ElementValue<T, string, 1>,
            backgroundAlpha: ElementValue<T, number, 1>,
            backgroundPadding: ElementValue<T, number, 1>,
        },
        position: {
            x: number
            y: number
            z: number
            w: ElementValue<T, number, 2>
            h: ElementValue<T, number, 2>
        }
    }
}


export default ElementOptions
