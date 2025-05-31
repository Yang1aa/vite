<!--
 * @Author: 杨柳岸 88012771+Yang1aa@users.noreply.github.com
 * @Date: 2023-12-02 13:48:44
 * @LastEditors: 杨柳岸 88012771+Yang1aa@users.noreply.github.com
 * @LastEditTime: 2024-05-22 23:17:02
 * @FilePath: \webcode\src\components\TextUploader.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <!-- 超大的字，白色字体，带有动画效果 -->
  <div class="huge-text">
    <h1 class="animated-huge-text">
      <!-- A<span>u</span>t<span>h</span>e<span>t</span>i<span>c</span>i<span>t</span>y
      D<span>e</span>t<span>e</span>c<span>t</span>i<span>o</span>n
      S<span>y</span>s<span>t</span>e<span>m</span> -->
      黑<span>龙</span>江<span>大</span>学<span>检</span>测<span>系</span>统
    </h1>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {},
};
</script>
<style>
/* 超大的字样式 */
.huge-text {
  color: #00aaff; /* 初始颜色为淡蓝色 */
  text-align: center;
  z-index: 0;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 90vh; /* 使 .huge-text 铺满整个视口高度 */
  position: relative; /* 使 .huge-text 成为定位上下文 */
  background-color: black;
}

.animated-huge-text {
  min-width: 1000px;
  width: 80%;
  font-size: 6em; /* 设置最终的字体大小 */
  font-weight: 700;
  display: inline-block;
  position: relative;
  animation: revealText 2s forwards cubic-bezier(0.68, -0.55, 0.27, 1.55);
}

.animated-huge-text span {
  display: inline-block;
  transform: translateY(-50%);
  animation: revealLetter 1s forwards cubic-bezier(0.68, -0.55, 0.27, 1.55);
}

/* 逐字显示动画 */
@keyframes revealText {
  from {
    transform: translateY(-30%);
  }
  to {
    transform: translateY(-10%);
  }
}

/* 逐字逐个显示动画 */
@keyframes revealLetter {
  from {
    transform: translateY(-50%);
  }
  to {
    transform: translateY(0);
  }
}

/* Color change animation */
@keyframes colorChange {
  0% {
    color: #00aaff; /* Initial color, adjust as needed */
  }
  25% {
    color: #60d13b;
  }
  50% {
    color: #ffaa00; /* Middle color, adjust as needed */
  }
  75% {
    color: #ffffff; /* Final color, adjust as needed */
  }
  100% {
    color: #00aaff;
  }
}

/* Apply color change animation to the text after revealLetter animation */
.animated-huge-text {
  animation: revealLetter 1s forwards cubic-bezier(0.68, -0.55, 0.27, 1.55),
    colorChange 12s infinite; /* Adjust the duration of the color change */
}
</style>
