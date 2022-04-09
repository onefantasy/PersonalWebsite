<template>
  <svg class="svg" :class="svgClass" aria-hidden="true">
    <use :xlink:href="iconName" />
  </svg>
</template>

<script lang="ts" setup>
  import { computed } from 'vue'
  const props = defineProps({
    iconClass: {
      type: String,
      required: true
    },
    className: {
      type: String,
      default: ''
    },
    color: {
      type: String,
      default: '#889aa4'
    }
  })

  const iconName = computed(() => `#icon-${props.iconClass}`)
  const svgClass = computed(() => {
    const className = props.className
    return className ? `svg-icon ${className}` : `svg-icon`
  })
</script>

<style lang="scss" scoped>
  .svg {
    display: inline;
  }
</style>
