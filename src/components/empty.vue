<template>
  <div class="flex items-center justify-center w-full h-full">
    <div class="flex flex-col items-center">
      <n-icon :size="props.iconSize" :color="props.iconColor">
        <SvgIcon :icon-class="props.iconName" />
      </n-icon>
      <span class="mt-2 font-mono text-base font-medium" :style="`color:${describeColor}`">
        {{ $t(describe) }}
      </span>
    </div>
  </div>
</template>

<script lang="ts" setup>
  const props = defineProps({
    describe: {
      type: String,
      default: 'currency.emptyDescribe'
    },
    describeColor: {
      type: String,
      default: '#a3a3a3'
    },
    iconName: {
      type: String,
      default: 'box-empty'
    },
    iconSize: {
      type: String,
      default: '10vw'
    },
    iconColor: {
      type: String,
      default: '#a3a3a3'
    }
  })
</script>
