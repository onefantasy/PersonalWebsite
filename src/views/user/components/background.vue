<template>
  <div class="fixed w-screen h-screen -z-10 background">
    <div class="group">
      <div class="item top"></div>
      <div class="item bottom"></div>
      <div class="item left"></div>
      <div class="item right"></div>
    </div>
    <div class="group group-backup">
      <div class="item top"></div>
      <div class="item bottom"></div>
      <div class="item left"></div>
      <div class="item right"></div>
    </div>
  </div>
</template>

<script lang="ts" setup></script>

<style lang="scss">
  @keyframes Backgroundmove {
    0% {
      transform: translate(-50%, -50%) translateZ(-50vw) rotate(0deg);
    }
    100% {
      transform: translate(-50%, -50%) translateZ(50vw) rotate(0deg);
    }
  }

  @keyframes BackgroundItemFade {
    0% {
      opacity: 0;
    }
    25%,
    60% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }
</style>

<style lang="scss" scoped>
  $animationTime: 10s;
  @function randomNum($max, $min: 0, $u: 1) {
    @return ($min + random($max)) * $u;
  }

  @function randomColor() {
    @return rgb(randomNum(255), randomNum(255), randomNum(255));
  }

  @function shadowSet($maxWidth, $maxHeight, $count) {
    $shadow: 0 0 0 0 randomColor();
    @for $i from 0 through $count {
      $x: #{calc(random(10000) / 10000) * $maxWidth};
      $y: #{calc(random(10000) / 10000) * $maxHeight};
      $shadow: $shadow, #{$x} #{$y} 0 #{random(5)}px randomColor();
    }
    @return $shadow;
  }

  .background {
    perspective: 60px;
    background: linear-gradient(
      to right,
      rgb(55, 65, 81) 0%,
      #000 20%,
      #000 80%,
      rgb(55, 65, 81) 100%
    );

    .group {
      transform-style: preserve-3d;
      width: 100%;
      height: 100%;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      animation: Backgroundmove $animationTime infinite linear;
    }

    .group-backup {
      animation-delay: calc($animationTime / -2);
      .item {
        animation-delay: calc($animationTime / -2);
      }
    }
  }

  .item {
    width: 100vw;
    height: 100vh;
    position: absolute;
    animation: BackgroundItemFade $animationTime infinite linear;
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      width: 1px;
      height: 1px;
      border-radius: 50%;
      box-shadow: shadowSet(100vw, 100vh, 100);
    }
  }
  .top {
    transform: rotateX(90deg) translateZ(50vh);
  }
  .bottom {
    transform: rotateX(-90deg) translateZ(50vh);
  }
  .left {
    transform: rotateY(-90deg) translateZ(50vw);
  }
  .right {
    transform: rotateY(90deg) translateZ(50vw);
  }
</style>
