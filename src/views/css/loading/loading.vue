<template>
  <n-scrollbar class="top-0 bottom-0 left-0 right-0 p-3 abosulte css-loading">
    <div v-if="showGrid" class="flex flex-wrap justify-between">
      <n-card
        v-for="item in loadingList"
        :key="'loading_' + item"
        :embedded="true"
        :hoverable="true"
        size="small"
        class="w-36"
      >
        <div class="w-28 h-28" :class="[item]" />
      </n-card>
    </div>

    <Empty v-else />
  </n-scrollbar>
</template>

<script lang="ts" setup>
  import Empty from '@/components/empty.vue'

  import { reactive, computed } from 'vue'

  const loadingList = reactive<Array<string>>(['parachute'])

  const showGrid = computed((): boolean => loadingList.length > 0)
</script>

<style lang="scss" scoped>
  $theme_color: #a3a3a3;
  .css-loading {
    .parachute {
      position: relative;
      &::before {
        content: '';
        position: absolute;
        width: 15px;
        height: 15px;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        background: $theme_color;
        border-radius: 50%;
      }
      &::after {
        content: '';
        position: absolute;
        width: 30px;
        height: 30px;
        background: transparent;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        box-shadow: 0 -10px 0 8px $theme_color;
        border-radius: 50%;
      }
    }
  }
</style>
