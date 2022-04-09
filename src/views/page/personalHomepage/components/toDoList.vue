<template>
  <transition name="max-width">
    <n-card
      v-show="listInfo.show"
      class="w-full mx-2 my-2 md:w-5/12 2xl:flex-1 page-to-do-card"
      :hoverable="true"
      :segmented="true"
    >
      <!-- header -->
      <template #header>
        <n-icon v-if="listInfo.icon" size="20" class="mr-1" :class="colorArray[index]">
          <SvgIcon :icon-class="listInfo.icon" />
        </n-icon>
        <span class="text-sm" :class="colorArray[index]"> {{ $t(listInfo.title) }} </span>
      </template>

      <!-- header extra -->
      <template #header-extra>
        <span>
          <n-number-animation show-separator :from="0" :to="listInfo.list.length" :active="true" />
          {{ $t('page.taskNumber') }} !
        </span>
      </template>

      <!-- content -->
      <n-scrollbar class="pr-4 h-96">
        <n-list>
          <!-- 通过item.status区分任务类型，0为待处理，1为进行中，2为已完成，3为忽略掉 -->
          <n-list-item
            v-for="(item, order) in listInfo.list"
            :key="'toDoListItem-' + index + '-' + order"
          >
            <template #default>
              <n-icon :class="colorArray[item.status]">
                <SvgIcon icon-class="dot" />
              </n-icon>
              <n-tooltip trigger="hover" :show-arrow="false">
                <template #trigger>
                  <span class="cursor-pointer" @click.stop="handleTitleClick(item)">
                    {{ item.title }}
                  </span>
                </template>
                {{ item.title }}
              </n-tooltip>
            </template>

            <template #suffix>
              <div class="flex">
                <n-tooltip v-if="item.status === taskStatusEnum.pending" trigger="hover">
                  <template #trigger>
                    <n-icon
                      size="18"
                      class="mx-1 text-yellow-500 cursor-pointer hover:animate-bounce"
                      @click="handleIconClick(index, order, 'toProgess')"
                    >
                      <SvgIcon icon-class="play" />
                    </n-icon>
                  </template>
                  {{ $t('page.start') }} !
                </n-tooltip>

                <n-tooltip v-if="item.status === taskStatusEnum.progress" trigger="hover">
                  <template #trigger>
                    <n-icon
                      size="18"
                      class="mx-1 text-green-500 cursor-pointer hover:animate-bounce"
                      @click="handleIconClick(index, order, 'toCompleted')"
                    >
                      <SvgIcon icon-class="task-alt" />
                    </n-icon>
                  </template>
                  {{ $t('page.completed') }} !
                </n-tooltip>

                <n-tooltip v-if="item.status !== taskStatusEnum.ignore" trigger="hover">
                  <template #trigger>
                    <n-icon
                      size="18"
                      class="mx-1 text-indigo-500 cursor-pointer hover:animate-bounce"
                      @click="handleIconClick(index, order, 'toIgnore')"
                    >
                      <SvgIcon icon-class="ignore" />
                    </n-icon>
                  </template>
                  {{ $t('page.ignore') }} !
                </n-tooltip>

                <n-tooltip
                  v-if="
                    item.status === taskStatusEnum.completed ||
                    item.status === taskStatusEnum.ignore
                  "
                  trigger="hover"
                >
                  <template #trigger>
                    <n-icon
                      size="18"
                      class="mx-1 cursor-pointer text-stone-500 hover:animate-bounce"
                      @click="handleIconClick(index, order, 'toPending')"
                    >
                      <SvgIcon icon-class="back-up" />
                    </n-icon>
                  </template>
                  {{ $t('page.moveToPending') }} !
                </n-tooltip>

                <n-popconfirm
                  v-if="item.status === taskStatusEnum.ignore"
                  trigger="hover"
                  @positiveClick="handleIconClick(index, order, 'toDelete')"
                >
                  <template #trigger>
                    <n-icon size="18" class="mx-1 text-red-600 cursor-pointer hover:animate-bounce">
                      <SvgIcon icon-class="delete" />
                    </n-icon>
                  </template>
                  {{ $t('page.deleteWarn') }} ?
                </n-popconfirm>
              </div>
            </template>
          </n-list-item>
        </n-list>
      </n-scrollbar>
    </n-card>
  </transition>
</template>

<script lang="ts" setup>
  import type { PropType } from 'vue'
  import type { toDoListInfoType, toDoListItemType } from './types'
  import { taskStatusEnum } from './enums'
  import { reactive } from 'vue'

  defineProps({
    listInfo: {
      type: Object as PropType<toDoListInfoType>,
      default: () => ({ title: '', icon: '', show: false })
    },
    index: {
      type: Number,
      default: -1
    }
  })

  const emits = defineEmits(['operationClick', 'showTask'])

  const colorArray = reactive<Array<String>>([
    'text-red-600',
    'text-yellow-500',
    'text-green-500',
    'text-indigo-500'
  ])

  // hanlde icon click
  const handleIconClick = (index: number, order: number, type: string): void => {
    emits('operationClick', { index, order, type })
  }

  // handle task title click
  const handleTitleClick = (info: toDoListItemType): void => {
    emits('showTask', info)
  }
</script>

<style lang="scss">
  .page-to-do-card {
    .n-list-item__main {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
</style>
