<template>
  <el-row>
    <el-col :span="6">
      <!-- <el-statistic :value="138">
        <template #title>
          <div style="display: inline-flex; align-items: center">
            Ratio of men to women
            <el-icon style="margin-left: 4px" :size="12">
              <Male />
            </el-icon>
          </div>
        </template>
        <template #suffix>/100</template>
      </el-statistic> -->
    </el-col>
    <el-col :span="6">
      <el-statistic title="图像尺寸" :value="imageSize" />
      <el-icon><Picture /></el-icon>
    </el-col>

    <el-col :span="6">
      <el-statistic title="预测框数量" :value="boxCount" />
      <el-icon><Grid /></el-icon>
    </el-col>
    <el-col :span="6">
      <!-- <el-statistic title="Feedback number" :value="562">
        <template #suffix>
          <el-icon style="vertical-align: -0.125em">
            <ChatLineRound />
          </el-icon>
        </template> -->
      <!-- </el-statistic> -->
    </el-col>
  </el-row>
</template>

<script setup>
import { Grid, Picture } from '@element-plus/icons-vue'
</script>

<style scoped>
.el-col {
  text-align: center;
}
</style>

<script>
export default {
  name: 'AppFooter',
  props: {
    imageDimensions: {
      type: Object,
      default: () => ({
        width: 0,
        height: 0,
      }),
    },
    boxCount: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    imageSize() {
      return `${this.imageDimensions.width} × ${this.imageDimensions.height}`;
    }
  }
}
</script>