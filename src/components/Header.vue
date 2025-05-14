<template>
  <el-page-header :icon="null" id="headerContainer" title="YOLO Predict">
    <template #content>
      <div class="flex items-center">
        <el-avatar :size="32" class="mr-3" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
        <!-- <ModelPath :path="path" v-slot="{ }"></ModelPath> -->
        <el-tag>YOLOv8 MAttnOpt</el-tag>
      </div>
    </template>
    <template #extra>
      <div class="flex items-center">
        <div class="extraControl ml-4" v-if="predictions.length > 0">
          <el-button @click="showPredictions">查看标注</el-button>
          <el-button @click="handleCopyBtnClick" type="primary" class="ml-2">复制标注</el-button>
        </div>
      </div>
    </template>
  </el-page-header>
</template>

<script setup>
import {
  Plus,
  Minus,
  Edit
} from '@element-plus/icons-vue';
</script>

<script>
import ModelPath from './ModelPath.vue';
import { ElMessageBox, ElMessage } from 'element-plus';
// const hljs = require('highlight.js');
import { json } from '@codemirror/lang-json';
import { basicSetup } from "codemirror";
import { EditorView } from "@codemirror/view";
import {EditorState} from "@codemirror/state"

// import hljs from 'highlight.js/lib/core';
// import json from 'highlight.js/lib/languages/json';
// import 'highlight.js/styles/github.css';
// hljs.registerLanguage('json', json);


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
    handleCopyBtnClick() {
      this.copyToClipboard(JSON.stringify(this.predictions, null, 2));
    },
    copyToClipboard(text) {
      navigator.clipboard.writeText(text)
        .then(() => ElMessage({
          message: '标注信息已复制到剪切板。',
          type:'success',
        }))
        .catch(() => ElMessage({
          message: '复制失败，请手动复制。',
          type: 'warning',
        }));
    },
    showPredictions() {
      // 保存editorView引用到组件实例
      let currentEditorView = null;

      ElMessageBox.alert(
        `<div id="msgbox-editor" style="height: 400px; width: 400px;"></div>`,
        '预测结果',
        {
          dangerouslyUseHTMLString: true,
          distinguishCancelAndClose: true,
          confirmButtonText: '关闭',
          showCancelButton: true,
          cancelButtonText: '复制',
          customStyle: "",
          // 添加关闭前钩子
          beforeClose: (action, instance, done) => {
            if (action === 'cancel') { // 点击复制按钮
              if (currentEditorView) {
                const content = currentEditorView.state.doc.toString();
                // 复制到剪贴板
                this.copyToClipboard(content);
                console.log(content);
              }
            }
            done(); // 必须调用done()关闭弹窗
          }
        }
      ).then(() => {
        if (currentEditorView) currentEditorView.destroy();
      });

      const observer = new MutationObserver((mutations) => {
        const editorDiv = document.getElementById('msgbox-editor');
        if (editorDiv) {
          observer.disconnect();
          // 初始化时保存editorView引用
          currentEditorView = new EditorView({
            doc: JSON.stringify(this.predictions, null, 2),
            parent: editorDiv,
            extensions: [
              basicSetup,
              json(),
              EditorView.theme({
                "&": { height: "100%" },
                ".cm-content": { fontFamily: "monospace" }
              }),
              // EditorView.editable.of(false)
              EditorState.readOnly.of(true),
              // EditorView.editable.of(false),
            ]
          });
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
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
  flex-wrap: nowrap;
  /* Prevent wrapping */
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