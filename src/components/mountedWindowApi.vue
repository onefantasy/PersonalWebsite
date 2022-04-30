<template>
  <div class="hidden"> mounted window api </div>
</template>

<script lang="ts" setup>
  import { useMessage } from 'naive-ui'

  // 挂载全局消息组件
  window.$message = useMessage()
</script>
