import JSONEditor from "jsoneditor"

export namespace ParserData {
    export interface PageData {
        sourceEditor: JSONEditor | undefined
        currentEditor: JSONEditor | undefined
        cacheEditor: JSONEditor | undefined
    }
}
