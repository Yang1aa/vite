<template>
  <div>
    <!-- 顶部粘性吸顶效果，黑色背景 -->
    <div class="sticky-header">
      <!-- 中间的真伪检测系统，白色字体，带有动画效果 -->
      <div class="logo">
        <h1 class="animated-text">黑龙江大学检测系统</h1>
      </div>
    </div>

    <!-- 用于显示当前路由的组件 -->
    <router-view />
    <nav>
      <router-link
        to="/HomePage"
        :class="{ underline: $route.path === '/HomePage' }"
      >
        <h3><i class="el-icon-s-home"></i>&nbsp; 首页</h3>
      </router-link>
      <div
        class="dropdown"
        @mouseover="showDropdown = true"
        @mouseleave="showDropdown = false"
        :class="{
          underline:
            $route.path === '/ImageIdentify' || $route.path === '/ImageAttack',
        }"
      >
        <a>
          <h3>
            <i class="el-icon-picture"></i>&nbsp; 图片类别
            <i class="el-icon-caret-bottom"></i>
          </h3>
        </a>
        <div v-if="showDropdown" class="dropdown-content">
          <div class="triangle-up"></div>
          <a @click="goToImageUploader('ImageIdentify')">图片鉴定</a>
          <a @click="goToImageUploader('ImageAttack')">图片攻击</a>
        </div>
      </div>
      <router-link
        to="/VideoUploader"
        :class="{ underline: $route.path === '/VideoUploader' }"
      >
        <h3><i class="el-icon-video-camera-solid"></i>&nbsp;视频类别</h3>
      </router-link>
      <div
        class="dropdown"
        @mouseover="showDropdown = true"
        @mouseleave="showDropdown = false"
        :class="{
          underline:
            $route.path === '/MessageSpider',
        }"
      >
        <a>
          <h3>
            <i class="el-icon-document"></i>&nbsp; 文本类别
            <i class="el-icon-caret-bottom"></i>
          </h3>
        </a>
        <div v-if="showDropdown" class="dropdown-content">
          <div class="triangle-up"></div>
          <a @click="goToImageUploader('MessageSpider')">微博数据爬取鉴定</a>
        </div>
      </div>
    </nav>

    <!-- footer -->
    <footer>
      <div class="footer-content">
        <p>
          &copy; 2023 Heilongjiang University. All rights reserved. Designed and
          produced by Yangliuan.
        </p>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  created() {
    // 在页面刷新时，检查当前路由是否是默认路由
    if (this.$route.path !== "/HomePage") {
      // 如果当前路由不是目标路由，使用编程式导航跳转到目标路由
      this.$router.replace("/HomePage");
    }
  },
  data() {
    return {
      activeName: "HomePage",
      showDropdown: false, // 控制下拉菜单的显示与隐藏
    };
  },
  methods: {
    goToImageUploader(route) {
      this.showDropdown = false;
      this.$router.push({ path: `/${route}` });
    },
  },
};
</script>

<style>
/* 导航栏样式 */
nav {
  display: flex;
  position: fixed;
  bottom: 5%;
  left: 50%;
  transform: translateX(-50%);
  justify-content: center;
  height: 3vw;
  width: 80%; /* 修改宽度为80% */
  justify-content: space-evenly;
  z-index: 1;
  background-color: rgb(70, 67, 68);
  border-radius: 3vw; /* 相对单位 */
  min-width: 40vw; /* 相对单位 */
  padding: 0.5vw; /* 相对单位 */
}

nav a,
nav .dropdown {
  color: white;
  text-decoration: none;
  font-size: 0.8vw; /* 相对单位 */
  position: relative;
}

nav a.underline,
nav .dropdown.underline {
  background-image: linear-gradient(to right, white, #00aaff);
  background-size: 100% 0.2vw; /* 相对单位 */
  background-position: 0 100%;
  background-repeat: no-repeat;
  transition: background-size 0.3s ease-out;
}

nav a.underline:hover,
nav .dropdown.underline:hover {
  background-size: 0% 0.2vw; /* 相对单位 */
}

/* 下拉菜单样式 */
.dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-content {
  display: none;
  position: absolute;
  background-color: #ffffff;
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  z-index: 999;
  text-align: left;
  bottom: -20%;
  left: 50%;
  transform: translateX(-50%);
  padding: 10px;
  border-radius: 5px;
}

.dropdown-content .triangle-up {
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-bottom: 8px solid #ffffff;
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
}

.dropdown-content a {
  color: black;
  padding: 8px 12px;
  text-decoration: none;
  display: block;
  font-size: 14px;
  text-align: center;
}

.dropdown-content a:hover {
  background-color: #f1f1f1;
}

.dropdown:hover .dropdown-content {
  display: block;
}

/* 顶部粘性吸顶效果，黑色背景 */
.sticky-header {
  height: 8vh;
  background-color: black;
  position: sticky;
  top: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1vw 2vw; /* 相对单位 */
  min-width: 40vw; /* 相对单位 */
}

/* 中间的真伪检测系统，白色字体，带有动画效果，字体周围稍微亮一些 */
.logo {
  color: white;
  text-align: center;
}

.animated-text {
  font-size: 2vw; /* 使用vw单位使字体随屏幕宽度调整 */
  font-weight: 700;
  animation: fadeIn 1s ease-in-out;
}

/* 大圆的样式 */
.huge-text::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  background: radial-gradient(
    ellipse at center,
    rgba(32, 87, 151, 0.8) 10%,
    rgba(255, 255, 255, 0) 80%
  );
  z-index: -1;
}
/* footer 样式 */
footer {
  background-color: rgb(0, 0, 0);
  color: rgb(255, 255, 255);
  text-align: center;
  padding: -0.5vw;
  position: fixed;
  bottom: 0;
  width: 100%;
  min-width: 40vw; /* 相对单位 */
  overflow: hidden;
}

.footer-content {
  max-width: 60vw; /* 相对单位 */
  margin: 0 auto;
}

.footer-content p {
  font-size: 0.8vw; /* 固定字体大小，不会随屏幕放大而变化 */
}

/* 淡入动画 */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
