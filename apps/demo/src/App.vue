<template>
  <n-config-provider :theme="darkTheme">
    <Container />
  </n-config-provider>
</template>

<style scoped>
</style>

<script lang="ts" setup>
  import { darkTheme } from 'naive-ui'
  import Container from './player/Layout.vue'
</script>
