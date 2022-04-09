<template>
  <n-dropdown :options="languageOptions" @select="handleLanguageSelect">
    <n-icon class="cursor-pointer" size="20" :color="isWhite ? 'rgb(229, 231, 235)' : '#2c3e50'">
      <SvgIcon icon-class="language-sharp" />
    </n-icon>
  </n-dropdown>
</template>

<script lang="ts" setup>
  import { renderIcon } from '@/utils/render'
  import { useAppStore } from '@/store/modules/app'
  import { languageEnum } from '@/enums/languageEnum'

  defineProps({
    isWhite: { type: Boolean, default: false }
  })

  const appStore = useAppStore()

  const languageOptions = [
    { label: '中文', key: 'zh', icon: renderIcon('zh') },
    { label: 'English', key: 'en', icon: renderIcon('en') }
  ]

  // 处理选中语言
  const handleLanguageSelect = (key: languageEnum): void => {
    appStore.setI18n(key)
  }
</script>
