<template>
  <div>
    <slot />
  </div>
</template>

<script lang="ts" setup>
  const props = defineProps({
    list: {
      type: Array,
      default: () => []
    }
  })

  const emits = defineEmits(['update:list'])
</script>
