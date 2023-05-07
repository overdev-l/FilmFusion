import axios from "axios/index"
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
