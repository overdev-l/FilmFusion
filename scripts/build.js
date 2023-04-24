import { packages, } from "./utils.js"
import { createRequire, } from "node:module"
import path from "node:path"
const require = createRequire(import.meta.url)

const run = () => {
    try {
        buildAll(packages)
    } finally {
        console.log("done")
    }
}

const buildAll = async (packages) => {
    await performPackage(packages, build)
}

const performPackage = async ( t, b) => {
    const ret = []
    for(let item of packages) {
        const p = Promise.resolve().then(() => b(item))
        ret.push(p)
    }
    return Promise.all(ret)
}
const build = (target) => {
    const pkgDir = path.resolve(`packages/${target}`)
    const pkg = require(`${pkgDir}/package.json`)
    console.log(pkg)
}


run()
