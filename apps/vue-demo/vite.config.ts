import { defineConfig, } from "vite"
import vue from "@vitejs/plugin-vue"
import basicSsl from "@vitejs/plugin-basic-ssl"
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue(),basicSsl(),],
    server: {
        port: 3000,
        https: true,
        headers: {
            "Cross-Origin-Embedder-Policy": "require-corp",
            "Cross-Origin-Opener-Policy": "same-origin",
        },
    },
})
