import { packages, } from "./utils.js"
import { cpus, } from "node:os"
run()

const run = () => {
    try {
        buildAll(packages)
    } finally {
        console.log("done")
    }
}

const buildAll = async (packages) => {
    await performPackage(cpus().length, packages, build)
}

const performPackage = async (c, t, b) => {
    console.log(c, t, b)
}
const build = (target) => {
    console.log(target)
}
