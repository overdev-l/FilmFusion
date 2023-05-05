import Konva from "konva"
namespace ElementConfig {
    export interface Options {
        layer: Konva.Layer
        movieWidth: number
        movieHeight: number
    }
    export type ElementOptions = ImageElement | TextElement
    export interface TextElement {
        type: 1
        text: string
        name: string
        style: {
            alpha: number,
            color: string,
            align: "left" | "center" | "right",
            fontSize: number,
            fontFamily: string,
            fontItalic: boolean,
            fontBold: boolean,
            fontStoke: string,
            fontStokeWidth: number,
            backgroundColor: string,
            backgroundAlpha: number,
            backgroundPadding: number,
        }
        position: {
            x: number
            y: number
            z: number
        }
    }
    export interface ImageElement {
        type: 2
        image: string
        name: string
        style: {
            alpha: number,
        }
        position: {
            x: number
            y: number
            z: number
            w: number
            h: number
        }
    }
}


export default ElementConfig
