<template>
  <div class="imageuploader-container">
    <div class="test-image-container">
      <div class="slecet">
        <h1>鉴定图前后示例</h1>
      </div>
      <!-- 示例图 -->
      <div class="test-image-show">
        <div class="test-data-show">
          <h2>鉴定前图片示例图</h2>
          <img
            style="
              max-width: 50% !important;
              min-width: 50% !important;
              max-height: 50% !important;
              min-height: 50% !important;
            "
            src="../../public/real.jpg"
            alt=""
          />
        </div>
        <div class="test-data-show">
          <h2>鉴定后图片示例图</h2>
          <div class="stamp-container">
            <img
              style="
                max-width: 50% !important;
                min-width: 50% !important;
                max-height: 50% !important;
                min-height: 50% !important;
              "
              src="../../public/real.jpg"
              alt=""
            />
            <div class="stamp">REAL!</div>
          </div>
        </div>
        <div class="test-data-show">
          <h2>鉴定前图片示例图</h2>
          <img
            style="
              max-width: 50% !important;
              min-width: 50% !important;
              max-height: 50% !important;
              min-height: 50% !important;
            "
            src="../../public/fake.jpg"
            alt=""
          />
        </div>
        <div class="test-data-show">
          <h2>鉴定后图片示例图</h2>
          <div class="stamp-container">
            <img
              style="
                max-width: 50% !important;
                min-width: 50% !important;
                max-height: 50% !important;
                min-height: 50% !important;
              "
              src="../../public/fake.jpg"
              alt=""
            />
            <div class="stamp">FAKE!</div>
          </div>
        </div>
      </div>
    </div>

    <div class="image-container">
      <!-- 图片上传 -->
      <el-upload
        multiple
        :limit="1"
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
        <div class="data-show">
          <h2>鉴定前图片</h2>

          <el-card class="box-card" ref="imageShow" style="position: relative">
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
        </div>
        <div class="data-show">
          <h2>鉴定后图片</h2>
          <!-- 鉴定结果 -->
          <el-card class="box-card" ref="imageShow" style="position: relative">
            <div v-if="isScanning" class="loading"></div>
            <div class="stamp-container">
              <img
                class="setimg"
                v-if="uploadedImageUrl"
                :src="uploadedImageUrl"
                :key="uploadedImageUrl"
                alt="Processed Image"
              />
              <img
                v-else
                :src="defaultImageUrl"
                alt="Default Image"
                class="setimg"
                style="width: 200px"
              />
              <div v-if="scanningResult" class="stamp">{{ scanningResult }}</div>
            </div>
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
      options: [],
      value: "",
      postUploadImageUrl: null, //用于存储上传后图片的URL
      uploadedImageUrl: null, // 用于存储上传图片的URL
      defaultImageUrl: "/none.png", // 默认图片的路径
      isScanning: false,
      scanningResult: null, // 用于存储鉴定结果
      fileName: null, // 用于存储上传图片的文件名
    };
  },
  mounted() {
    this.fetchOptions();
  },
  methods: {
    fetchOptions() {
      this.$axios
        .get("http://116.63.15.173:8088/api/files/hierarchy")
        .then((response) => {
          const identify = response.data.identify;
          const options = Object.keys(identify).map((key) => {
            return {
              value: key,
              label: key,
            };
          });
          this.options = options;
          this.value = options[0].value; // 设置默认选项
        })
        .catch((error) => {
          console.error("Error fetching options:", error);
          this.$message.error("获取选项失败");
        });
    },
    submitFile() {
      if (this.images.length === 0) {
        this.$message.warning("请选择文件");
        return;
      }
      let formData = new FormData();
      formData.append("image", this.images[0].raw); // 假设只上传第一个选中的图片

      this.$axios
        .post("http://116.63.15.173:8088/uploadImage", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((response) => {
          if (response.data && response.data.url) {
            this.uploadedImageUrl = response.data.url; // 更新图片URL
            this.fileName = response.data.fileName; // 更新文件名
            this.scanningResult = null;
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
    handleExceed(files, fileList) {
      this.$message.warning("只能上传1张图片");
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
        // 调用 POST 请求传递模型信息和文件名
        await this.$axios.post(
          "http://116.63.15.173:8088/mode",
          new URLSearchParams({
            mode: this.value.toLocaleLowerCase(),
            fileName: this.fileName,
          }),
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        );

        // 调用 GET 请求获取分类信息
        const response = await this.$axios.get(
          "http://116.63.15.173:8088/get-Xception-json"
        );
        const data = response.data;

        // 更新图片和鉴定结果
        this.postUploadImageUrl = data.img_name; // 更新图片URL
        this.scanningResult = data.val === "real" ? "REAL!" : "FAKE!"; // 更新鉴定结果
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
/* 印章样式 */
.stamp-container {
  position: relative;
}

.stamp {
  position: absolute;
  top: 40%;
  left: 51%;
  transform: translate(-50%, -50%) rotate(-30deg);
  font-size: 2vw;
  font-weight: bold;
  color: red;
  opacity: 0.7;
  z-index: 10;
}
</style>
