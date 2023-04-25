import Konva from "konva"
import ElementOptions from "./elementTypes"
import { transformColorFormat, getPosition, } from "./utils"
class Element {
    private elements: Array<Konva.Group>
    private layer: Konva.Layer
    constructor(options: ElementOptions.Options) {
        this.layer = options.layer
        this.elements = []
    }
    public addElement(elements: ElementOptions.AddElementOptions[]) {
        for (let i = 0; i < elements.length; i++) {
            const element = elements[i]
            console.log(element.position.z / 100, element.type)
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
                    opacity: element.style.alpha,
                    padding: element.style.backgroundPadding,
                    stroke: element.style.fontStoke,
                    strokeWidth: element.style.fontStokeWidth,
                    fillAfterStrokeEnabled: true,
                    lineJoin: "round",
                })
                textContainer.width(text.width())
                textContainer.height(text.height())
                textContainer.fill(transformColorFormat(element.style.backgroundColor, element.style.backgroundAlpha))
                textGroup.width(textContainer.width())
                textGroup.height(textContainer.height())
                textGroup.add(textContainer)
                textGroup.add(text)
                const position = getPosition(element.position.x, element.position.y, textContainer.width(), textContainer.height(), this.layer.width(), this.layer.height())
                textGroup.x(position.x)
                textGroup.y(position.y)
                textGroup.offsetX(textContainer.width() / 2)
                textGroup.offsetY(textContainer.height() / 2)
                textGroup.name(element.name)
                this.layer.add(textGroup)
                textGroup.setZIndex(element.position.z / 100)
                this.elements.push(textGroup)
            } else {
                // 图片
                const imageGroup = new Konva.Group()
                const img = new Image()
                img.src = element.image
                img.onload = () => {
                    const image = new Konva.Image({
                        image: img,
                        width: element.position.w,
                        height: element.position.h,
                    })
                    image.opacity(element.style.alpha / 100)
                    imageGroup.width(element.position.w)
                    imageGroup.height(element.position.w)
                    const position = getPosition(element.position.x, element.position.y, imageGroup.width(), imageGroup.height(), this.layer.width(), this.layer.height())
                    imageGroup.x(position.x)
                    imageGroup.y(position.y)
                    imageGroup.offsetX(imageGroup.width() / 2)
                    imageGroup.offsetY(imageGroup.height() / 2)
                    imageGroup.name(element.name)
                    imageGroup.add(image)
                    this.layer.add(imageGroup)
                    imageGroup.setZIndex(element.position.z / 100)
                    this.elements.push(imageGroup)
                }
            }
        }
    }
}
export default Element
