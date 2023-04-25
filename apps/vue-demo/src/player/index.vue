<template>
    <div class="w-full h-full">
        <div class="w-full h-[50%] flex">
            <div class="w-[50%] h-full border-b-2 border-indigo-500 border-solid box-border"></div>
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
const refs = reactive<any>({
    render: null
})
 const initRender = () => {
    refs.render = new Renderer({
        target: "#player",
        movieWidth: 1920,
        movieHeight: 1080
    })
    setTimeout(() => {
        refs.render.setCover({
            type: 2,
            color: '',
            image: 'https://image.liuyongzhi.cn/video/bg1.jpg',
            alpha: 100
        })
        refs.render.setBackground({
            type: 1,
            color: '#93E9',
            image: '',
            alpha: 50
        })
    }, 2000)
 }
 window.addEventListener('resize', () => {
    refs.render.resize()
 })
 onMounted(initRender)
</script>