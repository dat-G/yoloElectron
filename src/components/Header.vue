<template>
  <el-page-header :icon="null" id="headerContainer" title="YOLO Predict">
    <template #content>
      <div class="flex items-center">
        <el-avatar :size="32" class="mr-3"
          src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
        <ModelPath :path="path" v-slot="{ }"></ModelPath>
        <el-tag>Default</el-tag>
      </div>
    </template>
    <template #extra>
      <div class="flex items-center">
        <div class="extraControl ml-4">
          <el-button @click="showPredictions">Print</el-button>
          <el-button type="primary" class="ml-2">Edit</el-button>
        </div>
      </div>
    </template>
  </el-page-header>
</template>

<script setup>
import {
  Plus,
  Minus
} from '@element-plus/icons-vue';
</script>

<script>
import ModelPath from './ModelPath.vue';
import { ElMessageBox } from 'element-plus';

export default {
  name: 'AppHeader',
  components: {
    ModelPath,
  },
  data() {
    return {
      path: []
    };
  },
  props: ['predictions'],
  methods: {
    showPredictions() {
      ElMessageBox.alert(
        `<pre>${JSON.stringify(this.predictions, null, 2)}</pre>`,
        '预测结果',
        {
          dangerouslyUseHTMLString: true,
          confirmButtonText: '关闭'
        }
      )
    }
  },
  async mounted() {
    try {
      const config = await window.electronAPI.getAppConfig();
      this.path = config.app.model_path.split('/');
    } catch (e) {
      console.error('配置获取失败:', e);
      this.path = ['默认模型'];
    }
  }
}
</script>

<style>
#headerContainer {
  margin-top: 10px;
}

.flex {
  display: flex;
  flex-wrap: nowrap; /* Prevent wrapping */
  gap: 10px;
}

.items-center {
  align-items: center;
}

.el-page-header__back {
  display: none !important;
}

.el-divider--vertical {
  display: none !important;
}

.ml-4 {
  margin-left: 16px;
}

.ml-2 {
  margin-left: 8px;
}

.ml-1 {
  margin-left: 4px;
}
</style>