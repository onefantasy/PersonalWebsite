<template>
  <div class="flex flex-wrap justify-end p-3">
    <n-input v-model:value="value" placeholder="Address" />
    <n-button size="tiny" class="mt-2" @click="handlerClear"> Clear </n-button>
    <n-button size="tiny" type="success" class="mt-2 ml-2" @click="hanlderConfirm">
      Confirm
    </n-button>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue'

  const props = defineProps({
    hide: {
      type: Function,
      default: () => () => {}
    },
    filterText: {
      type: String,
      default: ''
    }
  })

  const emits = defineEmits(['change'])

  const value = ref<string>(props.filterText)

  const handlerClear = (): void => {
    value.value = ''
    if (props.hide()) {
      props.hide()
    }
    emits('change', value.value)
  }

  const hanlderConfirm = (): void => {
    if (props.hide()) {
      props.hide()
    }
    emits('change', value.value)
  }
</script>
