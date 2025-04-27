<template>
    <div class="common-layout">
        <el-container>
            <el-aside style="width: auto">
                <side-bar></side-bar>
            </el-aside>
            <el-container>
                <el-header id="appHeader">
                    <app-header></app-header>
                </el-header>
                <el-main>
                    <app-main></app-main>
                </el-main>
                <el-footer height="auto" style="margin: 10px; padding-bottom: 10px;">
                    <app-footer></app-footer>
                </el-footer>
            </el-container>
        </el-container>
    </div>
</template>

<script>
console.log('👋 This message is being logged by "App.vue", included via Vite');
import AppHeader from './components/Header.vue'
import AppMain from './components/Main.vue'
import AppFooter from './components/Footer.vue'
import SideBar from './components/SideBar.vue';


export default {
    name: 'App',
    components: {
        AppHeader,
        AppMain,
        AppFooter,
        SideBar
    }
};
</script>

<style>
html, body {
  height: 100%;
  margin: 0;
  user-select: none;
  overflow: hidden;
}

.common-layout, #app, .el-container {
    height: 100vh;
    overflow: hidden;
}

.el-main {
    overflow: hidden !important;
    position: relative;
}
</style>