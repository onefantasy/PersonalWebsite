<template>
  <div class="flex w-full justify-center">
    <n-button :strong="true" :tertiary="true" size="small" @click="handleEdit">
      <template #icon>
        <n-icon class="-mt-0.5 mr-1">
          <SvgIcon icon-class="edit" />
        </n-icon>
      </template>
      Edit
    </n-button>

    <n-button :strong="true" :tertiary="true" size="small" class="ml-1" @click="handleRemove">
      <template #icon>
        <n-icon class="-mt-0.5 mr-1">
          <SvgIcon icon-class="delete" />
        </n-icon>
      </template>
      Remove
    </n-button>
  </div>
</template>

<script lang="ts" setup>
  const emits = defineEmits(['edit', 'remove'])

  const handleEdit = (): void => {
    emits('edit')
  }

  const handleRemove = (): void => {
    emits('remove')
  }
</script>
