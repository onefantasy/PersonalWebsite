<template>
  <div>
    <n-form ref="form" :model="model" :rules="rules" label-placement="left" label-width="0">
      <!-- account -->
      <n-form-item path="account">
        <n-input v-model:value="model.account" :placeholder="$t('user.account')">
          <template #prefix>
            <n-icon>
              <SvgIcon icon-class="user" />
            </n-icon>
          </template>
        </n-input>
      </n-form-item>

      <!-- password -->
      <n-form-item path="password">
        <n-input
          v-model:value="model.password"
          :placeholder="$t('user.password')"
          type="password"
          show-password-on="click"
          @keydown.enter="handleLogin"
        >
          <template #prefix>
            <n-icon>
              <SvgIcon icon-class="password" />
            </n-icon>
          </template>
        </n-input>
      </n-form-item>

      <!-- button -->
      <n-form-item>
        <section class="flex justify-between w-full">
          <n-button type="primary" @click="handleLogin">
            <template #icon>
              <n-icon>
                <SvgIcon icon-class="login" />
              </n-icon>
            </template>
            {{ $t('user.login') }}
          </n-button>
          <n-button text @click="handleGoRegister">
            {{ $t('user.register') }}
            <n-icon class="ml-1">
              <SvgIcon icon-class="right-arrow" />
            </n-icon>
          </n-button>
        </section>
      </n-form-item>
    </n-form>
  </div>
</template>

<script lang="ts" setup>
  import type { loginFormType, loginFormRulesType } from './types'
  import { reactive, ref, computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useUserStore } from '@/store/modules/user'
  import { useRouter } from 'vue-router'

  const { t } = useI18n()
  const userStore = useUserStore()
  const router = useRouter()

  // emits
  const emit = defineEmits(['changeModel'])

  // form element
  const form = ref()
  // form model
  const model = reactive<loginFormType>({ account: '', password: '' })
  // form rules
  const rules = computed(
    (): loginFormRulesType => ({
      account: [{ required: true, message: t('user.accountNoEmpty'), trigger: 'blur' }],
      password: [{ required: true, message: t('user.passwordNoEmpty'), trigger: 'blur' }]
    })
  )

  // handle login
  const handleLogin = async (): Promise<void | boolean> => {
    let flag = false
    await form.value
      .validate()
      .then(() => (flag = true))
      .catch(() => (flag = false))
    if (!flag) {
      return false
    }
    // do something...
    userStore.setUserInfo({ account: model.account })
    router.push('/')
  }

  // handle register
  const handleGoRegister = (): void => {
    emit('changeModel')
  }
</script>
