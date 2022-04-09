<template>
  <n-modal v-model:show="showModal" preset="dialog" :mask-closable="false" :show-icon="false">
    <template #header>
      <n-icon size="25" class="mr-1">
        <SvgIcon icon-class="table" class="align-baseline" />
      </n-icon>
      <span> Add Info </span>
    </template>

    <n-form ref="table" :model="form" label-placement="left" label-width="auto">
      <!-- name -->
      <n-form-item path="name" label="Name" :first="true">
        <n-input v-model:value="form.name" placeholder="Enter Your Nick !" />
      </n-form-item>

      <!-- birthday -->
      <n-form-item path="birthday" label="Birthday" :first="true">
        <n-date-picker
          v-model:formatted-value="form.birthday"
          value-format="yyyy-MM-dd"
          class="w-full"
        />
      </n-form-item>

      <!-- age -->
      <n-form-item path="age" label="Age" :first="true">
        <n-input-number
          v-model:value="form.age"
          :min="0"
          placeholder="Enter Yout Age !"
          class="w-full"
        />
      </n-form-item>

      <!-- phone -->
      <n-form-item path="phone" label="Phone" :first="true">
        <n-input v-model:value="form.phone" placeholder="Enter Your Phone Number !" />
      </n-form-item>

      <!-- sex -->
      <n-form-item path="sex" label="Sex" :first="true">
        <n-select v-model:value="form.sex" :options="sexOptions" />
      </n-form-item>

      <!-- id number -->
      <n-form-item path="idNumber" label="ID Number" :first="true">
        <n-input v-model:value="form.idNumber" placeholder="Enter Your ID Number !" />
      </n-form-item>

      <!-- avatar -->
      <n-form-item path="avatar" label="Avatar" :first="true">
        <n-upload
          action="/mock/upload"
          :default-file-list="previewFileList"
          list-type="image-card"
          accept="image/*"
          :max="1"
        />
      </n-form-item>

      <!-- buttons -->
      <n-form-item>
        <div class="w-full text-right">
          <n-button @click="handleCancel"> Cancel </n-button>
          <n-button type="success" class="ml-2"> Confirm </n-button>
        </div>
      </n-form-item>
    </n-form>
  </n-modal>
</template>

<script lang="ts" setup>
  import type { tableItemType } from './type'
  import type { UploadFileInfo } from 'naive-ui'
  import { sexEnum } from './enums'
  import { ref, nextTick } from 'vue'

  const showModal = ref<boolean>(false)

  // form
  const formDTO: tableItemType = {
    id: 0,
    address: '',
    idNumber: '',
    name: '',
    birthday: '',
    phone: '',
    avatar: '',
    sex: sexEnum.male,
    age: 0
  }
  const form = ref<tableItemType>({
    id: 0,
    address: '',
    idNumber: '',
    name: '',
    birthday: '',
    phone: '',
    avatar: '',
    sex: sexEnum.male,
    age: 0
  })

  // options
  const sexOptions = [
    { label: 'Male', value: sexEnum.male },
    { label: 'Female', value: sexEnum.female }
  ]

  // upload
  const previewFileList = ref<UploadFileInfo[]>([])

  const show = (): void => {
    form.value = JSON.parse(JSON.stringify(formDTO))
    // init new table item's birthday
    const date = new Date()
    form.value.birthday = date
      .toLocaleDateString()
      .split('/')
      .map((item) => (item.length > 1 ? item : 0 + item))
      .join('-')
    // show modal
    nextTick(() => {
      showModal.value = true
    })
  }
  // click cancel button, close modal
  const handleCancel = (): void => {
    showModal.value = false
  }

  defineExpose({ show })
</script>
