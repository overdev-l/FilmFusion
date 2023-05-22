import { createFFmpeg, } from "@ffmpeg/ffmpeg"

import ParseConfig from "../../parser/src/types"
const generate = async (log: boolean, fiber: ParseConfig.SceneFiber | null) => {
    if (!fiber) return
    const inputs = []
    const duration = 0
    const filter = ""
    const videPath = fiber.sceneData.movie.url
    const startTime = fiber.sceneData.movie.startTime
    const endTime = fiber.sceneData.movie.endTime
    // while (fiber) {
    //     const videPath = fiber.sceneData.movie.url
    //     const startTime = fiber.sceneData.movie.startTime
    //     const endTime = fiber.sceneData.movie.endTime
    //     duration += endTime - startTime
    //     filter += `[${inputs.length - 1}:v] [${inputs.length - 1}:a] `
    //     inputs.push(`-i ${videPath} -ss ${startTime} -to ${endTime} -async 1`)
    //     fiber = fiber.nextScene
    // }
    // const output = `-filter_complex "${filter}concat=n=${inputs.length}:v=1:a=1[out]" -map "[out]" -t ${duration} -c:v libx264 -c:a aac -strict -2 output.mp4`

    const ffmpeg = createFFmpeg({ log, })
    await ffmpeg.load()
    await ffmpeg.run(`-i ${videPath} -ss ${startTime} -to ${endTime} -async 1`, "output.mp4")
}

export {
    generate,
}
