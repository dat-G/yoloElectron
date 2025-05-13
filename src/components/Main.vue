<template>
    <div style="height: 100%; position: relative;" class="previewArea">
        <canvas v-show="showPreview" ref="previewCanvas"
            style="width: 100%; height: 100%; object-fit: contain;"></canvas>
        <el-empty class="image-placeholder" v-show="!showPreview" :description="errorMessage" style="height: 100%;">
            <el-button type="primary" @click="handleOpenClick">打开</el-button>
            <input ref="fileInput" type="file" hidden @change="handleFileChange">
        </el-empty>
        <yolo-predictor 
            v-show="showPreview" 
            ref="predictor" 
            :image-src="previewImage" 
            @prediction-update="handlePredictionsUpdate"
            @prediction-time="handlePredictionTime"
        ></yolo-predictor>
    </div>
    <div class="float-control-Right" v-show="showPreview">
        <el-affix position="bottom" :offset="130">
            <el-button-group class="picControl">
                <el-button circle @click="handleZoomIn">
                    <el-icon><Plus /></el-icon>
                </el-button>
                <el-button type="primary" circle @click="handleZoomOut">
                    <el-icon><Minus /></el-icon>
                </el-button>
            </el-button-group>
        </el-affix>
    </div>
    <div class="float-control-Left" v-show="showPreview">
        <el-affix position="bottom" :offset="130">
            <el-button-group class="picControl">
                <el-button circle @click="handleOpenClick">
                    <el-icon><Edit /></el-icon>
                </el-button>
            </el-button-group>
        </el-affix>
    </div>
</template>

<style>
div[style*="position: relative"] {
    overflow: visible !important;  /* 修改为可见 */
    height: 100% !important;
    width: 100% !important;
    position: relative;
}

canvas {
    position: absolute;
    left: 0;
    top: 0;
    transform-origin: 0 0;
    will-change: transform;
    cursor: pointer;
}

.float-control-Right {
    position: fixed;
    right: 20px;
    /* bottom: 20px; */
    z-index: 1000;
}
.float-control-Left {
    border: 8px;
    /* position: fixed; */
    padding-left: 20px;
    /* bottom: 20px; */
}

/* 新增滚动控制样式 */

.picControl {
    display: flex;
    gap: 8px;
    background: rgba(255,255,255,0.9);
    padding: 8px;
    border-radius: 24px;
    box-shadow: 0 2px 12px rgba(0,0,0,0.1);
}
</style>

<script setup>
import {
  Plus,
  Minus,
  Edit
} from '@element-plus/icons-vue';
</script>

<script>
import YoloPredictor from './YoloPredictor.vue'

export default {
    components: {
        YoloPredictor
    },
    props: {
        selectedFile: {
            type: Object,
            default: null
        }
    },
    emits: ['image-size-update', 'prediction-update', 'prediction-time'],
    data() {
        return {
            showPreview: false,
            previewImage: null,
            errorMessage: '无图片',
            isPredicting: false,
            predictions: [],
            scale: 1.0,
            baseWidth: 0,
            baseHeight: 0,
            dragging: false,
            startX: 0,
            startY: 0,
            offsetX: 0,
            offsetY: 0,
            boxCount: 0,
        }
    },
    watch: {
        // 监听selectedImage属性的变化
        selectedFile(newFile) {
            if (newFile) {
                console.log('Main接收到新图片:', newFile)
                this.simulateFileSelection(newFile)
            }
        }
    },
    mounted() {
        const canvas = this.$refs.previewCanvas;
        // 添加滚轮事件监听
        canvas.addEventListener('wheel', this.handleWheel, { passive: false });
        canvas.addEventListener('mousedown', this.startDragging);
        canvas.addEventListener('mousemove', this.drag);
        canvas.addEventListener('mouseup', this.stopDragging);
        canvas.addEventListener('mouseleave', this.stopDragging);
        window.addEventListener('resize', this.handleResize);
        
        // 新增鼠标事件
        canvas.addEventListener('mousemove', this.handleCanvasHover);
        canvas.addEventListener('click', this.handleCanvasClick);
    },
    beforeDestroy() {
        const canvas = this.$refs.previewCanvas;
        canvas.removeEventListener('wheel', this.handleWheel);
        canvas.removeEventListener('mousedown', this.startDragging);
        canvas.removeEventListener('mousemove', this.drag);
        canvas.removeEventListener('mouseup', this.stopDragging);
        canvas.removeEventListener('mouseleave', this.stopDragging);
        window.removeEventListener('resize', this.handleResize);
        canvas.removeEventListener('mousemove', this.handleCanvasHover);
        canvas.removeEventListener('click', this.handleCanvasClick);
    },
    methods: {
        startDragging(e) {
            this.dragging = true;
            this.startX = e.clientX - this.offsetX;
            this.startY = e.clientY - this.offsetY;
        },
        drag(e) {
            if (this.dragging) {
                this.offsetX = e.clientX - this.startX;
                this.offsetY = e.clientY - this.startY;
                this.applyTransform();
            }
        },
        stopDragging() {
            this.dragging = false;
        },
        applyTransform() {
            const canvas = this.$refs.previewCanvas;
            canvas.style.transform = `translate(${this.offsetX}px, ${this.offsetY}px)`;
        },
        // 在handleFileChange中重置位置
        handleOpenClick() {
            this.$refs.fileInput.click()
        },
        handleZoomIn() {
            this.scale = Math.min(this.scale * 1.2, 3);
            this.updateCanvasSize();
        },
        handleZoomOut() {
            // 添加精确小数处理
            this.scale = Math.max(parseFloat((this.scale * 0.8).toFixed(2)), 0.2);
            this.updateCanvasSize();
        },
        updateCanvasSize() {
            const canvas = this.$refs.previewCanvas;
            // 添加尺寸边界检测
            const minSize = 50; // 最小显示尺寸
            const displayWidth = Math.max(this.baseWidth * this.scale, minSize);
            const displayHeight = Math.max(this.baseHeight * this.scale, minSize);
            
            canvas.style.width = `${displayWidth}px`;
            canvas.style.height = `${displayHeight}px`;
            this.$refs.predictor.drawBoxes(canvas);
        },
        // 在handleFileChange中保存原始尺寸
        async handleFileChange(e) {
            const file = e.target.files[0]
            if (file) {
                this.errorCheck = false;
                const reader = new FileReader()
                reader.onload = (event) => {
                    const img = new Image()
                    img.onload = () => {
                        this.baseWidth = img.naturalWidth;
                        this.baseHeight = img.naturalHeight;
                        
                        // 触发尺寸更新事件
                        this.$emit('image-size-update', {
                          width: this.baseWidth,
                          height: this.baseHeight
                        });
                        const canvas = this.$refs.previewCanvas;
                        canvas.width = img.naturalWidth;
                        canvas.height = img.naturalHeight;
                        const ctx = canvas.getContext('2d');
                        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                        this.showPreview = true
                        this.previewImage = event.target.result
                        this.$nextTick(() => {
                            this.$refs.predictor.detect(canvas)
                        })
                    }
                    img.src = event.target.result
                }
                reader.onerror = (event) => {
                    this.errorMessage = `文件加载失败: ${event.target.error.name}`;
                    this.showPreview = false
                };
                if (!this.errorCheck) {
                    reader.readAsDataURL(file)
                }
            }
        },
        handleImageError(e) {
            this.errorMessage = '图片加载失败';
            this.showPreview = false;
        },
        handleImageLoad() {
            this.$nextTick(() => {

                const imageElement = this.$refs.previewImageRef.$el.querySelector('img');
                if (imageElement && this.$refs.predictor) {
                    imageElement.onload = () => {
                        this.$refs.predictor.detect(imageElement);
                    };
                    if (imageElement.complete) {
                        this.$refs.predictor.detect(imageElement);
                    }
                }
            });
        },
        handlePredictionsUpdate(predictions) {
            console.log('Main 接收到预测结果:', predictions)
            this.boxCount = predictions.length;
            console.log('Main 预测框数量:', this.boxCount);
            this.$emit('prediction-update', predictions)
            // this.$emit('prediction-count', predictions.length)
        },
        // 新增方法：加载选中的图片
        loadSelectedImage(imagePath) {
            // 设置预览图片路径
            this.previewImage = imagePath
            // 显示预览区域
            this.showPreview = true
            
            // 如果图片是blob URL，不需要加载至canvas，YoloPredictor会直接处理
            if (imagePath.startsWith('blob:')) {
                // 通知YoloPredictor开始处理图片
                this.$nextTick(() => {
                    if (this.$refs.predictor) {
                        // 手动触发YoloPredictor的预测
                        this.$refs.predictor.detectImage()
                    }
                })
            } else {
                // 对于其他类型的图片路径，可能需要先加载
                const img = new Image()
                img.onload = () => {
                    // 图片加载完成后，通知YoloPredictor开始处理
                    this.$nextTick(() => {
                        if (this.$refs.predictor) {
                            this.$refs.predictor.detectImage()
                        }
                    })
                }
                img.src = imagePath
            }
        },
        simulateFileSelection(file) {
            try {
                console.log('正在模拟文件选择:', file.name)
                
                // 方法1：直接调用文件处理函数
                this.handleFileChange({ target: { files: [file] } })
                
                /* 方法2：如果方法1不工作，尝试这种方式
                // 创建一个新的 DataTransfer 对象
                const dataTransfer = new DataTransfer()
                // 将文件添加到 DataTransfer 对象
                dataTransfer.items.add(file)
                
                // 获取文件输入框元素
                const fileInput = this.$refs.fileInput
                // 设置文件
                fileInput.files = dataTransfer.files
                
                // 手动触发 change 事件
                const event = new Event('change', { bubbles: true })
                fileInput.dispatchEvent(event)
                */
            } catch (error) {
                console.error('模拟文件选择失败:', error)
            }
        },
        
        // // 其他现有方法...
        // handlePredictionsUpdate(count) {
        //     this.boxCount = count
        //     this.$emit('prediction-update', count)
        // },
        // 添加处理预测时间的方法
        handlePredictionTime(time) {
            console.log('Main 接收到预测时间:', time, 'ms');
            this.$emit('prediction-time', time);
        }
    }
}
</script>

