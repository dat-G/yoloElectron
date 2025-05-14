<template>
  <el-menu default-active="2" id="sidebarContainer" :collapse="isCollapse" :collapse-transition="true">
    <el-menu-item index="1" @click="openDrawer">
      <el-icon>
        <Folder />
      </el-icon>
      <template #title>预测文件夹</template>
    </el-menu-item>
    <!-- <el-sub-menu index="2">
      <template #title>
        <el-icon>
          <location />
        </el-icon>
        <span>Navigator One</span>
      </template>
      <el-menu-item-group>
        <template #title><span>Group One</span></template>
        <el-menu-item index="2-1">item one</el-menu-item>
        <el-menu-item index="2-2">item two</el-menu-item>
      </el-menu-item-group>
      <el-menu-item-group title="Group Two">
        <el-menu-item index="2-3">item three</el-menu-item>
      </el-menu-item-group>
      <el-sub-menu index="2-4">
        <template #title><span>item four</span></template>
        <el-menu-item index="2-4-1">item one</el-menu-item>
      </el-sub-menu>
    </el-sub-menu> -->
    <el-menu-item index="2" disabled>
      <el-icon><DataAnalysis /></el-icon>
      <template #title>训练分析</template>
    </el-menu-item>
    <el-menu-item index="3" @click="handleAboutClick">
      <el-icon><Cpu /></el-icon>
      <template #title>关于</template>
    </el-menu-item>
    <div class="flexgrow"></div>
    <el-menu-item index="5" class="fixed-bottom expand-switch" @click="isCollapse = !isCollapse">
      <el-icon>
        <arrow-right v-if="isCollapse" />
        <arrow-left v-else />
      </el-icon>
    </el-menu-item>
  </el-menu>
</template>
<script setup>
import { ref } from 'vue'
import {
  Document,
  Menu as IconMenu,
  Location,
  Setting,
  ArrowRight,
  ArrowLeft,
  Folder,
  DataAnalysis,
  Cpu,
  Avatar
} from '@element-plus/icons-vue'
import { ElMessageBox } from 'element-plus'

const isCollapse = ref(true)
const handleOpen = () => {
  isCollapse.value = false
}
const handleClose = () => {
  isCollapse.value = true
}

const handleAboutClick = () => {
  ElMessageBox({
    title: '关于',
    message:
      '本项目为东北农业大学 电气与信息学院 计科2101陈曦的毕业设计。<br>' +
      'YOLOv8模型在线预测预览的Web端部署，使用Flask作为后端提供预测服务，Vue3作为前端框架。',
    icon: Avatar,
    showClose: false,
    showCancelButton: false,
    dangerouslyUseHTMLString: true
  })
}

const emit = defineEmits(['toggle-drawer'])
const openDrawer = () => {
  emit('toggle-drawer')
}
</script>
<style>
#sidebarContainer {
  width: fit-content;
  min-width: unset !important;
  height: 100%;
  border-right: 0;
  display: flex;
  flex-direction: column;
}

.fixed-bottom {
  margin-top: auto !important;
}

.el-menu-item {
  min-width: auto !important;
}

.flexgrow {
  flex-grow: 1;
}
</style>