<template>

</template>
<script>
// import { createProxyMiddleware, Filter, Options, RequestHandler } from 'http-proxy-middleware';
// import proxyConfig from '../../proxyConfig.js'; // 导入代理配置文件
// import { createProxyMiddleware } from 'http-proxy-middleware';
// const apiProxy = createProxyMiddleware('/predict', 'http://localhost:10404')


export default {
    name: 'YOLOPredictor',
    props: ['imageSrc'],
    data() {
        return {
            predictions: [],
            // proxyTable: proxyConfig.proxyList
        };
    },
    dev: {

    },
    methods: {
        async detect(imageElement) {
            const formData = new FormData();
            // 添加原生数据URL转Blob方法
            const dataURLtoBlob = (dataURL) => {
                const arr = dataURL.split(',');
                const mime = arr[0].match(/:(.*?);/)[1];
                const bstr = atob(arr[1]);
                let n = bstr.length;
                const u8arr = new Uint8Array(n);
                while (n--) {
                    u8arr[n] = bstr.charCodeAt(n);
                }
                return new Blob([u8arr], { type: mime });
            };

            // 修正请求头设置
            // headers: {
            //     'Accept' : 'application/json'
            // }
            const blob = await fetch(this.imageSrc)
                .then(res => res.blob());
            formData.append('image', blob, 'image.jpg');

            try {
                const response = await fetch('/yolo-detect/predict', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json'
                    },
                    body: formData
                });

                this.predictions = await response.json();
                console.log('原始预测数据:', this.predictions);
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
            console.log('预测数据:', this.predictions);

            for (const pred of this.predictions) {
                console.log('预测框详情:', 
                    `类别:${pred.class} 置信度:${pred.confidence}`,
                    `坐标:${pred.bbox}`);
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
                console.log('绘制框坐标:', scaledX1, scaledY1, scaledWidth, scaledHeight);

                ctx.fillStyle = '#FF3030';
                ctx.font = '14px Courier';
                const text = `${pred.class} (${Math.round(pred.confidence * 100)}%)`;
                const textWidth = ctx.measureText(text).width;
                const padding = 2;
                ctx.fillRect(
                    scaledX1 - padding,  // -ctx.lineWidth/2
                    (scaledY1 > 10 ? scaledY1 - 5 : 15) - 16 + padding, 
                    textWidth + padding*2, 
                    16 + padding*2
                );
                ctx.fillStyle = '#FFFFFF';
                ctx.fillText(text, scaledX1, scaledY1 > 10 ? scaledY1 - 5 : 15);
            };
        }
    }
};
</script>