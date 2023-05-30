 

<h2 align="center">High-performance video fusion player based on Konva</h2>

[简体中文](./README-zh.md) | English

## 🌟 Features

- 🚀 **Very fast loading of resources**：LRU-based resource caching policy, open-and-play
- 🎯 **Frame independent**：Not tied to any front-end framework to ensure sufficient flexibility.
- ☘️ **Highly free**：Built-in module splitting, free combination and customizable modules.
- 🦾 **Strong type**：Built with TypeScript, providing full type definition files

## Introduction

film-fusion exports three modules by default, namely `Renderer`, `Parser`, and `TimeController`. They correspond to Renderer, Parser, and TimeController respectively.
There are no dependencies between the modules and they can be freely combined. You can customize the modules very freely and just use the methods of the right module at the right time.

## Usage

```javascript
import { Renderer, Parser, TimeController } from "film-fusion"

function init() {
    // Renderer
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
    // Parser
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

## Development

```bash
git clone https://github.com/overdev-l/FilmFusion.git

pnpm install

pnpm ts-types
pnpm dev
```

## 📄 Data Structure

- [Parser](./packages/parser/src/types.ts)
- [Renderer](./packages/renderer/src/types.ts)
- [TimeController](./packages/time-controller/src/types.ts)