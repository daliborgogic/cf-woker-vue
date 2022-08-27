import { splitVendorChunkPlugin } from 'vite'
import vuePlugin from '@vitejs/plugin-vue'

export default {
  dev: false,
  plugins: [
    vuePlugin({
      reactivityTransform: true
    }),
    splitVendorChunkPlugin(),
    {
      configResolved(config) {
        config.ssr.external = ['vue', 'vue-router', 'nprogress', '@vueuse/head']
      }
    }
  ],
  resolve: {
    dedupe: ['vue', 'vue-router', 'nprogress', '@vueuse/head']
  },
  build: {
    minify: true
  },
  server: {
    port: 8787
  },
  ssr: {
    target: 'webworker',
    noExternal: true
  }
}
