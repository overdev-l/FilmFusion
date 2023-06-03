import { createApp, } from "vue"
import { router, } from "./router"
import "./style.css"
import "reset-css"
import "hint.css"
import "primevue/resources/primevue.min.css"
import "primevue/resources/themes/md-light-deeppurple/theme.css"
import "primeicons/primeicons.css"
import PrimeVue from "primevue/config"
import Tooltip from "primevue/tooltip"
import App from "./App.vue"

createApp(App)
    .use(PrimeVue)
    .use(router)
    .directive("tooltip", Tooltip)
    .mount("#app")
