
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
