import RendererOptions from "./types"
import ElementOptions from "./elementTypes"
import Konva from "konva"
import { getTargetScale, } from "./utils"
import Element from "./element"
import AudioElement from "./audio"
import AudioOptions from "./audioTyps"
class Renderer {
    private target: HTMLDivElement
    private stage: Konva.Stage
    private mediaTarget: HTMLVideoElement | HTMLImageElement
    private movieTarget: Konva.Image
    private coverTarget: Konva.Rect
    private backgroundLayer: Konva.Layer
    private backgroundElements: AudioElement
    private movieLayer: Konva.Layer
    private elementsLayer: Konva.Layer
    private subtitleLayer: Konva.Layer
    private coverLayer: Konva.Layer
    private movieAnimation: Konva.Animation
    private elementAnimation: Konva.Animation
    private backgroundRect: Konva.Rect
    private elementTarget: Element
    private subtitleText: Konva.Text
    private movieWidth: number
    private movieHeight: number
    private scale: number
    constructor(options: RendererOptions.Options) {
        if (options.target instanceof HTMLDivElement) {
            this.target = options.target
        } else {
            const target = document.querySelector(options.target)
            if (!target) {
                console.warn("the target node does not exist")
                return
            } else {
                this.target = target as HTMLDivElement
            }
        }
        this.movieHeight = options.movieHeight
        this.movieWidth = options.movieWidth
        this.initScale()
        this.initStage()
        this.initLayers()
        this.initElements()
        this.initBackgroundElements()
    }
    private initScale() {
        const scaleX = this.target.clientWidth / this.movieWidth
        const scaleY = this.target.clientHeight / this.movieHeight
        this.scale = Math.min(scaleX, scaleY)
    }
    private initStage() {
        this.stage = new Konva.Stage({
            container: this.target,
            width: this.target.clientWidth,
            height: this.target.clientHeight,
            background: "transparent",
        })
    }
    private initLayers() {
        this.backgroundLayer = new Konva.Layer({
            name: "background",
        })
        this.movieLayer = new Konva.Layer({
            name: "movie",
        })
        this.elementsLayer = new Konva.Layer({
            name: "elements",
        })
        this.subtitleLayer = new Konva.Layer({
            name: "subtitle",
        })
        this.coverLayer = new Konva.Layer({
            name: "cover",
        })
        this.stage.add(this.backgroundLayer)
        this.stage.add(this.movieLayer)
        this.stage.add(this.elementsLayer)
        this.stage.add(this.subtitleLayer)
        this.stage.add(this.coverLayer)
        this.initLayersPosition()
        this.initBackgroundRect()
    }
    private initElements() {
        this.elementTarget = new Element({
            layer: this.elementsLayer,
            movieWidth: this.movieWidth,
            movieHeight: this.movieHeight,
        })
    }
    private layerAnimation() {
        this.movieAnimation = new Konva.Animation((frame) => {
            //
        }, this.movieLayer)
    }
    private initBackgroundElements() {
        this.backgroundElements = new AudioElement()
    }
    /**
     *  计算图层大小位置
     */
    private initLayersPosition() {
        this.backgroundLayer
            .setPosition({
                x: this.stage.width() / 2 - this.movieWidth * this.scale / 2,
                y: this.stage.height() / 2 - this.movieHeight * this.scale / 2,
            }).scale({
                x: this.scale,
                y: this.scale,
            }).zIndex(0)
        this.movieLayer.setPosition({
            x: this.stage.width() / 2 - this.movieWidth * this.scale / 2,
            y: this.stage.height() / 2 - this.movieHeight * this.scale / 2,
        }).scale({
            x: this.scale,
            y: this.scale,
        }).zIndex(1)
        this.elementsLayer.setPosition({
            x: this.stage.width() / 2 - this.movieWidth * this.scale / 2,
            y: this.stage.height() / 2 - this.movieHeight * this.scale / 2,
        }).scale({
            x: this.scale,
            y: this.scale,
        }).zIndex(2)
        this.subtitleLayer.setPosition({
            x: this.stage.width() / 2 - this.movieWidth * this.scale / 2,
            y: this.stage.height() / 2 - this.movieHeight * this.scale / 2,
        }).scale({
            x: this.scale,
            y: this.scale,
        }).zIndex(3)
        this.coverLayer.setPosition({
            x: this.stage.width() / 2 - this.movieWidth * this.scale / 2,
            y: this.stage.height() / 2 - this.movieHeight * this.scale / 2,
        }).scale({
            x: this.scale,
            y: this.scale,
        }).zIndex(4)
    }
    /**
     * 初始化默认背景
     */
    private initBackgroundRect() {
        this.backgroundRect = new Konva.Rect({
            x: 0,
            y: 0,
            width: this.movieWidth,
            height: this.movieHeight,
            fill: "black",
        })
        this.backgroundLayer.add(this.backgroundRect)
    }
    /**
     * updateMovieLayer
     * 更新视频预览
     * @param target 
     */
    private updateMovieLayer(target: HTMLVideoElement) {
        requestAnimationFrame(() => {
            this.movieLayer.draw()
            if (target.readyState !== 4) {
                this.updateMovieLayer(target)
            }
        })
    }
    /**
     * videoPlayEvent
     * video loop
     * @param options 
     * @param target 
     */
    private videoPlayEvent(options: RendererOptions.MovieOptions, target: HTMLVideoElement) {
        const currentTime = target.currentTime * 1000
        if (currentTime> options.endTime && options.loop) {
            target.currentTime = options.startTime / 1000
            target.play()
        }
    }
    /** 
     * setMovie
     */
    public setMovie(options: RendererOptions.MovieOptions) {
        this.movieLayer.destroyChildren()
        if (options.type === 2) {
            this.mediaTarget = new Image()
            this.mediaTarget.src = options.url
            this.mediaTarget.onload = () => {
                this.movieTarget = new Konva.Image({
                    image: this.mediaTarget,
                    x: this.movieWidth / 2,
                    y: this.movieHeight / 2,
                })
                    .scale({
                        x: getTargetScale(this.mediaTarget.width, this.mediaTarget.height, this.movieWidth, this.movieHeight),
                        y: getTargetScale(this.mediaTarget.width, this.mediaTarget.height, this.movieWidth, this.movieHeight),
                    })
                    .offset({
                        x: this.mediaTarget.width / 2,
                        y: this.mediaTarget.height / 2,
                    })
                this.movieLayer.add(this.movieTarget)
            }
        } else if (options.type === 1) {
            let target: HTMLVideoElement
            this.mediaTarget = target = document.createElement("video") 
            this.mediaTarget.src = options.url
            target.addEventListener("timeupdate", this.videoPlayEvent.bind(this, options, target))
            this.mediaTarget.onloadeddata = () => {
                target.currentTime = options.startTime / 1000
                target.volume = options.volume / 100
                this.movieTarget = new Konva.Image({
                    image: this.mediaTarget,
                    x: this.movieWidth / 2,
                    y: this.movieHeight / 2,
                    width: target.videoWidth,
                    height: target.videoHeight,
                })
                    .scale({
                        x: getTargetScale(target.videoWidth, target.videoHeight, this.movieWidth, this.movieHeight),
                        y: getTargetScale(target.videoWidth, target.videoHeight, this.movieWidth, this.movieHeight),
                    })
                    .offset({
                        x: target.videoWidth / 2,
                        y: target.videoHeight / 2,
                    })
                this.movieTarget.width()
                this.movieLayer.add(this.movieTarget)
                this.layerAnimation()
                this.updateMovieLayer(target)
            }
        }
    }

    /**
     * setVideoVolume
     * 设置视频音量
     * @param volume 
     */
    public setVideoVolume(volume: number) {
        if (this.mediaTarget instanceof HTMLVideoElement) {
            this.mediaTarget.volume = volume / 100
        } else {
            console.warn("the current scene is not a video")
        }
    }
    /**
     * setBackgroundMusicAudio
     * @param volume 
     */
    public setBackgroundMusicAudioVolume(volume: number) {
        this.backgroundElements.setAudiosVolume(volume)
    }
    /**
     * resize
     * 重新计算舞台大小
     */
    public resize() {
        requestAnimationFrame(() => {
            this.stage.width(this.target.clientWidth)
            this.stage.height(this.target.clientHeight)
            this.initScale()
            this.initLayersPosition()
        })
    }
    /**
     * setBackground
     * @param Background 
     * @param Background.type 1. color 2. image
     */
    public setBackground(background: RendererOptions.Background) {
        if (background.type === 1) {
            this.backgroundRect.fill(background.color)
            this.backgroundRect.alpha(background.alpha)
        } else if (background.type === 2) {
            const image = new Image()
            image.src = background.image
            image.onload = () => {
                this.backgroundRect.fillPatternImage(image)
                this.backgroundRect.fill("")
                this.backgroundRect.alpha(background.alpha / 100)
                this.backgroundRect.fillPatternRepeat("no-repeat")
                this.backgroundRect.fillPatternScale({
                    x: this.backgroundRect.width() / image.width,
                    y: this.backgroundRect.height() / image.height,
                })
            }
        }
    }
    /**
     * setCover
     * @param Cover 
     * @param Cover.type 1. color 2. image
     */
    public setCover(cover: RendererOptions.Cover) {
        this.coverLayer.destroyChildren()
        if (cover.type === 1) {
            this.coverTarget = new Konva.Rect({
                x: 0,
                y: 0,
                width: this.movieWidth,
                height: this.movieHeight,
            }).fill(cover.color).alpha(cover.alpha)
            this.coverLayer.add(this.coverTarget)
        } else {
            const image = new Image()
            image.src = cover.image
            image.onload = () => {
                this.coverTarget = new Konva.Rect({
                    x: this.movieWidth / 2,
                    y: this.movieHeight / 2,
                    width: image.width,
                    height: image.height,
                })
                    .scale({
                        x: getTargetScale(image.width, image.height, this.movieWidth, this.movieHeight),
                        y: getTargetScale(image.width, image.height, this.movieWidth, this.movieHeight),
                    })
                    .offset({
                        x: image.width / 2,
                        y: image.height / 2,
                    })
                    .fillPatternImage(image)
                    .alpha(cover.alpha / 100)
                    .fillPatternRepeat("no-repeat")
                this.coverLayer.add(this.coverTarget)
            }
        }

    }
    /**
     * addElements
     * @param elements.type 1. image 2. text 
     */
    public addElements(elements: ElementOptions.AddElementOptions[]) {
        this.elementTarget.addElement(elements)
    }
    /**
     * removeElements
     * @param ids 
     */
    public removeElements(ids: string[]) {
        for(const id of ids) {
            this.elementTarget.removeElement(id)
        }
    }
    /**
     * setBackgroundAudios
     * @param audios 
     */
    public setBackgroundAudios(audios: AudioOptions.Options[]) {
        this.backgroundElements.setAudios(audios)
    }

    public play() {
        if (this.mediaTarget instanceof HTMLVideoElement) {
            this.mediaTarget.play()
            this.movieAnimation.start()
        }
        if (this.backgroundElements instanceof AudioElement) {
            this.backgroundElements.play()
        }
    }
    public pause() {
        if (this.mediaTarget instanceof HTMLVideoElement) {
            this.mediaTarget.pause()
            this.movieAnimation.stop()
        }
        if (this.backgroundElements instanceof AudioElement) {
            this.backgroundElements.pause()
        }
    }
}

export default Renderer

