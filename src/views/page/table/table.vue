<template>
  <div>
    <!-- table -->
    <n-data-table
      ref="dataTable"
      v-model:checked-row-keys="checkedRowkeys"
      :columns="columns"
      :data="data"
      :single-line="false"
      striped
      :flex-height="true"
      :loading="loading"
      :scroll-x="1800"
      class="absolute top-0 left-0 right-0 bottom-14"
      :row-key="(row: tableItemType) => row.id"
      @update:filters="hanldeTableFilter"
    />

    <!-- page footer -->
    <div class="absolute bottom-0 left-0 right-0 flex justify-around px-3 h-14 lg:justify-between">
      <div v-if="!appStore.isMobile" class="flex items-center">
        <n-button type="info" @click="hanldeShowForm">
          <template #icon>
            <n-icon> <SvgIcon icon-class="add" /> </n-icon>
          </template>
          Add
        </n-button>
        <n-button type="error" class="ml-2" @click="handleBatchRemove(null)">
          <template #icon>
            <n-icon> <SvgIcon icon-class="delete" /> </n-icon>
          </template>
          Remove Checked
        </n-button>
      </div>
      <n-pagination
        v-model:page="page"
        :page-size="pageSize"
        :page-sizes="pageSizes"
        :item-count="ItemCount"
        :show-size-picker="!appStore.isMobile"
        :show-quick-jumper="!appStore.isMobile"
        :disabled="loading"
        :page-slot="appStore.isMobile ? 5 : 8"
        class="items-center justify-center h-14 lg:justify-end"
        @update:page="getTableList"
        @update:pageSize="handleUpdatePageSize"
      />
    </div>

    <!-- form -->
    <TableForm ref="tableForm" />
  </div>
</template>

<script lang="ts" setup>
  import type { tableItemType } from './components/type'
  import type { DataTableColumns, DataTableColumn } from 'naive-ui'
  import type { tableListParams } from '@/api/page/type'

  import { sexEnum } from './components/enums'
  import { NImage, NButton, useMessage, NIcon } from 'naive-ui'
  import FilterInput from './components/filterInput.vue'
  import SvgIcon from '@/components/svgIcon.vue'
  import TableForm from './components/tableForm.vue'
  import TableActions from './components/tableActions.vue'
  import { onMounted, ref, h, reactive, nextTick } from 'vue'
  import { apiGetTableList } from '@/api/page/table'
  import { useAppStore } from '@/store/modules/app'

  const appStore = useAppStore()
  const message = useMessage()
  const tableForm = ref()

  // loading
  const loading = ref<boolean>(false)

  // table
  const dataTable = ref()
  let filters: Function
  const data = ref<Array<tableItemType>>([])
  const checkedRowkeys = ref<Array<string | number>>([])
  const columns = reactive<DataTableColumns>([
    { type: 'selection', fixed: 'left' },
    { title: 'Index', key: 'id', align: 'center', width: 60 },
    {
      title: 'Avatar',
      key: 'avatar',
      align: 'center',
      width: 80,
      render(row) {
        // @ts-ignore: Unreachable code error
        return h(NImage, { src: row.avatar, width: 50 }, {})
      }
    },
    {
      title: 'Name',
      key: 'name',
      align: 'center',
      sorter: { multiple: 2, compare: 'default' },
      width: 120
    },
    {
      title: 'ID Number',
      key: 'idNumber',
      align: 'center',
      sorter: { multiple: 3, compare: 'default' },
      width: 180
    },
    {
      title: 'Age',
      key: 'age',
      align: 'center',
      sorter: { multiple: 4, compare: 'default' },
      width: 80
    },
    {
      title: 'Sex',
      key: 'sex',
      align: 'center',
      sorter: { multiple: 5, compare: 'default' },
      defaultFilterOptionValues: [],
      filterOptions: [
        { label: 'Male', value: sexEnum.male },
        { label: 'Female', value: sexEnum.female }
      ],
      filter: true,
      render(row) {
        return h('span', {}, { default: () => (row.sex ? 'Male' : 'Female') })
      },
      width: 120
    },
    {
      title: 'Birthday',
      key: 'birthday',
      align: 'center',
      sorter: { multiple: 6, compare: 'default' },
      width: 120
    },
    {
      title: 'Phone',
      key: 'phone',
      align: 'center',
      sorter: { multiple: 7, compare: 'default' },
      width: 180
    },
    {
      title: 'Address',
      key: 'address',
      align: 'center',
      sorter: { multiple: 8, compare: 'default' },
      filter: true,
      width: appStore.isMobile ? 240 : undefined,
      renderFilterMenu({ hide }: { hide: () => void }) {
        return h(
          FilterInput,
          {
            onChange: (value: string): void => {
              filters(Object.assign(paramsFilter, { address: value || null }))
              hide()
            },
            filterText: paramsFilter.address
          },
          {}
        )
      }
    },
    {
      title: 'Action',
      key: 'actions',
      align: 'center',
      fixed: 'right',
      width: 190,
      render(row) {
        return h(TableActions, {
          onEdit: hanldeShowForm,
          onRemove: () => handleBatchRemove(row as any as tableItemType)
        })
      }
    }
  ])
  const paramsFilter: { [key: string | number]: any } = {}
  const hanldeTableFilter = (
    filters: { [key: string | number]: Array<string | number> | string | number },
    initiatorColumn: DataTableColumn
  ): void => {
    for (const key in filters) {
      const target: any = filters[key]
      if (target) {
        paramsFilter[key] = target
      }
    }
    getTableList()
  }

  // pagination
  const page = ref<number>(1)
  const pageSize = ref<number>(30)
  const pageSizes = reactive<Array<number>>([10, 30, 50, 70, 100])
  const ItemCount = ref<number>(0)
  // page size change
  const handleUpdatePageSize = (newPageSize: number): void => {
    pageSize.value = newPageSize
    page.value = 1
    getTableList()
  }

  const getTableList = (): void => {
    const params: tableListParams = {
      pageNumber: page.value,
      pageSize: pageSize.value,
      filters: paramsFilter
    }
    loading.value = true
    apiGetTableList(params)
      .then((res) => {
        data.value = res.data.list
        ItemCount.value = res.data.total
      })
      .catch((err) => {})
      .finally(() => (loading.value = false))
  }

  // function buttons
  const handleBatchRemove = (info: tableItemType | null): void => {
    if (checkedRowkeys.value.length === 0 && !info) {
      message.warning('You need to choose the target first!', {
        closable: true,
        keepAliveOnHover: true
      })
      return
    }
    // remove ...
    // reset checked array
    info || (checkedRowkeys.value = [])
    message.success('OK, I will delete it on a dark and windy night!', {
      closable: true,
      keepAliveOnHover: true
    })
  }
  const hanldeShowForm = (): void => {
    tableForm.value.show()
  }

  onMounted((): void => {
    nextTick(() => {
      filters = dataTable.value.filters
      getTableList()
    })
  })
</script>
