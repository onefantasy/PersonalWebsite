<template>
  <div class="text-center">
    <!-- 欢迎文字 -->
    <Welcome @wordDisappear="hanldeShowCard" />

    <!-- 留言 -->
    <div class="absolute top-0 bottom-0 left-0 right-0 flex flex-col">
      <!-- 留言功能 -->
      <div class="flex justify-between px-3 mt-6 mb-2">
        <n-input
          v-model:value="leaveMsg"
          :placeholder="$t('home.leaveMsgPlaceholder')"
          class="text-left"
          @keypress.enter="handleLeaveMsg"
        >
          <template #prefix>
            <n-icon color="#000">
              <SvgIcon icon-class="message-board" class="" />
            </n-icon>
          </template>
        </n-input>
        <n-button class="ml-2" type="success" @click="handleLeaveMsg">
          <template #icon>
            <SvgIcon icon-class="add" />
          </template>
          {{ $t('home.leaveMsgButton') }}
        </n-button>
      </div>

      <!-- 留言展示 -->
      <n-scrollbar class="flex-1 px-3 text-base font-thi">
        <n-card
          v-for="item in msgs"
          :key="`message-${item.time}`"
          class="mb-3 overflow-hidden text-left card message"
          :title="`📖 ${item.user}:`"
          embedded
          hoverable
        >
          <template #header-extra>
            <span class="inline-block w-3 h-3 mx-1 bg-red-600 rounded-2xl" />
            <span class="inline-block w-3 h-3 mx-1 bg-yellow-500 rounded-2xl" />
            <span class="inline-block w-3 h-3 mx-1 bg-green-500 rounded-2xl" />
          </template>
          <template #footer>
            <div class="text-right">{{ item.time }}</div>
          </template>
          {{ item.content }}
        </n-card>
      </n-scrollbar>
    </div>
  </div>
</template>

<script setup lang="ts">
  import Welcome from '@/views/home/components/welcome.vue'
  import { ref, reactive } from 'vue'
  import { useUserStore } from '@/store/modules/user'

  interface msgType {
    user: string
    content: string
    time: string
  }

  const userStore = useUserStore()

  // 展示的留言
  const msgs = reactive<Array<msgType>>([])
  const hanldeShowCard = (): void => {
    msgs.push({
      user: 'account',
      content: 'This is an admin account, and the password can be entered at will !',
      time: '2020-19-12'
    })
    msgs.push({
      user: '李白',
      content:
        '君不见黄河之水天上来②, 奔流到海不复回。君不见高堂明镜悲白发③, 朝如青丝暮成雪④。人生得意须尽欢⑤, 莫使金樽空对月⑥。天生我材必有用⑦, 千金散尽还复来⑧。烹羊宰牛且为乐, 会须一饮三百杯⑨。岑夫子⑩, 丹丘生⑪, 将进酒, 杯莫停⑫。与君歌一曲⑬, 请君为我倾耳听⑭。钟鼓馔玉不足贵⑮, 但愿长醉不复醒⑯。古来圣贤皆寂寞⑰, 惟有饮者留其名。陈王昔时宴平乐⑱, 斗酒十千恣欢谑⑲。主人何为言少钱⑳, 径须沽取对君酌㉑。五花马㉒、千金裘㉓, 呼儿将出换美酒㉔, 与尔同销万古愁㉕。',
      time: '天宝三载(744年)'
    })
    msgs.push({
      user: 'Shakespeare',
      content: `When I do count the clock that tells the time,
                And see the brave day sunk in hideous night;
                When I behold the violet past prime,
                And sable curls all silver'd o'er with white:
                When lofty trees I see barren of leaves,
                Which erst from heat did canopy the herd,
                And summer's green, all girded up in sheaves,
                Born on the bier with white and bristly beard;
                Then of thy beauty do I question make,
                That thou among the wastes of time must go,
                Since sweets and beauties do themselves forsake,
                And die as fast as they see others grow;
                And nothing 'gainst Time's scythe can make defence
                Save breed, to brave him when he takes thee hence.`,
      time: '1609'
    })
  }

  // 留言输入框
  const leaveMsg = ref<string>('')
  const handleLeaveMsg = (): void => {
    if (!leaveMsg.value) {
      return
    }
    const date: Date = new Date()
    const item: msgType = {
      user: userStore.userInfo.account || '',
      content: leaveMsg.value,
      time: date.toLocaleString().replace(/\//g, '-')
    }
    msgs.unshift(item)
    leaveMsg.value = ''
  }
</script>

<style lang="scss" scoped>
  @keyframes card-show {
    20% {
      max-width: 20px;
      max-height: 20px;
    }
    30% {
      max-width: 30px;
      max-height: 30px;
    }
    99% {
      max-width: 100%;
      max-height: 300px;
    }
    to {
      max-width: 100%;
      max-height: 1000px;
    }
  }

  .message {
    font-family: 'Comic Sans MS', cursive, sans-serif;
  }

  .card {
    max-width: 0;
    animation: card-show 2s ease forwards;
    max-height: 0;
  }
</style>
