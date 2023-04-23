import { createRequire, } from "node:module"
import fs from "node:fs"
const require = createRequire(import.meta.url)

export const packages = fs.readdirSync("packages").filter(p => {
    if (!fs.statSync(`packages/${p}`).isDirectory()) {
        return false
    }
    const pkg = require(`../packages/${p}/package.json`)
    if (pkg.private && !pkg.buildOptions) {
        return false
    }
    return true
})
