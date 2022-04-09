<template>
  <div
    v-if="isShow"
    class="absolute top-0 bottom-0 left-0 right-0 z-0 flex items-center justify-center home-welcome"
  >
    <div class="text-xl font-bold md:text-3xl xl:text-5xl">
      <!-- 正字 -->
      <div class="p-3 pb-0 welcome-text">
        <div ref="text">
          {{ $t('home.welcome') }}
        </div>
      </div>
      <!-- 倒影 -->
      <div class="p-3 pb-0 reflection welcome-text">
        <div ref="textReflection">
          {{ $t('home.welcome') }}
        </div>
      </div>
    </div>
  </div>
  <!--定义svg滤镜，这里使用的是feTurbulence滤镜-->
  <svg width="0" height="0">
    <filter id="displacement-wave-filter">
      <!--baseFrequency设置0.01 0.09两个值，代表x轴和y轴的噪声频率-->
      <feTurbulence baseFrequency="0.01 0.09">
        <!--这是svg动画的定义方式，通过动画不断改变baseFrequency的值，从而形成波动效果-->
        <animate
          attributeName="baseFrequency"
          dur="20s"
          keyTimes="0;0.5;1"
          values="0.01 0.09;0.02 0.13;0.01 0.09"
          repeatCount="indefinite"
        ></animate>
      </feTurbulence>
      <feDisplacementMap in="SourceGraphic" scale="10" results="water" />
      <!-- 模糊 -->
      <!-- <feGaussianBlur in="water" stdDeviation="1 2" results="blur" /> -->
    </filter>
  </svg>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'

  const eimts = defineEmits(['wordDisappear'])

  const isShow = ref<boolean>(true)

  const text = ref<HTMLElement>()
  const textReflection = ref<HTMLElement>()

  // text to span HTMLElement
  const textToSpan = (el: HTMLElement | undefined) => {
    if (el) {
      const text: string = el.innerText || ''
      const textSpan: string = text
        .split('')
        .map((item) => `<span class='smoky'>${item}</span>`)
        .join('')
      el.innerText = ''
      el.innerHTML = textSpan || text
      setTimeout((): void => {
        el.classList.add('disappear')
      }, 1500)
    }
  }

  onMounted((): void => {
    textToSpan(text.value)
    textToSpan(textReflection.value)
    // 定时
    setTimeout((): void => {
      // 去除overflow
      const els = document.querySelectorAll('.welcome-text')
      els.forEach((item) => {
        item.classList.add('overflowUnset')
      })
    }, 1500)
    setTimeout((): void => {
      // 不再显示欢迎文字
      isShow.value = false
      eimts('wordDisappear')
    }, 5200)
  })
</script>

<style lang="scss">
  @keyframes welcome-smoky {
    60% {
      text-shadow: 0 0 40px rgb(51, 54, 57);
      opacity: 0.2;
      filter: blur(6px);
    }
    to {
      transform: translate3d(15rem, -8rem, 0) rotate(-40deg) skewX(70deg) scale(1.5);
      text-shadow: 0 0 20px rgb(51, 54, 57);
      opacity: 0;
      filter: blur(10px);
    }
  }
  .home-welcome {
    // 文字消失
    .disappear {
      .smoky {
        display: inline-block;
        text-shadow: 0 0 0 rgb(51, 54, 57);
        animation: welcome-smoky 2s ease forwards;
      }
      @for $item from 1 through 10 {
        span:nth-of-type(#{$item}) {
          animation-delay: #{((1 + calc($item/10)))}s;
        }
      }
    }
  }
</style>

<style lang="scss" scoped>
  @keyframes welcome-show {
    0% {
      opacity: 0;
      letter-spacing: -40px;
      filter: blur(10px);
    }
    45% {
      transform: translateY(-10%);
    }
    60% {
      transform: translateY(0%);
    }
    65% {
      transform: translateY(-5%);
    }
    70% {
      transform: translateY(0);
      opacity: 1;
    }
    100% {
      letter-spacing: 10px;
      filter: blur(0);
      transform: translateY(0);
      opacity: 1;
    }
  }
  @keyframes welcome-text-over {
    100% {
      overflow: unset;
    }
  }

  .welcome-text {
    filter: contrast(30);
    background: transparent;
    overflow: hidden;
    div {
      transform: translateY(100%);
      letter-spacing: -40px;
      animation: welcome-show 1s ease forwards;
      animation-delay: 0.5s;
    }
  }
  .overflowUnset {
    overflow: unset !important;
  }
  .reflection {
    transform: scaleY(-1);
    // svg模糊
    filter: url(#displacement-wave-filter);
  }
</style>
