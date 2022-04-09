<template>
  <div>
    <!-- 背景 -->
    <Background />
    <!-- 语言切换 -->
    <div class="fixed top-9 right-9">
      <LanguageOption :is-white="true" />
    </div>
    <!-- 主题内容 -->
    <div class="flex items-center justify-center h-screen">
      <transition name="account">
        <n-card
          v-if="isLogin"
          :title="$t('user.login')"
          hoverable
          bordered
          class="shadow w-72 md:w-80 lg:w-96"
        >
          <Login @changeModel="handleChangeModel" />
        </n-card>
        <n-card
          v-else
          :title="$t('user.register')"
          hoverable
          bordered
          class="shadow w-72 md:w-80 lg:w-96"
        >
          <Register @changeModel="handleChangeModel" />
        </n-card>
      </transition>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import LanguageOption from '@/components/languageOption.vue'
  import Login from './components/login.vue'
  import Register from './components/register.vue'
  import Background from './components/background.vue'
  import { ref, computed } from 'vue'

  // 模式枚举
  enum models {
    login = 'login',
    register = 'register'
  }

  // 模式
  const model = ref<models>(models.login)
  const isLogin = computed((): boolean => model.value === models.login)
  const handleChangeModel = (): void => {
    model.value = isLogin.value ? models.register : models.login
  }
</script>
