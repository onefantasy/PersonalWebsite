<template>
  <section class="flex items-center justify-between h-full px-7">
    <!-- 标题 -->
    <h1 class="text-base font-bold transition-all duration-500 lg:text-lg">
      <n-icon class="cursor-pointer" size="20">
        <SvgIcon icon-class="website" />
      </n-icon>
      {{ $t('layout.title') }}
    </h1>
    <!-- options -->
    <div>
      <!-- 语言选项 -->
      <LanguageOption />
      <!-- user -->
      <UserOption />
    </div>
  </section>
</template>

<script setup lang="ts">
  import LanguageOption from '@/components/languageOption.vue'
  import UserOption from './components/userOption.vue'
</script>
