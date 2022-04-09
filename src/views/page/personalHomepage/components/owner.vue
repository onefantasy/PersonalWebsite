<template>
  <n-card ref="ownerCard" hoverable :embedded="true" class="mt-3 w-100 md:flex-1 md:mt-0 md:ml-3">
    <n-skeleton v-if="loading" height="100px" circle class="float-right" />
    <n-image
      v-else
      width="100"
      :src="avatar"
      class="float-right border-l-2 border-transparent rounded-l-full"
    />
    <n-skeleton v-if="loading" height="20px" :width="skeletonWidth" text :repeat="4" />
    <n-skeleton v-if="loading" height="20px" text :repeat="2" />
    <p v-else>
      <n-icon size="30px" class="float-left mr-3">
        <SvgIcon icon-class="id-card" />
      </n-icon>
      {{ $t('page.selfIntroduction') }}
    </p>
  </n-card>
</template>

<script lang="ts" setup>
  import avatar from '@/assets/images/icebear.png'
  import { ref, onMounted, nextTick } from 'vue'

  defineProps({
    loading: {
      type: Boolean,
      default: false
    }
  })

  const ownerCard = ref()
  const skeletonWidth = ref<string>('0px')
  onMounted((): void => {
    nextTick((): void => {
      const cardEl = ownerCard.value && ownerCard.value.$el
      if (cardEl) {
        skeletonWidth.value = cardEl.clientWidth - 160 + 'px'
      }
    })
  })
</script>
