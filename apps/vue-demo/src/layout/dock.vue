<script setup lang="ts">
import TimeControllerImage from "../assets/dock/time.png"
import ParserImage from "../assets/dock/parser.png"
import PlayerImage from "../assets/dock/player.png"
const menus = [
  {
    label: "Time Controller",
    image: TimeControllerImage,
    routerLink: "/time-controller"
  },
  {
    label: "Parser",
    image: ParserImage,
    routerLink: "/parser"
  },
  {
    label: "Player",
    image: PlayerImage,
    routerLink: "/player"
  }
]
</script>

<template>
<div class="dockContainer">
  <div class="dock">
    <div v-for="menu in menus" :key="menu.label" class="app-menu hint--top" :aria-label="menu.label">
      <router-link :to="menu.routerLink">
        <img :src="menu.image" alt="" class="app"/>
      </router-link>
    </div>
  </div>
</div>
</template>

<style scoped lang="scss">
.dockContainer {
  width: 100%;
  height: fit-content;
  display: flex;
  justify-content: center;
  .dock {
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    padding: 0.5rem 0.5rem;
    border-radius: 0.5rem;
    height: 60px;
    width: fit-content;
    display: flex;
    align-items: center;
    justify-content: center;

    .app-menu {
      width: 48px;
      height: 48px;
      padding: .5rem;
      transition: transform 0.3s ease-in-out;
      &:hover {
        transform: scale(1.3);
      }
    }
  }
}
</style>
