export default {
    proxyList: {
        "/yolo-detect": {
            target: "http://localhost:10404",   //目的地的地址，需要有http://
            changeOrigin: true,    //必须，允许跨域
            rewrite: path => path.replace(/^\/yolo-detect/, ''),
        }
    }
}