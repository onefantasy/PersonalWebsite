<template>
  <section
    class="absolute top-0 bottom-0 left-0 right-0 z-40 transition-all duration-500 opacity-0 select-none text-slate-100 custom-loading"
    :class="[isShow ? 'opacity-100' : 'opacity-0', opactiyHalf ? 'bg-zinc-800/50' : 'bg-zinc-800']"
  >
    <section
      class="absolute left-0 right-0 text-3xl font-bold tracking-wider text-center md:text-5xl top-1/2 text-zinc-800 loading-text"
    >
      <!-- loading tip -->
      <span> Loading </span>
      <span class="relative inline-block w-2 h-2 rounded-full -left-6 md:-left-7 loading-dots" />
    </section>
  </section>
</template>

<script lang="ts" setup>
  import { ref, onMounted } from 'vue'

  defineProps({
    opactiyHalf: {
      type: Boolean,
      defalute: false
    }
  })

  // 加载界面开启关闭标志
  const isShow = ref<boolean>(true)
  // 开始时间
  const startTime = ref<number>(0)

  function execUnmount(callback: () => void = () => {}) {
    let delay = 0
    if (Date.now() - startTime.value < 1000) {
      delay = 1000
    }
    setTimeout(() => {
      isShow.value = false
      setTimeout(callback, 500)
    }, delay)
  }

  onMounted((): void => {
    // 记录开始时间
    startTime.value = Date.now()
  })

  defineExpose({ execUnmount })
</script>

<style lang="scss" scoped>
  .custom-loading {
    .loading-text {
      transform: translate(0, -50%);
      text-shadow: 0px 0px 3px #fff, 0px 0px 2px #fff, 0px 0px 1px #fff;

      // loading 后面省略号
      .loading-dots {
        animation: loading-animation 1s linear infinite alternate;
      }

      @keyframes loading-animation {
        0% {
          box-shadow: 20px 0 rgba(255, 255, 255, 0), 40px 0 rgba(255, 255, 255, 0),
            60px 0 rgba(255, 255, 255, 0), 80px 0 rgba(255, 255, 255, 0),
            100px 0 rgba(255, 255, 255, 0);
        }

        20% {
          box-shadow: 20px 0 #ddd, 40px 0 rgba(255, 255, 255, 0), 60px 0 rgba(255, 255, 255, 0),
            80px 0 rgba(255, 255, 255, 0), 100px 0 rgba(255, 255, 255, 0);
        }

        40% {
          box-shadow: 20px 0 #ddd, 40px 0 #ddd, 60px 0 rgba(255, 255, 255, 0),
            80px 0 rgba(255, 255, 255, 0), 100px 0 rgba(255, 255, 255, 0);
        }

        60% {
          box-shadow: 20px 0 #ddd, 40px 0 #ddd, 60px 0 #ddd, 80px 0 rgba(255, 255, 255, 0),
            100px 0 rgba(255, 255, 255, 0);
        }

        80% {
          box-shadow: 20px 0 #ddd, 40px 0 #ddd, 60px 0 #ddd, 80px 0 #ddd,
            100px 0 rgba(255, 255, 255, 0);
        }

        100% {
          box-shadow: 20px 0 #ddd, 40px 0 #ddd, 60px 0 #ddd, 80px 0 #ddd, 100px 0 #ddd;
        }
      }
    }
  }
</style>
