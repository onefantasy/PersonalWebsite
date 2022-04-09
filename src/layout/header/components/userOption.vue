<template>
  <n-dropdown :options="userOptions" @select="handleUserSelect">
    <n-icon class="ml-3 cursor-pointer" size="20" color="#2c3e50">
      <SvgIcon icon-class="user" />
    </n-icon>
  </n-dropdown>
</template>

<script setup lang="ts">
  import { renderIcon } from '@/utils/render'
  import { useI18n } from 'vue-i18n'
  import { computed } from 'vue'
  import { useMessage, useDialog } from 'naive-ui'
  import { useUserStore } from '@/store/modules/user'
  import { useRouter } from 'vue-router'

  const { t } = useI18n()
  const dialog = useDialog()
  const message = useMessage()
  const userStore = useUserStore()
  const router = useRouter()

  // user
  const userOptions = computed(() => [
    { label: t('layout.logout'), key: 'logout', icon: renderIcon('logout') }
  ])
  const handleUserSelect = (key: string): void => {
    // logout
    if (key === 'logout') {
      dialog.warning({
        title: t('currency.warningTitle'),
        content: t('layout.logoutTip'),
        positiveText: t('currency.confirmButton'),
        negativeText: t('currency.cancelButton'),
        onPositiveClick: (): void => {
          // 退出登录
          userStore.logout()
          message.success(t('layout.logoutSuccess'))
          router.push('/login')
        }
      })
    }
  }
</script>
