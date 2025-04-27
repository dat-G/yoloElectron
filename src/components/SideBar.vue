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
    <el-menu-item index="3" disabled>
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
  Cpu
} from '@element-plus/icons-vue'

const isCollapse = ref(true)
const handleOpen = () => {
  isCollapse.value = false
}
const handleClose = () => {
  isCollapse.value = true
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