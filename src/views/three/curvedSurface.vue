<template>
  <div
    ref="container"
    v-loading:[{opactiyHalf:true}]="true"
    class="absolute top-0 bottom-0 left-0 right-0"
  />
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue'

  const container = ref<HTMLElement | null>()

  onMounted(() => {})
</script>
