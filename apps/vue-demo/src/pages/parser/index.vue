<script setup lang="ts">
import Button from 'primevue/button'
import JSONEditor from 'jsoneditor'
import 'jsoneditor/dist/jsoneditor.min.css'
import {onBeforeUnmount, onMounted, reactive} from "vue"
import { ParserConfig } from "@film-fusion/core"

import { ParserData } from "./types.ts"
import { movieVideoData1920_1080_9s, movieVideo1920_1080_5000ms } from "../../assets/data/scene.ts"
import { elementsData } from "../../assets/data/elements.ts"
import { backgroundImageData } from "../../assets/data/background.ts"
import { backgroundMusicData_122000ms } from "../../assets/data/bgAudio.ts"
const data = reactive<ParserData.PageData>({
  sourceEditor: undefined,
  currentEditor: undefined,
  cacheEditor: undefined,
})
const parserConfig = reactive<Omit<ParserConfig.Options, "firstLoaded">>({
  scenes: [movieVideoData1920_1080_9s, movieVideo1920_1080_5000ms],
  background: backgroundImageData,
  elements: elementsData,
})
onMounted(() => {
  initSourceJsonEditor()
  initCurrentJsonEditor()
  initCacheJsonEditor()
})
onBeforeUnmount(() => {
  data.sourceEditor?.destroy()
  data.currentEditor?.destroy()
  data.cacheEditor?.destroy()
})

/**
 * 初始化源数据json编辑器
 */
const initSourceJsonEditor = () => {
  const container = document.querySelector('.editor') as HTMLElement
  data.sourceEditor = new JSONEditor(container, {
    mode: 'code',
  })
}/**
 * 初始化当前数据json编辑器
 */
const initCurrentJsonEditor = () => {
  const container = document.querySelector('.currentData') as HTMLElement
  data.currentEditor = new JSONEditor(container, {
    mode: 'preview',
  })
}/**
 * 初始化缓存json编辑器
 */
const initCacheJsonEditor = () => {
  const container = document.querySelector('.cacheData') as HTMLElement
  data.cacheEditor = new JSONEditor(container, {
    mode: 'preview',
  })
}
</script>

<template>
<div class="parserContainer">
  <div class="buttons">
    <Button label="Update" severity="help" raised rounded />
    <Button label="Next Node" severity="help" raised rounded />
    <Button label="Get cache" severity="help" raised rounded />
  </div>
  <div class="dataContainer">
    <div class="editor"/>
    <div class="parserView">
      <div class="currentData"></div>
      <div class="cacheData"></div>
    </div>
  </div>
</div>
</template>

<style scoped lang="scss">
.parserContainer {
  width: 100%;
  height: 100%;
  .buttons {
    width: 100%;
    height: fit-content;
    display: flex;
    justify-content: center;
    gap: 2rem;
    margin-bottom: 2rem;
  }
  .dataContainer {
    width: 100%;
    height: fit-content;
    display: flex;
    gap: 2rem;
    .editor {
      width: 50%;
      height: 500px;
    }
    .parserView {
      width: 50%;
      height: 500px;
      display: flex;
      flex-direction: column;
      & > div {
        width: 100%;
        flex: 1;
      }
    }
  }
}
</style>
