
<h2 align="center">基于 Konva 的高性能视频融合播放器</h2>

[English](./README.md) | 简体中文

## 🌟 特性

- 🚀 **加载资源极快**：基于 LRU 实现资源缓存策略，打开即播放
- 🎯 **框架无关**：不和任何前端框架绑定，保证足够的灵活性。
- ☘️ **高度自由**：内置模块拆分，可自由组合，可自定义模块。
- 🦾 **强类型**：使用 TypeScript 构建，提供完整的类型定义文件

## 📄 介绍

film-fusion默认导出了三个模块，分别是`Renderer`，`Parser`，`TimeController`。分别对应着渲染器，解析器，时间控制器。
模块与模块之间没有任何依赖关系，可以自由组合。你可以非常自由的自定义模块，只需要在合适的时机使用合适的模块的方法即可。

## 🔨 使用

```javascript
import { Renderer, Parser, TimeController } from "film-fusion"

function init() {
    // 渲染器
    const renderer = new Renderer({
        target: "#player",
        movieWidth: 1080,
        movieHeight: 1920,
        onSceneReady: () => {
            if (status.value) {
                timeController.play()
            }
        }
    })
    // 解析器
   const parser = new Parser({
        backgroundAudio: [...],
        scenes: [...],
        elements: [...],
        background: {...},
        firstLoaded: () =>{...},
    })
    const timeController = new TimeController({
        duration: scenes.reduce((pre: number,nex: scene) => pre + nex.duration,0),
        onTimeUpdate: (time: TimeControllerConfig.Options["onTimeUpdate"]) => {
            // time update
        },
        nextFiber: async () => {
            // switch scene handler
        },
        play: () => {
            // Renderer play handler
        },
        pause: () => {
            // Renderer pasue handler
        },
    })
}
```

## 开发

```bash
git clone https://github.com/overdev-l/FilmFusion.git

pnpm install

pnpm ts-types
pnpm dev
```

## 📄 文档

- [Parser](./packages/parser/src/types.ts)
- [Renderer](./packages/renderer/src/types.ts)
- [TimeController](./packages/time-controller/src/types.ts)