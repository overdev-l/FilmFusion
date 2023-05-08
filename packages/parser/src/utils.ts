import axios from "axios"
import ParserSubtitle from "srt-parser-2"
const ParserInstance = new ParserSubtitle()
import ParserConfig from "./types"

/**
 * ParserBackgroundAudio
 * @param blob
 * @constructor
 */
export const BlobTransformBlobUrl = (blob: Blob):Promise<string> => new Promise((resolve) => {
    resolve(URL.createObjectURL(blob))
})

/**
 * UrlTransformSubtitle
 * @description: Transform subtitle url to subtitle data
 * @param url
 * @constructor
 */
export const UrlTransformSubtitle = (url: string):Promise<ParserConfig.SubtitleData[]> => new Promise((resolve) => {
    axios.get(url, {
        responseType: "text",
    }).then(({ data, }) => {
        const result = ParserInstance.fromSrt(data)
        resolve(result)
    })
})

export const workString = `
function parserMedia(url) {
    return new Promise((resolve) => {
        const xhr = new XMLHttpRequest()
        xhr.open("GET", url, true)
        xhr.responseType = "blob"
        xhr.onload = function() {
            if (this.status === 200) {
                resolve(this.response)
            } else {
                resolve(null)
            }
        }
        xhr.send()
    })
}

function loadSubtitle(url) {
    return new Promise((resolve) => {
        const xhr = new XMLHttpRequest()
        xhr.open("GET", url, true)
        xhr.responseType = "text"
        xhr.onload = function() {
            if (this.status === 200) {
                resolve(this.response)
            } else {
                resolve(null)
            }
        }
        xhr.send()
    })
}
self.onmessage = async function(e) {
    const result = {
        movieData: null,
        voiceData: null,
        subtitleData: null,
    }
    const { data, } = e
    const { movie } = data.sceneData
    const movieData = await parserMedia(movie.url)
    result.movieData = {
        key: movie.url,
        url: URL.createObjectURL(movieData),
    }
    if (data.sceneData.voice) {
       const voiceData = await parserMedia(data.sceneData.voice.audio)
       result.voiceData = {
              key: data.sceneData.voice.audio,
              url: URL.createObjectURL(voiceData),
       }
    }
    if (data.sceneData.subtitle) {
        const subtitleText = await loadSubtitle(data.sceneData.subtitle.url)
        result.subtitleData = {
            key: data.sceneData.subtitle.url,
            data: subtitleText,
        }
    }
    self.postMessage(result)
 }

`
