<template>
  <main class="container">
    <!-- 词云图展示区 -->
    <el-row class="image-row">
      <el-col :span="24">
        <el-card class="image-display">
          <!-- <p slot="header">词云图</p> -->
          <!-- <el-image
            v-if="imageSrc"
            :src="imageSrc"
            fit="contain"
            alt="Image"
          ></el-image> -->
          <img src="../../public/ciyun1.png" alt="" class="fit-image"/>
        </el-card>
      </el-col>
    </el-row>

    <!-- 关键词输入和爬取按钮 -->
    <el-row class="input-group" :gutter="20" type="flex" justify="center">
      <el-col :span="10">
        <el-input v-model="keyword" placeholder="请输入爬取的关键词"></el-input>
      </el-col>
      <el-col :span="4">
        <el-button type="primary" @click="crawl">爬取</el-button>
      </el-col>
    </el-row>

    <!-- 爬取后的数据展示区 -->
    <el-row class="data-group" :gutter="20">
      <el-col :span="6">
        <el-card class="data-display">
          <p slot="header">爬取后的数据</p>
          <div v-if="crawledData">
            {{ crawledData }}
          </div>
          <div v-else>
            <p>暂无数据</p>
          </div>
        </el-card>
      </el-col>

      <div class="option-select">
        <!-- 鉴定模型选择和按钮 -->
        <el-col :span="6" :offset="6" class="input">
          <el-select v-model="selectedModel" placeholder="选择鉴定模型">
            <el-option
              v-for="model in models"
              :key="model"
              :label="model"
              :value="model"
            ></el-option>
          </el-select>
          <el-tooltip
            v-if="!crawledData"
            content="请先爬取数据"
            placement="top"
            effect="dark"
          >
            <el-button
              type="primary"
              :disabled="!crawledData"
              style="margin-left: 20px"
            >
              鉴定
            </el-button>
          </el-tooltip>
        </el-col>

        <!-- 数据格式选择和下载按钮 -->
        <el-col :span="6" :offset="6" class="input">
          <el-select v-model="selectedFormat" placeholder="选择数据下载格式">
            <el-option
              v-for="format in formats"
              :key="format"
              :label="format"
              :value="format"
            ></el-option>
          </el-select>
          <el-tooltip
            v-if="!crawledData"
            content="请先爬取数据"
            placement="top"
            effect="dark"
          >
            <el-button
              type="success"
              :disabled="!crawledData"
              style="margin-left: 20px"
            >
              下载
            </el-button>
          </el-tooltip>
        </el-col>
      </div>

      <!-- 鉴定结果展示区 -->
      <el-col :span="6">
        <el-card class="result-display">
          <p slot="header">鉴定结果</p>
          <div v-if="identificationResult">
            {{ identificationResult }}
          </div>
          <div v-else>
            <p>暂无结果</p>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </main>
</template>

<script>
export default {
  data() {
    return {
      imageSrc: "../../public/ciyun2.png", // 图片的URL
      keyword: "",
      crawledData: null,
      models: ["模型1", "模型2", "模型3"], // 示例模型列表
      selectedModel: "",
      identificationResult: null,
      formats: ["CSV", "JSON", "XML"], // 示例格式列表
      selectedFormat: "",
    };
  },
  methods: {
    crawl() {
      // 这里编写爬取数据的逻辑
      this.crawledData = `爬取到的数据和关键词: ${this.keyword}`;
    },
    identify() {
      if (this.crawledData) {
        // 这里编写鉴定数据的逻辑
        this.identificationResult = `使用${this.selectedModel}模型鉴定的结果`;
      } else {
        this.$message.error("请先爬取数据！");
      }
    },
    downloadData() {
      if (this.crawledData) {
        // 这里编写下载数据的逻辑
        console.log(`数据以${this.selectedFormat}格式下载`);
      } else {
        this.$message.error("请先爬取数据！");
      }
    },
  },
};
</script>

<style>
.container {
  width: 1200px;
  margin: 0 auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.image-row {
  margin-bottom: 30px;
}

.image-display {
  width: 100%;
  height: 300px;
  text-align: center;
  line-height: 300px;
  font-size: 24px;
  background-color: #f5f5f5;
}
.fit-image{
  max-width: 45%;
  max-height: 45%;
  object-fit: contain;
}

.input-group,
.download-group {
  margin-bottom: 20px;
}

.data-group {
  margin-top: 20px;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
}
.option-select {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.option-select .input {
  width: 100%;
  margin: 0;
}

.data-display,
.result-display {
  height: 200px;
  font-size: 18px;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
}

.data-display {
  background-color: #e6f7ff;
}

.result-display {
  background-color: #f6ffed;
}
</style>
