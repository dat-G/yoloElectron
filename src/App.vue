<template>
    <div class="common-layout">
        <el-container>
            <el-aside style="width: auto">
                <side-bar @toggle-drawer="toggleDrawer"></side-bar>
            </el-aside>
            <el-container>
                <el-header id="appHeader">
                    <app-header></app-header>
                </el-header>
                <el-main>
                    <app-main @image-size-update="handleImageSizeUpdate" @prediction-update="handlePredictionsUpdate" @prediction-time="handlePredictionTime"
                        :selected-file="selectedFile"></app-main>
                </el-main>
                <el-footer height="auto" style="margin: 10px; padding-bottom: 10px;">
                    <app-footer :image-dimensions="imageDimensions" :box-count="boxCount" :prediction-time="predictionTime"></app-footer>
                </el-footer>
            </el-container>
        </el-container>
        <app-drawer v-model:visible="drawer" @file-selected="handleFileSelected">
        </app-drawer>
    </div>
</template>

<script setup>
import { ref } from 'vue';
const drawer = ref(false)
const selectedFile = ref(null)

const toggleDrawer = () => {
    drawer.value = true
}

const handleFileSelected = (file) => {
    console.log('App接收到选中图片:', file)
    selectedFile.value = file
}
</script>

<script>
console.log('👋 This message is being logged by "App.vue", included via Vite');
import AppHeader from './components/Header.vue'
import AppMain from './components/Main.vue'
import AppFooter from './components/Footer.vue'
import SideBar from './components/SideBar.vue';
import AppDrawer from './components/Drawer.vue'


export default {
    name: 'App',
    components: {
        AppHeader,
        AppMain,
        AppFooter,
        SideBar,
        AppDrawer
    },
    data() {
        return {
            imageDimensions: { width: 0, height: 0 },
            boxCount: 0,
            predictionTime: 0,
        }
    },
    methods: {
        handleImageSizeUpdate(dimensions) {
            this.imageDimensions = dimensions;
        },
        handlePredictionsUpdate(count) {
            console.log('App 接收到预测框数量：', count); // 添加调试输出
            this.boxCount = count;
        },
        handlePredictionTime(time) {
            
            this.predictionTime = time;
            console.log('App 接收到预测时间：', this.predictionTime); // 添加调试输出
        }
    }
};
</script>

<style>
html,
body {
    height: 100%;
    margin: 0;
    user-select: none;
    overflow: hidden;
}

.common-layout,
#app,
.el-container {
    height: 100vh;
    overflow: hidden;
}

.el-main {
    overflow: hidden !important;
    position: relative;
}
</style>