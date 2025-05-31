<!--
 * @Author: 杨柳岸 88012771+Yang1aa@users.noreply.github.com
 * @Date: 2023-12-02 13:48:44
 * @LastEditors: 杨柳岸 88012771+Yang1aa@users.noreply.github.com
 * @LastEditTime: 2024-05-29 14:29:30
 * @FilePath: \webcode\src\components\TextUploader.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="imageuploader-container">
    <div class="test-image-container">
      <div class="slecet">
        <h1>攻击图前后示例</h1>
      </div>
      <!-- 示例图 -->
      <div class="test-image-show">
        <!-- 回显图片 -->
        <div class="test-data-show">
          <h2>攻击前图片示例图</h2>
          <img src="../../public/beforeattacked.png" alt="" />
        </div>
        <div class="test-data-show">
          <h2>噪声图</h2>
          <img src="../../public/noise.png" alt="" />
        </div>
        <!-- 攻击后图片 -->
        <div class="test-data-show">
          <h2>攻击后图片示例图</h2>
          <!-- 鉴定结果 -->
          <!-- <el-row>
            <el-col :span="6">
              <el-card :body-style="{ padding: '0px' }">
                <img
                  src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png"
                  class="image"
                />
                <div style="padding: 14px; text-align: left">
                  <h4>prcesion:47.50%</h4>
                  <h4>recall:47.50%</h4>
                  <h4>map@50:95.83%</h4>
                </div>
              </el-card>
            </el-col>
          </el-row> -->
          <img src="../../public/afterattacked.png" alt="" />
        </div>
      </div>
    </div>

    <div class="image-container">
      <!-- 图片上传 -->
      <el-upload
        multiple
        :limit="3"
        class="file-box"
        ref="upload"
        action="http://116.63.8.192:8088"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :on-change="handleChange"
        :on-exceed="handleExceed"
        :file-list="images"
        list-type="picture"
        :auto-upload="false"
      >
        <el-button slot="trigger" size="small" type="primary"
          >选取图片</el-button
        >
        <el-button
          style="margin-left: 10px"
          size="small"
          type="success"
          @click="submitFile"
          >上传图片</el-button
        >
        <div slot="tip" class="el-upload__tip">
          只能上传jpg/png文件，且不超过500kb
        </div>
      </el-upload>
      <!-- 下拉框 -->
      <div class="slecet">
        <!-- 模型选择 -->
        <div class="data-select">
          <h2>模型选择</h2>
          <el-select v-model="value" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
        <!-- 鉴定按钮 -->
        <el-button size="small" type="primary" @click="scanImage"
          >鉴定检测</el-button
        >
      </div>
      <!-- 实测图 -->
      <div class="image-show">
        <!-- 回显图片 -->

        <div class="data-show">
          <h2>攻击前图片</h2>
          <el-card class="box-card" ref="imageShow" style="position: relative">
            <div v-if="isScanning" class="loading"></div>
            <img
              class="setimg"
              v-if="uploadedImageUrl"
              :src="uploadedImageUrl"
              :key="uploadedImageUrl"
              alt="Uploaded Image"
            />
            <img
              v-else
              :src="defaultImageUrl"
              alt="Default Image"
              class="setimg"
              style="width: 200px"
            />
          </el-card>
          <el-card class="box-card">
            <h3>&nbsp;</h3>
            <h3>&nbsp;</h3>
            <h3>&nbsp;</h3>
          </el-card>
        </div>
        <!-- 攻击后图片 -->
        <div class="data-show">
          <h2>攻击后图片</h2>

          <!-- 鉴定结果 -->
          <el-card class="box-card">
            <img
              v-if="postUploadImageUrl"
              :src="postUploadImageUrl"
              :key="postUploadImageUrl"
              alt="Uploaded Image"
              class="setimg"
            />
            <img
              v-else
              :src="defaultImageUrl"
              alt="Default Image"
              class="setimg"
            />
            <!-- <img :src="defaultImageUrl" alt="Default Image" /> -->
          </el-card>
          <el-card class="box-card">
            <h3>{{ classification }}</h3>
            <h3>&nbsp;</h3>
            <h3>{{ prcesion }}</h3>
          </el-card>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      images: [],
      imageurls: [],
      classification: "NULL", // 存储分类信息
      prcesion: "NULL", // 存储精确度信息
      options: [
        {
          value: "选项1",
          label: "mode1",
        },
        {
          value: "选项2",
          label: "mode2",
        },
        {
          value: "选项3",
          label: "mode3",
        },
        {
          value: "选项4",
          label: "mode4",
        },
        {
          value: "选项5",
          label: "mode5",
        },
      ],
      value: "选项1",
      postUploadImageUrl: null, //用于存储上传后图片的URL
      uploadedImageUrl: null, // 用于存储上传图片的URL
      defaultImageUrl: "/none.png", // 默认图片的路径
      isScanning: false,
    };
  },
  methods: {
    submitFile() {
      if (this.images.length === 0) {
        this.$message.warning("请选择文件");
        return;
      }
      let formData = new FormData();
      formData.append("image", this.images[0].raw); // 假设只上传第一个选中的图片

      this.$axios
        .post("/uploadImage", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((response) => {
          if (response.data && response.data.url) {
            this.uploadedImageUrl = response.data.url; // 更新图片URL
            this.$message.success("文件上传成功");
            this.images = []; // 清空上传列表
          } else {
            this.$message.error("文件上传失败");
          }
        })
        .catch((error) => {
          this.$message.error("文件上传失败", error.message);
        });
    },

    //移除文件列表时的钩子
    handleRemove(file, fileList) {
      this.images = fileList;
      console.log("移除文件列表时的钩子", file);
    },
    //点击某个文件时的钩子
    handlePreview(file) {
      console.log("点击某个文件时的钩子", file);
    },
    //添加到上传列表时的钩子
    handleChange(file, fileList) {
      this.images = fileList;
      console.log("添加到上传列表时的钩子", file);
    },
    //文件超出个数限制时的钩子
    handleExceed() {
      this.$message.warning("文件超出3个");
      console.log("文件超出个数限制时的钩子");
    },
    getImages() {
      this.$axios
        .get("/filelist")
        .then((response) => {
          this.imageurls = response.data;
          console.log("获取图片列表成功");
        })
        .catch((error) => {
          this.$message.error("获取图片列表失败");
        });
    },
    async scanImage() {
      if (!this.uploadedImageUrl) {
        this.$message({
          message: "请先上传图片再进行鉴定检测",
          type: "warning",
        });
        return;
      }

      this.isScanning = true;

      try {
        // 调用 get-json 接口获取分类信息
        const classifyResponse = await this.$axios.get("/get-json");
        const classifyData = classifyResponse.data;
        const [classification, precision] = classifyData.classify[0];

        // 格式化并展示分类和准确度信息
        const formattedPrecision = (precision * 100).toFixed(2);
        this.classification = `classification: ${classification}`;
        this.prcesion = `precision: ${formattedPrecision}%`;

        // 调用 image 接口获取图像数据
        const imageResponse = await this.$axios.get("/image", {
          responseType: "blob",
        });
        const imageBlob = imageResponse.data;

        // 将Blob转换为Base64
        const reader = new FileReader();
        reader.readAsDataURL(imageBlob);
        reader.onloadend = () => {
          const base64data = reader.result;
          this.postUploadImageUrl = base64data; // 更新Base64图像数据，以便在页面上显示
        };
      } catch (error) {
        console.error("Error fetching data:", error);
        this.$message.error("获取数据失败");
      } finally {
        this.isScanning = false;
      }
    },
  },
};
</script>
<style scoped>
.imageuploader-container {
  color: #ffffff;
  text-align: center;
  z-index: 0;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  height: 90vh;
  position: absolute;
  top: 8vh;
  left: 0;
  width: 100%;
  flex-direction: column;
  background: radial-gradient(
    ellipse at center,
    rgba(32, 87, 151, 0.8) 10%,
    #000 80%
  );
  z-index: -1;
}
.upload-container {
  margin-top: 10px;
  width: 100%;
}
.el-row {
  position: relative;
  display: flex;
  justify-content: center;
}
.file-box {
  border: 1px solid #dcdfe6;
  width: 350px;
  margin: 0.5% auto;
  padding: 35px 35px 15px 35px;
  border-radius: 5px;
  -webkit-border-radius: 5px;
  -moz-border-radius: 5px;
  box-shadow: 0 0 25px #909399;
  background: #fff;
}

.el-row {
  margin-bottom: 20px;
}
.el-row:last-child {
  margin-bottom: 0;
}
.el-col {
  border-radius: 4px;
}

.bg-purple-dark {
  background: #99a9bf;
}

.bg-purple {
  background: #d3dce6;
}

.bg-purple-light {
  background: #e5e9f2;
}

.grid-content {
  border-radius: 4px;
  margin-top: 10px;
  min-height: 36px;
}

.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}

.image-display {
  margin-top: 10px;
  height: 70%;
  overflow: hidden;
}

.el-upload-dragger {
  width: 100% !important;
  height: 100px !important;
}

.el-upload {
  width: 100% !important;
}
.el-icon-upload {
  line-height: 30% !important;
  margin: 25px 0 !important;
}

.image-display .image {
  width: 100%;
  height: 100%;
}

.image-display div {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: #999;
}

/*上传后图片样式设置*/
.image-container {
  width: 98%;
  border-radius: 10px;
  margin-bottom: 10vh;
  border: solid 0.2rem black;
  margin-left: auto;
  margin-right: auto;
}
.test-image-container {
  width: 80%;
  border-radius: 10px;
  margin: 1vh;
  border: solid 0.2rem black;
  margin-left: auto;
  margin-right: auto;
}

.image-show {
  border-radius: 3%;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}
.test-image-show {
  border-radius: 3px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.data-show {
  flex: 1;
  border-radius: 3%;
  padding: 1% 3%;
  margin: 1% 0.5% 1%;
  /*display: flex;
  justify-content: center;
  align-items: center;*/
}

.test-data-show {
  flex: 1;
  border-radius: 3%;
  padding: 1% 3%;
  margin: 1% 0.5% 1%;
}

.time {
  font-size: 13px;
}

.bottom {
  margin-top: 13px;
  line-height: 12px;
}

.button {
  padding: 0;
  float: right;
}

.image {
  width: 100%;
  display: block;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both;
}

/* 下拉框*/

.slecet {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1%;
}
.slecet .el-button {
  height: 40px;
}
.data-select {
  display: flex;
  justify-content: center;
  align-items: center;
}
.data-select h2 {
  color: rgb(255, 255, 255);
  margin-right: 5px;
  min-width: 100px;
}
.data-select el-button {
  color: #00aaff !important;
}
.el-select {
  text-align: center;
  display: block;
  margin: 0 2%;
}
.el-select .el-input {
  min-width: 100px;
}
/* 鉴定结果card*/
.box-card img {
  background-color: #fff;
  max-height: 40%;
  max-width: 40%;
  min-height: 30%;
  min-width: 30%;
}
.box-card h3 {
  text-align: center;
}

.setimg {
  max-width: 20vw !important; /* 最大宽度为容器宽度的25% */
  min-width: 20vw !important; /* 最大宽度为容器宽度的25% */
  max-height: 20vh !important; /* 最大宽度为容器宽度的25% */
  min-height: 20vh !important; /* 最大宽度为容器宽度的25% */
  height: auto; /* 高度自动，保持图片原始宽高比 */
  object-fit: contain; /* 保证图片完整显示且不失真 */
}

/*扫描动画*/
.loading {
  z-index: 100;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(#76c9f5, #60c2f7),
    linear-gradient(90deg, #ffffff33 1px, transparent 0),
    linear-gradient(#ffffff33 1px, transparent 0),
    linear-gradient(transparent, #3db3f3);
  background-size: 100% 1.5%, 10% 100%, 100% 8%, 100% 100%;
  background-repeat: no-repeat, repeat, repeat, no-repeat;
  background-position: 0 0, 0 0, 0 0, 0 0;
  clip-path: polygon(0% 0%, 100% 0%, 100% 1.5%, 0% 1.5%);
  animation: move 1.5s infinite linear;
}
@keyframes move {
  to {
    background-position: 0 100%, 0 0, 0 0, 0 0;
    clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%);
  }
}
</style>
