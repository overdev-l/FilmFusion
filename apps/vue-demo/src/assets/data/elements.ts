// 元素数据
import { ElementConfig, } from "@film-fusion/core"
export const elementsData:Array<ElementConfig.TextElement | ElementConfig.ImageElement>  = [
    {
        type: 1,
        text: "测试文字",
        name: "element1",
        style: {
            alpha: 90,
            color: "#2399D7",
            fontSize: 100,
            fontFamily: "微软雅黑",
            fontItalic: false,
            fontBold: true,
            align: "center",
            fontStoke: "#FFFB7D",
            fontStokeWidth: 10,
            backgroundColor: "#2BFF88",
            backgroundAlpha: 50,
            backgroundPadding: 40,
        },
        position: {
            x: 0,
            y: 0,
            z: 90,
        },
    },
    {
        type: 2,
        image: "https://image.liuyongzhi.cn/video/ai-draw.tokyo_en_.png",
        name: "element2",
        style: {
            alpha: 100,
        },
        position: {
            x: 1080,
            y: 900,
            z: 80,
            w: 200,
            h: 256,
        },
    },
]
