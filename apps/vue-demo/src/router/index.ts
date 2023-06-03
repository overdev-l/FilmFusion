import { createRouter, createWebHistory, } from "vue-router"
const routes = [
    {
        path: "/",
        component: () => import("../layout/layout.vue"),
        children: [
            {
                path: "/parser",
                component: () => import("../pages/parser/index.vue"),
            },
            {
                path: "/player",
                component: () => import("../pages/player/index.vue"),
            },
            {
                path: "/time-controller",
                component: () => import("../pages/timeController/index.vue"),
            },
        ],
    },
]
export const router = createRouter({
    history: createWebHistory(),
    routes, // `routes: routes` 的缩写
})
