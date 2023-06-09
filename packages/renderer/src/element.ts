import Konva from "konva"
import ElementConfig from "./elementTypes"
import { transformColorFormat, getPosition, } from "./utils"
class Element {
    private elements: Array<Konva.Group | Konva.Image>
    private layer: Konva.Layer
    private movieWidth: number
    private movieHeight: number
    constructor(options: ElementConfig.Options) {
        this.layer = options.layer
        this.elements = []
        this.movieWidth = options.movieWidth
        this.movieHeight = options.movieHeight
    }
    public addElement(elements: ElementConfig.ElementOptions[]) {
        for (let i = 0; i < elements.length; i++) {
            const element = elements[i]
            const existElement = this.layer.getChildren().find((item) => item.name() === element.name)
            if (existElement) {
                console.warn(`element name: ${element.name} is exist`)
                continue
            }
            if (element.type === 1) {
                const textGroup = new Konva.Group()
                const textContainer = new Konva.Rect()
                const text = new Konva.Text({
                    text: element.text,
                    fontSize: element.style.fontSize,
                    fontFamily: element.style.fontFamily,
                    fontStyle: element.style.fontItalic ? "italic" : "normal",
                    fontWeight: element.style.fontBold ? "bold" : "normal",
                    fill: element.style.color,
                    align: element.style.align,
                    opacity: element.style.alpha / 100,
                    padding: element.style.backgroundPadding,
                    stroke: element.style.fontStoke,
                    strokeWidth: element.style.fontStokeWidth,
                    fillAfterStrokeEnabled: true,
                    lineJoin: "round",
                })
                const width = text.width() + text.strokeWidth() / 2
                const height = text.height() + text.strokeWidth() / 2
                textContainer.width(width)
                textContainer.height(height)
                text.setPosition({
                    x: width / 2,
                    y: height / 2,
                })
                text.offset({
                    x: text.width() / 2,
                    y: text.height() / 2,
                })
                textContainer.fill(transformColorFormat(element.style.backgroundColor, element.style.backgroundAlpha))
                textGroup.width(textContainer.width())
                textGroup.height(textContainer.height())
                textGroup.add(textContainer)
                textGroup.add(text)
                const position = getPosition(element.position.x, element.position.y, textContainer.width(), textContainer.height(), this.movieWidth, this.movieHeight)
                textGroup.x(position.x)
                textGroup.y(position.y)
                textGroup.offsetX(textContainer.width() / 2)
                textGroup.offsetY(textContainer.height() / 2)
                textGroup.name(element.name)
                this.layer.add(textGroup)
                text.zIndex(element.position.z / 100)
                textContainer.zIndex((element.position.z - 1) / 100)
                this.elements.push(textGroup)
            } else {
                // 图片
                const img = new Image()
                img.src = element.image
                img.onload = () => {
                    const image = new Konva.Image({
                        image: img,
                        width: element.position.w,
                        height: element.position.h,
                    })
                    image.opacity(element.style.alpha / 100)
                    const position = getPosition(element.position.x, element.position.y, image.width(), image.height(), this.movieWidth, this.movieHeight)
                    image.x(position.x)
                    image.y(position.y)
                    image.offsetX(image.width() / 2)
                    image.offsetY(image.height() / 2)
                    image.name(element.name)
                    this.layer.add(image)
                    image.zIndex(element.position.z / 100)
                    this.elements.push(image)
                }
            }
        }
    }
    public removeElement(name: string) {
        const element = this.layer.getChildren().find((element) => element.name() === name)
        if (element) {
            element.destroy()
        } else {
            console.warn(`element name: ${name} is not exist`)
        }
    }
}
export default Element
