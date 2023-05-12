import ElementConfig from "./elementTypes"
export const getTargetScale = (targetWidth: number, targetHeight: number, containerWidth: number, containerHeight: number) => {
    const containerRatio = containerWidth / containerHeight
    const videoRatio = targetWidth / targetHeight
    let scale = 1
    if (containerRatio > videoRatio) {
        scale = containerHeight / targetHeight
    } else {
        scale = containerWidth / targetWidth
    }
    return scale
}

export const transformColorFormat = (color: string, alpha = 1): string => {
    const colorFormat = checkColorFormat(color)
    if (colorFormat === "hex") return hexToRgba(color, alpha)
    if (colorFormat === "rgb") return rgbToRgba(color, alpha)
    if (colorFormat === "rgba") return color
    return ""
}

const hexToRgba = (hex: string, alpha = 1): string => {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

const rgbToRgba = (rgb: string, alpha = 1): string => {
    if (!/^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/i.test(rgb)) {
        throw new Error("Invalid color format: " + rgb)
    }
    const matches = rgb.match(/\d+/g) as RegExpMatchArray
    const r = parseInt(matches[0])
    const g = parseInt(matches[1])
    const b = parseInt(matches[2])
    
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

const checkColorFormat = (color: string) => {
    const hexRegex = /^#([0-9a-f]{3}){1,2}$/i
    const rgbRegex = /^rgb(a)?\(\s*\d+\s*,\s*\d+\s*,\s*\d+(,\s*[\d.]+\s*)?\)$/i
  
    if (hexRegex.test(color)) {
        return "hex"
    } else if (rgbRegex.test(color)) {
        return color.includes("a") ? "rgba" : "rgb"
    }
}

export const getPosition = (x: number, y: number, width: number, height: number, maxX: number, maxY: number) => {
    const position = {
        x: Math.min(Math.max(x, width / 2), maxX - width / 2),
        y: Math.min(Math.max(y, height / 2), maxY - height/ 2),
    }
    return position
}

export const defaultSubtitleStyle: Omit<ElementConfig.TextElement, "type" | "name"| "text"> = {
    style: {
        alpha: 100,
        color: "#000000",
        fontSize: 14,
        fontFamily: "微软雅黑",
        fontItalic: false,
        fontBold: false,
        align: "center",
        fontStoke: "",
        fontStokeWidth: 0,
        backgroundColor: "",
        backgroundAlpha: 100,
        backgroundPadding: 20,
    },
    position: {
        x: 0,
        y: 0,
        z: 0,
    },
}
