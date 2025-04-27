import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import proxyConfig from './proxyConfig.js';

export default defineConfig({
    plugins: [vue()],
    server: {
        proxy: Object.fromEntries(
            Object.entries(proxyConfig.proxyList).map(([path, config]) => [
                path,
                {
                    ...config,
                    configure: (proxy) => {
                        proxy.on('proxyReq', (proxyReq, req) => {
                            console.log(`[PROXY] ${req.method} ${req.url} => ${config.target}${proxyReq.path}`)
                        })
                    }
                }
            ])
        )
    }
});
