// 字幕数据
import { RendererConfig, } from "@film-fusion/core"
export const subtitleData: RendererConfig.SceneData["subtitle"] = {
    url: "https://image.liuyongzhi.cn/video/video2subtitle.srt",
    style: {
        alpha: 100,
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
        backgroundPadding: 20,
    },
    position: {
        x: 540,
        y: 1920,
        z: 100,
    },
}
// 配音数据
export const voiceMusicData_51591_75ms = {
    audio: "https://image.liuyongzhi.cn/video/description.mp3",
    loop: false,
    startTime: 0,
    endTime: 51591.75,
    volume: 100,
    mute: false,
    id: "123",
}
// 场景数据
export const movieVideoData1920_1080_9s: RendererConfig.SceneData = {
    movie: {
        type: 1,
        url: "https://image.liuyongzhi.cn/video/pexels-1920%E2%80%8A%C3%97%E2%80%8A1080-9s.mp4",
        volume: 100,
        loop: true,
        startTime: 5000,
        endTime: 9000,
    },
    voice: voiceMusicData_51591_75ms,
    subtitle: subtitleData,
    duration: 5000,
}
export const movieVideo1080_1920_5000ms = {
    movie: {
        type: 1,
        url: "https://image.liuyongzhi.cn/video/Walk_15000ms.mp4",
        volume: 100,
        loop: true,
        startTime: 0,
        endTime: 15000,
    },
    voice: {
        audio: "https://image.liuyongzhi.cn/video/Walk_24336.mp3",
        loop: false,
        startTime: 0,
        endTime: 5000,
        volume: 100,
        mute: false,
    },
    duration: 5000,
}
export const movieVideo1920_1080_5000ms: RendererConfig.SceneData = {
    movie: {
        type: 1,
        url: "https://image.liuyongzhi.cn/video/pexels_1920_1080_19000ms.mp4",
        volume: 100,
        loop: true,
        startTime: 0,
        endTime: 15000,
    },
    voice: {
        audio: "https://image.liuyongzhi.cn/video/pexels_22932ms.mp3",
        loop: false,
        startTime: 0,
        endTime: 5000,
        volume: 100,
        mute: false,
        id: "1",
    },
    duration: 5000,
}
