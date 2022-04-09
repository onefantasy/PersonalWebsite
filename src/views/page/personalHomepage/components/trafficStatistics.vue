<template>
  <!-- 流量统计 -->
  <n-card
    hoverable
    :embedded="true"
    class="z-10 w-full overflow-hidden md:w-80 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-slate-50"
  >
    <template #header>
      <div class="text-slate-50">
        <n-icon size="25">
          <SvgIcon icon-class="peoples" />
        </n-icon>
        {{ $t('page.viewsTitle') }}
      </div>
    </template>
    <template #default>
      <div class="text-2xl text-center">
        <n-number-animation
          show-separator
          :duration="2000"
          :from="0"
          :to="699700699"
          :active="true"
        />
        <span class="pl-2 text-base"> {{ $t('page.views') }} </span>
      </div>
      <!-- 背景动态 -->
      <ul
        class="absolute w-64 rounded-full top-3/4 h-52 -z-10 bg-gradient-to-r from-cyan-500 to-blue-500 bg-rotate"
      >
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
      </ul>
    </template>
  </n-card>
</template>

<script lang="ts" setup></script>

<style lang="scss" scoped>
  @keyframes moveToTop {
    90% {
      opacity: 1;
    }
    100% {
      opacity: 0.1;
      transform: translate(-50%, -230px);
    }
  }

  @keyframes hueRotate {
    50% {
      filter: contrast(1) hue-rotate(180deg);
    }
    100% {
      filter: contrast(1) hue-rotate(360deg);
    }
  }

  .bg-rotate {
    filter: contrast(1) hue-rotate(0);
    animation: hueRotate 10s infinite linear;
    li {
      position: absolute;
      border-radius: 50%;
      background: inherit;
      z-index: -20;
    }
    @for $i from 0 through 15 {
      li:nth-child(#{$i}) {
        $width: 15 + random(15) + px;
        left: 12.5% + random(75) * 1%;
        top: 50%;
        transform: translate(-50%, -50%);
        width: $width;
        height: $width;
        animation: moveToTop
          #{calc(random(6) + 3)}s
          ease-in-out -#{calc(random(5000) / 1000)}s
          infinite;
      }
    }
  }
</style>
