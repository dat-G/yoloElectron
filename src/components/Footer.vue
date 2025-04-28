<template>
  <el-row>
    <!-- <el-col :span="6"> -->
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
    <!-- </el-col> -->
    <el-col :span="8">
      <el-statistic title="图像尺寸" :value="imageSize" />
      <el-icon>
        <Picture />
      </el-icon>
    </el-col>

    <el-col :span="8">
      <el-statistic title="预测框数量" :value="boxCountText" />
      <el-icon>
        <Grid />
      </el-icon>
    </el-col>
    <el-col :span="8">
      <el-statistic title="推理速度" :value="speedText"/>
      <el-icon>
        <Aim />
      </el-icon>
    </el-col>
  </el-row>
</template>

<script setup>
import { Grid, Picture, Aim } from '@element-plus/icons-vue'
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
    predictionTime: {
      type: Number,
      default: 0,
    }
  },
  computed: {
    imageSize() {
      if (!this.imageDimensions || !this.imageDimensions.width || !this.imageDimensions.height) {
        return 'N/A';
      }
      return `${this.imageDimensions.width} × ${this.imageDimensions.height}`;
    },
    boxCountText() {
      return this.boxCount > 0 ? this.boxCount : 'N/A';
    },
    speedText() {
      return this.predictionTime > 0 ? `${this.predictionTime} ms` : 'N/A';
    }
    // calSpeed() {
    //   return this.predictionTime > 0 ? Math.round(1000 / this.predictionTime * 100) / 100 : 'N/A';
    // }
  },
  watch: {

  }
}
</script>

<style scoped>
.el-col {
  text-align: center;
}
</style>