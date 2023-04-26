<template>
    <div class="w-full h-full">
        <div class="w-full h-[50%] flex">
            <div class="w-[50%] h-full border-b-2 border-indigo-500 border-solid box-border">
                <Card class="h-full flex flex-col gap-6">
                    <template #content>
                        <div class="h-full flex flex-col gap-6">
                            <div class="flex justify-between">
                                <Button label="Play" severity="help" icon="pi pi-play" raised rounded @click="play"/>
                                <Button label="Pause" severity="help" icon="pi pi-pause" raised rounded @click="pause"/>
                            </div>
                            <div class="flex gap-6 h-[40px] items-center  justify-between">
                                <Badge :value="refs.videoVolume" class="flex1"></Badge>
                                <Slider v-model="refs.videoVolume" class="w-14rem w-[60%]" />
                                <Button label="Set Video Volume" icon="pi pi-cog" raised rounded class="w-[30%]" @click="setVideoVolume"/>
                            </div>
                            <div class="flex gap-6 h-[40px] items-center justify-between">
                                <Badge :value="refs.backgroundVolume" class="flex1"></Badge>
                                <Slider v-model="refs.backgroundVolume" class="w-14rem w-[60%]" />
                                <Button label="Set Background Volume" icon="pi pi-cog" raised rounded class="w-[30%]" @click="setBackgroundVolume"/>
                            </div>
                            <div class="flex gap-6 h-[40px] items-center  justify-between">
                                <Badge :value="refs.voiceVolume" class="flex1"></Badge>
                                <Slider v-model="refs.voiceVolume" class="w-14rem w-[60%]" />
                                <Button label="Set Voice Volume" icon="pi pi-cog" raised rounded class="w-[30%]" @click="setVoiceVolume"/>
                            </div>
                        </div>
                    </template>
                </Card>

            </div>
            <div class="w-[50%] h-full border-b-2 border-l-2 border-indigo-500 border-solid box-border" id="player"></div>
        </div>
        <div class="w-full h-[50%] flex">
            <div class="flex-1 h-full border-r-2 border-indigo-500 border-solid box-border"></div>
            <div class="flex-1 h-full box-border"></div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive } from 'vue';
import Renderer from '@film-fusion/renderer';
import Button from "primevue/button"
import Card from 'primevue/card';
import Slider from 'primevue/slider';
import Badge from 'primevue/badge';
const refs = reactive<any>({
    render: null,
    videoVolume: 100,
    backgroundVolume: 100,
    voiceVolume: 100,
})
const initRender = () => {
    refs.render = new Renderer({
        target: "#player",
        movieWidth: 1920,
        movieHeight: 1080
    })
    setTimeout(() => {
        // refs.render.setCover({
        //     type: 2,
        //     color: '',
        //     image: 'https://image.liuyongzhi.cn/video/bg1.jpg',
        //     alpha: 100
        // })
        refs.render.setBackground({
            type: 1,
            color: '#93E9',
            image: '',
            alpha: 50
        })
        refs.render.addElements([
            {
                type: 1,
                text: "测试文字",
                name: "element1",
                style: {
                    alpha: 90,
                    color: '#2399D7',
                    fontSize: 100,
                    fontFamily: '微软雅黑',
                    fontItalic: false,
                    fontBold: true,
                    align: 'center',
                    fontStoke: '#FFFB7D',
                    fontStokeWidth: 10,
                    backgroundColor: '#2BFF88',
                    backgroundAlpha: 50,
                    backgroundPadding: 20,
                },
                position: {
                    x: 0,
                    y: 0,
                    z: 90,
                }
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
                }
            },
        ])
        refs.render.setMovie({
            type: 2,
            url: "https://image.liuyongzhi.cn/video/pexels-3456%E2%80%8A%C3%97%E2%80%8A5184.jpg",
            volume: 100,
            loop: true,
            startTime: 5000,
            endTime: 10000,
        })
        setTimeout(() => {
            refs.render.setMovie({
                type: 1,
                url: "https://image.liuyongzhi.cn/video/video1.mp4",
                volume: 100,
                loop: true,
                startTime: 5000,
                endTime: 10000,
            })
        }, 1000)
    }, 2000)
}
window.addEventListener('resize', () => {
    refs.render.resize()
})
const play = () => {
    refs.render.play()
}
const pause = () => {
    refs.render.pause()
}
const setVideoVolume = () => {
    refs.render.setVideoVolume(refs.videoVolume)
}
const setBackgroundVolume = () => {
    refs.render.setBackgroundVolume(refs.backgroundVolume)
}
const setVoiceVolume = () => {
    refs.render.setVoiceVolume(refs.voiceVolume)
}
onMounted(initRender)
</script>