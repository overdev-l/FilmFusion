<template>
    <div class="w-full h-full">
        <div class="w-full h-[50%] flex">
            <div class="w-[50%] h-full box-border flex-col gap-6 p-[1.25rem] overflow-y-scroll">
                <div class="h-full flex flex-col gap-6">
                    <div class="flex justify-between">
                        <Button label="Play" severity="help" icon="pi pi-play" raised rounded @click="timeControllerPlay" />
                        <Button label="Pause" severity="help" icon="pi pi-pause" raised rounded @click="timeControllerPause" />
                        <Button label="Replay" severity="help" icon="pi pi-sync" raised rounded @click="timeControllerReplay" />
                    </div>
                    <div class="flex justify-between">
                        <Button label="Next Scenes" severity="help" icon="pi pi-sync" raised rounded @click="nextScene" />
                    </div>
                    <div class="flex gap-6 h-[40px] items-center  justify-between">
                        <Badge :value="refs.videoVolume" class="flex1"></Badge>
                        <Slider v-model="refs.videoVolume" class="w-14rem w-[60%]" />
                        <Button label="Set Video Volume" icon="pi pi-cog" raised rounded class="w-[30%]"
                            @click="setVideoVolume" />
                    </div>
                    <div class="flex gap-6 h-[40px] items-center justify-between">
                        <Badge :value="refs.backgroundVolume" class="flex1"></Badge>
                        <Slider v-model="refs.backgroundVolume" class="w-14rem w-[60%]" />
                        <Button label="Set Background Volume" icon="pi pi-cog" raised rounded class="w-[30%]"
                            @click="setBackgroundVolume" />
                    </div>
                    <div class="flex gap-6 h-[40px] items-center  justify-between">
                        <Badge :value="refs.voiceVolume" class="flex1"></Badge>
                        <Slider v-model="refs.voiceVolume" class="w-14rem w-[60%]" />
                        <Button label="Set Voice Volume" icon="pi pi-cog" raised rounded class="w-[30%]"
                            @click="setVoiceVolume" />
                    </div>
                    <div class="flex gap-6 h-[40px] items-center  justify-between">
                        <div class="p-inputgroup">
                            <Button label="Remove Elements" severity="help" icon="pi pi-trash" raised
                                @click="removeElements" />
                            <InputText placeholder="Element Name" class="p-inputtext-sm" v-model="refs.elementNames" />
                        </div>
                        <Button label="Add elements" severity="help" icon="pi pi-plus" raised rounded
                            @click="addElements" />
                    </div>
                    <div class="flex gap-6 h-[40px] items-center  justify-between">
                        <Button label="Export Video" severity="help" icon="pi pi-file-export" raised rounded
                            @click="generateVideo" />
                    </div>
                </div>
            </div>
            <div class="w-[50%] h-full box-border" id="player"></div>
        </div>
        <div class="w-full h-[50%] flex">
            <div class="flex-1 h-full box-border">
                <TabView class="w-full h-full flex flex-col">
                    <TabPanel header="Scenes">
                        <div class="w-full h-full" ref="ScenesRef"></div>
                    </TabPanel>
                    <TabPanel header="Background Music">
                        <div class="w-full h-full" id="BackgroundMusic" ref="BackgroundMusicRef"></div>
                    </TabPanel>
                    <TabPanel header="Elements">
                        <div class="w-full h-full" id="Elements" ref="ElementsRef"></div>
                    </TabPanel>
                </TabView>
            </div>
            <div class="flex-1 h-full box-border p-[1.25rem]">
                <ProgressBar :value="refs.progress" />
                <div class="w-full mt-2">
                    <div class="w-full mt-2 flex flex-row gap-4 justify-between">
                        <div class="flex-1">
                            <Tag icon="pi pi-clock" severity="info" value="Current Time" />
                            <div class="text-ml font-medium text-slate-900">
                                {{ refs.currentTime }}
                            </div>
                        </div>
                        <div>
                            <Tag icon="pi pi-clock" severity="info" value="Current Duration" />
                            <div class="text-ml font-medium text-slate-900">
                                {{ refs.currentDuration }}
                            </div>
                        </div>
                        <div>
                            <Tag icon="pi pi-clock" severity="info" value="Total Duration" />
                            <div class="text-ml font-medium text-slate-900">
                                {{ refs.totalDuration }}
                            </div>
                        </div>
                        <div class="flex-1">
                            <Tag icon="pi pi-clock" severity="info" value="Total Time" />
                            <div class="text-ml font-medium text-slate-900">
                                {{ refs.totalTime }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue';
import {Renderer, RendererConfig,Parser, ParserConfig,TimeController } from "@film-fusion/core"
import { generate } from "@film-fusion/generate"
import Button from "primevue/button"
import InputText from 'primevue/inputtext';
import Slider from 'primevue/slider';
import Badge from 'primevue/badge';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import ProgressBar from 'primevue/progressbar';
import Tag from 'primevue/Tag';
import {
    elementsData,
    backgroundImageData,
    movieVideoData1920_1080_9s,
    movieVideo1080_1920_5000ms,
    movieVideo1920_1080_5000ms,
    backgroundMusicData_122000ms

} from './mock'
import JSONEditor from 'jsoneditor'
import 'jsoneditor/dist/jsoneditor.min.css'
const refs = reactive<any>({
    render: null,
    parser: null,
    timeController: null,
    videoVolume: 100,
    backgroundVolume: 100,
    voiceVolume: 100,
    progress: 0,
    ScenesEditor: undefined,
    BackgroundMusicEditor: undefined,
    ElementsEditor: undefined,
    elementNames: elementsData.map(item => item.name).join(','),
    currentTime: 0,
    currentDuration: 0,
    totalTime: 0,
    totalDuration: 0
})
const ScenesRef = ref<HTMLElement>()
const BackgroundMusicRef = ref<HTMLElement>()
const ElementsRef = ref<HTMLElement>()
const status = ref<boolean>(false)
const initParser = () => {
    refs.render = new Renderer({
        target: "#player",
        movieWidth: 1080,
        movieHeight: 1920,
        onSceneReady: () => {
            if (status.value) {
                refs.timeController.play()
            }
        }
    })
    refs.parser = new Parser({
        backgroundAudio: refs.BackgroundMusicEditor.get(),
        scenes: refs.ScenesEditor.get(),
        elements: refs.ElementsEditor.get(),
        background: backgroundImageData as RendererConfig.Background,
        firstLoaded: firstRender,
    })
    refs.timeController = new TimeController({
        duration: refs.ScenesEditor.get().reduce((pre: number,nex: any) => pre + nex.duration,0),
        onTimeUpdate: (time) => {
            refs.currentTime = time.currentTime
            refs.currentDuration = time.currentDuration
            refs.totalTime = time.totalTime
            refs.totalDuration = time.totalDuration
            refs.progress = time.totalTime / time.totalDuration * 100
            refs.render.setSceneSubtitle(time.currentTime)
        },
        nextFiber: async () => {
            const fiber = await refs.parser.nextFiber()
            refs.timeController.setCurrentTime(fiber.sceneData.duration)
            refs.render.setMovie(fiber.sceneData)
            if (fiber.isHead) {
                refs.render.setBackground(fiber.background)
                refs.render.setBackgroundAudios(fiber.backgroundAudio)
                refs.render.addElements(fiber.elements)
            }
        },
        play: () => {
            refs.render.play()
        },
        pause: () => {
            refs.render.pause()
        },
    })
}
const firstRender = (fiber: ParserConfig.SceneFiber, background: any, elements: any, backgroundAudio: any) => {
    refs.render.setBackground(background)
    refs.render.setMovie(fiber.sceneData)
    refs.render.setBackgroundAudios(backgroundAudio)
    refs.render.addElements(elements)
    refs.timeController.setCurrentTime(fiber.sceneData.duration)
}
window.addEventListener('resize', () => {
    refs.render.resize()
})


const initScenesJsonEditor = () => {
    refs.ScenesEditor = new JSONEditor(ScenesRef.value as HTMLElement, {
        mode: "form",
        language: "en"
    }, [movieVideoData1920_1080_9s, movieVideo1080_1920_5000ms, movieVideo1920_1080_5000ms])
}
const initBackgroundMusicJsonEditor = () => {
    refs.BackgroundMusicEditor = new JSONEditor(BackgroundMusicRef.value as HTMLElement, {
        mode: "form",
        language: "en"
    }, backgroundMusicData_122000ms)
}
const initElementsJsonEditor = () => {
    refs.ElementsEditor = new JSONEditor(ElementsRef.value as HTMLElement, {
        mode: "form",
        language: "en"
    }, elementsData)
}
const setVideoVolume = () => {
    refs.render.setVideoVolume(refs.videoVolume)
}
const setBackgroundVolume = () => {
    refs.render.setBackgroundMusicAudioVolume(refs.backgroundVolume)
}
const setVoiceVolume = () => {
    refs.render.setVoiceMusicAudioVolume(refs.voiceVolume)
}
const addElements = () => {
    refs.render.addElements(refs.ElementsEditor.get())
}
const removeElements = () => {
    const elementNames = refs.elementNames.split(",")
    refs.render.removeElements(elementNames)
}

const nextScene = async () => {
    console.log(await refs.parser.nextFiber())
}

const timeControllerPlay = () => {
    refs.timeController.play()
    status.value = true
}
const timeControllerPause = () => {
    refs.timeController.pause()
}

const timeControllerReplay = () => {
    refs.timeController.update({
        duration: refs.ScenesEditor.get().reduce((pre: number,nex: any) => pre + nex.duration,0),
        onTimeUpdate: (time: {currentTime: number, currentDuration: number,totalTime: number,totalDuration: number,}) => {
            refs.currentTime = time.currentTime
            refs.currentDuration = time.currentDuration
            refs.totalTime = time.totalTime
            refs.totalDuration = time.totalDuration
            refs.progress = time.totalTime / time.totalDuration * 100
            refs.render.setSceneSubtitle(time.currentTime)
        },
        nextFiber: async () => {
            const fiber = await refs.parser.nextFiber()
            refs.timeController.setCurrentTime(fiber.sceneData.duration)
            refs.render.setMovie(fiber.sceneData)
            if (fiber.isHead) {
                refs.render.setBackground(fiber.background)
                refs.render.setBackgroundAudios(fiber.backgroundAudio)
                refs.render.addElements(fiber.elements)
            }
        },
        play: () => {
            refs.render.play()
        },
        pause: () => {
            refs.render.pause()
        },
    })
}

const generateVideo = async () => {
    const result = await refs.parser.parserAllFiber()
    await generate(true, result)
}
onMounted(initScenesJsonEditor)
onMounted(initBackgroundMusicJsonEditor)
onMounted(initElementsJsonEditor)
onMounted(initParser)
</script>

<style>
.p-tabview-panels {
    flex: 1;
}

.p-tabview-panel {
    height: 100%;
}
</style>
