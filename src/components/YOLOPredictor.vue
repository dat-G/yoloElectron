<template>

</template>
<script>
// import { createProxyMiddleware, Filter, Options, RequestHandler } from 'http-proxy-middleware';
// import proxyConfig from '../../proxyConfig.js'; // 导入代理配置文件
// import { createProxyMiddleware } from 'http-proxy-middleware';
// const apiProxy = createProxyMiddleware('/predict', 'http://localhost:10404')


export default {
    name: 'YOLOPredictor',
    props: {
        imageSrc: {
            type: String,
            default: null
        }
    },
    watch: {
        imageSrc: {
            handler(newVal) {
                if (newVal) {
                    console.log('YoloPredictor 接收到新图片:', newVal)
                    this.detectImage()
                }
            },
            immediate: true
        }
    },
    data() {
        return {
            predictions: [],
            // proxyTable: proxyConfig.proxyList
        };
    },
    dev: {

    },
    methods: {
        // 暴露给外部的方法，用于手动触发预测
        detectImage() {
            if (!this.imageSrc) return

            const img = new Image()
            img.onload = () => {
                // 进行实际的预测
                this.detect(img)
            }
            img.src = this.imageSrc
        },

        async detect(imageElement) {
            try {
                // 开始计时
                const startTime = performance.now();
                
                // 获取图像数据
                const canvas = document.createElement('canvas');
                canvas.width = imageElement.width || imageElement.naturalWidth;
                canvas.height = imageElement.height || imageElement.naturalHeight;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(imageElement, 0, 0, canvas.width, canvas.height);
                
                // 获取图像数据并转为 blob
                const blob = await new Promise(resolve => {
                    canvas.toBlob(resolve, 'image/jpeg');
                });
                
                // 发送到服务器
                const formData = new FormData();
                formData.append('image', blob);
                
                const response = await fetch('/yolo-detect/predict', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json'
                    },
                    body: formData
                });
                const jsonData = await response.json();
                this.predictions = jsonData.map(pred => ({
                    ...pred,
                    bbox: pred.bbox.map(num => parseFloat(num.toFixed(2)))
                }))
                
                // 结束计时
                const endTime = performance.now();
                const predictionTime = Math.round(endTime - startTime);
                
                console.log('预测耗时:', predictionTime, 'ms');
                
                // 发出预测时间事件
                this.$emit('prediction-time', predictionTime);
                
                // 发出预测框数量事件
                const boxCount = this.predictions.length;
                this.$emit('prediction-update', this.predictions);
                
                console.log('原始预测数据:', this.predictions);
                console.log('预测框数量:', boxCount);
                
                this.drawBoxes(imageElement);
                return this.predictions;
            } catch (error) {
                console.error('Prediction error:', error);
                return [];
            }
        },
        async drawBoxes(canvas) {
            const ctx = canvas.getContext('2d');
            const { width, height } = canvas;

            console.log('Canvas尺寸:', canvas.width, canvas.height);
            // console.log('预测数据:', this.predictions);

            for (const pred of this.predictions) {
                // console.log('预测框详情:', 
                //     `类别:${pred.class} 置信度:${pred.confidence}`,
                //     `坐标:${pred.bbox}`);
                const [x1, y1, width, height] = pred.bbox;
                const imageElement = new Image();
                imageElement.src = this.imageSrc;
                await new Promise((resolve) => {
                    imageElement.onload = resolve;
                });
                const naturalWidth = imageElement.naturalWidth;
                const naturalHeight = imageElement.naturalHeight;
                console.log('原始图像尺寸:', naturalWidth, naturalHeight);

                const scaleX = canvas.width / naturalWidth;
                const scaleY = canvas.height / naturalHeight;

                const scaledX1 = x1 * scaleX;
                const scaledY1 = y1 * scaleY;
                const scaledWidth = width * scaleX;
                const scaledHeight = height * scaleY;

                ctx.lineWidth = 5;
                ctx.strokeStyle = '#FF3030';
                ctx.strokeRect(scaledX1, scaledY1, scaledWidth, scaledHeight);
                // console.log('绘制框坐标:', scaledX1, scaledY1, scaledWidth, scaledHeight);

                ctx.fillStyle = '#FF3030';
                ctx.font = '14px Courier';
                const text = `${pred.class} (${Math.round(pred.confidence * 100)}%)`;
                const textWidth = ctx.measureText(text).width;
                const padding = 2;
                ctx.fillRect(
                    scaledX1 - padding,  // -ctx.lineWidth/2
                    (scaledY1 > 10 ? scaledY1 - 5 : 15) - 16 + padding,
                    textWidth + padding * 2,
                    16 + padding * 2
                );
                ctx.fillStyle = '#FFFFFF';
                ctx.fillText(text, scaledX1, scaledY1 > 10 ? scaledY1 - 5 : 15);
            };
        }
    }
};
</script>