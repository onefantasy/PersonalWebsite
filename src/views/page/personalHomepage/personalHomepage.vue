<template>
  <div class="p-6 page">
    <div class="flex flex-wrap">
      <TrafficStatistics />
      <Owner :loading="loading" />
    </div>
    <ToDo />
  </div>
</template>

<script setup lang="ts">
  import TrafficStatistics from './components/trafficStatistics.vue'
  import Owner from './components/owner.vue'
  import ToDo from './components/toDo.vue'
  import { ref, onMounted } from 'vue'

  const loading = ref<boolean>(true)
  onMounted((): void => {
    setTimeout(() => {
      loading.value = false
    }, 2000)
  })
</script>

<style lang="scss" scoped>
  .page {
    font-family: 'Comic Sans MS', cursive, sans-serif;
  }
</style>
