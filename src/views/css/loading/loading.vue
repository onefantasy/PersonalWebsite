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
        <div class="loading-div" :class="[item]" />
      </n-card>
    </div>

    <Empty v-else />
  </n-scrollbar>
</template>

<script lang="ts" setup>
  import Empty from '@/components/empty.vue'

  import { reactive, computed } from 'vue'

  const loadingList = reactive<Array<string>>(['hourglass'])

  const showGrid = computed((): boolean => loadingList.length > 0)
</script>

<style lang="scss" scoped>
  .css-loading {
    .loading-div {
      width: 112px;
      height: 112px;
    }

    .hourglass {
      background: linear-gradient(
        45deg,
        rgba(0, 0, 0, 0.4) 0%,
        rgba(0, 0, 0, 0.4) 25%,
        transparent 25%,
        transparent 75%,
        rgba(0, 0, 0, 0.4) 75%,
        rgba(0, 0, 0, 0.4) 100%
      );
      background-position: 56px 56px;
      animation: hourglass-animate 3s infinite;
    }
    @keyframes hourglass-animate {
      0% {
        background: linear-gradient(
          0deg,
          rgba(0, 0, 0, 0.4) 0%,
          rgba(0, 0, 0, 0.4) 25%,
          transparent 25%,
          transparent 75%,
          rgba(0, 0, 0, 0.4) 75%,
          rgba(0, 0, 0, 0.4) 100%
        );
        background-position: 56px 56px;
      }

      50% {
        background: linear-gradient(
          45deg,
          rgba(0, 0, 0, 0.4) 0%,
          rgba(0, 0, 0, 0.4) 25%,
          transparent 25%,
          transparent 75%,
          rgba(0, 0, 0, 0.4) 75%,
          rgba(0, 0, 0, 0.4) 100%
        );
        background-position: 56px 56px;
      }

      100% {
        background: linear-gradient(
          0deg,
          rgba(0, 0, 0, 0.4) 0%,
          rgba(0, 0, 0, 0.4) 25%,
          transparent 25%,
          transparent 75%,
          rgba(0, 0, 0, 0.4) 75%,
          rgba(0, 0, 0, 0.4) 100%
        );
        background-position: 56px 56px;
      }
    }
  }
</style>
