<template>
  <n-card class="mt-3" :hoverable="true" :embedded="true">
    <template #header>
      <div class="flex justify-between">
        <div class="flex-1">
          <n-icon size="25">
            <SvgIcon icon-class="check-list" />
          </n-icon>
          <span> {{ $t('page.toDoList') }} </span>
        </div>

        <div class="flex-1 text-center">
          <span
            class="inline-block w-3 h-3 mx-1 cursor-pointer rounded-2xl"
            :class="[listData[0].show ? 'bg-red-600' : 'bg-slate-400']"
            @click.stop="handleshowList(listData[0], listData[0].show)"
          />
          <span
            class="inline-block w-3 h-3 mx-1 cursor-pointer bg-slate-400 rounded-2xl"
            :class="[listData[1].show ? 'bg-yellow-600' : 'bg-slate-400']"
            @click.stop="handleshowList(listData[1], listData[1].show)"
          />
          <span
            class="inline-block w-3 h-3 mx-1 cursor-pointer bg-slate-400 rounded-2xl"
            :class="[listData[2].show ? 'bg-green-600' : 'bg-slate-400']"
            @click.stop="handleshowList(listData[2], listData[2].show)"
          />
          <span
            class="inline-block w-3 h-3 mx-1 cursor-pointer bg-slate-400 rounded-2xl"
            :class="[listData[3].show ? 'bg-indigo-600' : 'bg-slate-400']"
            @click.stop="handleshowList(listData[3], listData[3].show)"
          />
        </div>

        <div class="flex-1 text-right">
          <n-icon
            size="25"
            class="text-orange-500 transition-all duration-1000 cursor-pointer hover:text-orange-900"
            @click="handleShowAddForm"
          >
            <SvgIcon icon-class="task-add" />
          </n-icon>
        </div>
      </div>
    </template>

    <div class="flex flex-wrap justify-between">
      <ToDoList
        v-for="(item, index) in listData"
        :key="'ToDoList' + index"
        :list-info="item"
        :index="index"
        @operationClick="handleOperationClick"
        @showTask="handleShowTask"
      />
    </div>
  </n-card>

  <!-- 新建任务表单 -->
  <ToDoForm ref="toDoForm" @addNewTask="handleAddNewTask" />
</template>

<script lang="ts" setup>
  import ToDoList from './toDoList.vue'
  import ToDoForm from './toDoForm.vue'
  import type { toDoListInfoType, toDoListItemType } from './types'
  import { ref, reactive, onMounted } from 'vue'
  import { taskStatusEnum } from './enums'

  // form node
  const toDoForm = ref()

  const pendingArray = reactive<toDoListItemType[]>([
    {
      id: 1,
      title: 'Pending task 1',
      content: 'content',
      createdTime: '2030-05-06',
      planStartTime: 1183135260000,
      planEndTime: 1183135260000,
      actualEndTime: '',
      actualStartTime: '',
      status: taskStatusEnum.pending
    }
  ])
  const progessArray = reactive<toDoListItemType[]>([
    {
      id: 2,
      title: 'Progess task 1',
      content: 'content',
      createdTime: '2030-05-06',
      planStartTime: 1183135260000,
      planEndTime: 1183135260000,
      actualEndTime: '',
      actualStartTime: '',
      status: taskStatusEnum.progress
    }
  ])
  const completedArray = reactive<toDoListItemType[]>([
    {
      id: 3,
      title: 'Complete task 1',
      content: 'content',
      createdTime: '2030-05-06',
      planStartTime: 1183135260000,
      planEndTime: 1183135260000,
      actualEndTime: '',
      actualStartTime: '',
      status: taskStatusEnum.completed
    }
  ])
  const ignoreArray = reactive<toDoListItemType[]>([
    {
      id: 4,
      title: 'Ignore task 1',
      content: 'content',
      createdTime: '2030-05-06',
      planStartTime: 1183135260000,
      planEndTime: 1183135260000,
      actualEndTime: '',
      actualStartTime: '',
      status: taskStatusEnum.ignore
    }
  ])

  const listData = reactive<toDoListInfoType[]>([
    { title: 'page.pending', icon: 'task-asset', show: false, list: pendingArray },
    { title: 'page.inProgess', icon: 'in-progress', show: false, list: progessArray },
    { title: 'page.completed', icon: 'task-complete', show: false, list: completedArray },
    { title: 'page.ignore', icon: 'ignore', show: false, list: ignoreArray }
  ])

  // hanlde operation click
  const handleOperationClick = (
    { index, order, type }: { index: number; order: number; type: string } = {
      index: -1,
      order: -1,
      type: ''
    }
  ): boolean => {
    if (index === -1 || order === -1 || !type) {
      return false
    }
    const targetData: toDoListItemType[] = listData[index].list
    const date = new Date()
    let target: toDoListItemType | null = null
    switch (type) {
      case 'toDelete':
        targetData.splice(order, 1)
        break
      case 'toPending':
        target = targetData.splice(order, 1)[0]
        target.status = taskStatusEnum.pending
        listData[0].list.unshift(target)
        break
      case 'toProgess':
        target = targetData.splice(order, 1)[0]
        target.status = taskStatusEnum.progress
        // set actual work time
        target.actualStartTime = date.toLocaleString().replace(/\//g, '-')
        target.actualEndTime = ''
        // task move to progess list
        listData[1].list.unshift(target)
        break
      case 'toCompleted':
        target = targetData.splice(order, 1)[0]
        target.status = taskStatusEnum.completed
        target.actualEndTime = date.toLocaleString().replace(/\//g, '-')
        listData[2].list.unshift(target)
        break
      case 'toIgnore':
        target = targetData.splice(order, 1)[0]
        target.status = taskStatusEnum.ignore
        listData[3].list.unshift(target)
        break
      default:
        break
    }
    return true
  }

  // show task add form
  const handleShowAddForm = (): void => {
    toDoForm.value.show()
  }
  // show task form detail
  const handleShowTask = (info: toDoListItemType): void => {
    toDoForm.value.show(info)
  }

  // handle to do list show
  const handleshowList = (data: toDoListInfoType, show: boolean): void => {
    data.show = !show
  }

  // handle add new task
  const handleAddNewTask = (task: toDoListItemType): void => {
    // add to pending list
    listData[0].list.unshift(task)
  }

  onMounted((): void => {
    // show animation
    for (let i = 0, len = listData.length; i < len; i++) {
      setTimeout((): void => {
        listData[i].show = true
      }, i * 500 + 2000)
    }
  })
</script>
