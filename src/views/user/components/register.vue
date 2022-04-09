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
        >
          <template #prefix>
            <n-icon>
              <SvgIcon icon-class="password" />
            </n-icon>
          </template>
        </n-input>
      </n-form-item>

      <!-- confirm password -->
      <n-form-item path="confirmPassword" first>
        <n-input
          v-model:value="model.confirmPassword"
          :placeholder="$t('user.confirmPassword')"
          type="password"
          show-password-on="click"
          :disabled="!model.password"
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
          <n-button type="primary" @click="handleRegister">
            <template #icon>
              <n-icon>
                <SvgIcon icon-class="register" />
              </n-icon>
            </template>
            {{ $t('user.register') }}
          </n-button>
          <n-button text @click="handleGoRegister">
            {{ $t('user.login') }}
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
  import type { registerFormType, registerFormRulesType } from './types'
  import type { FormItemRule } from 'naive-ui'
  import { reactive, ref, computed } from 'vue'
  import { useI18n } from 'vue-i18n'

  const { t } = useI18n()

  // emits
  const emit = defineEmits(['changeModel'])

  // form element
  const form = ref()
  // form model
  const model = reactive<registerFormType>({ account: '', password: '', confirmPassword: '' })
  // form rules
  const validatePasswordSame = (rule: FormItemRule, value: any): boolean => {
    return value === model.password
  }
  const rules = computed(
    (): registerFormRulesType => ({
      account: [{ required: true, message: t('user.accountNoEmpty'), trigger: 'blur' }],
      password: [{ required: true, message: t('user.passwordNoEmpty'), trigger: 'blur' }],
      confirmPassword: [
        { required: true, message: t('user.confirmPasswordNoEmpty'), trigger: ['input', 'blur'] },
        {
          validator: validatePasswordSame,
          message: t('user.passwordInconsistent'),
          trigger: ['blur']
        }
      ]
    })
  )

  // handle Register
  const handleRegister = async (): Promise<void | boolean> => {
    let flag = false
    await form.value
      .validate()
      .then(() => (flag = true))
      .catch(() => (flag = false))
    if (!flag) {
      return false
    }
    // do something...
  }

  // handle register
  const handleGoRegister = (): void => {
    emit('changeModel')
  }
</script>
