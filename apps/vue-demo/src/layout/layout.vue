<script setup lang="ts">
import Dock from "./dock.vue"
</script>

<template>
<div class="layoutContainer">
  <div class="pageContainer">
      <router-view />
  </div>
  <div class="dockContainer">
    <Dock />
  </div>
</div>
</template>

<style lang="scss" scoped>
.layoutContainer {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #0093E9;
  background-image: linear-gradient(160deg, #0093E9 0%, #80D0C7 100%);
  padding: 2rem;
  .pageContainer {
    display: flex;
    justify-content: center;
    align-items: center;
    padding-bottom: 2rem;
    flex: 1;
    .page {
      width: 100%;
      height: 100%;
      max-width: 800px;
      max-height: 600px;
      background-color: #fff;
      border-radius: 1rem;
      padding: 1rem;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    }
  }
  .dockContainer {
    height: 60px;
  }
}
</style>
