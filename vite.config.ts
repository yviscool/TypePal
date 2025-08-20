import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig(({ mode }) => {
  const isProd = mode === 'production'

  return {
    plugins: [
      vue(),
      UnoCSS()
    ],
    resolve: {
      // 使用 URL 方式确保在 Windows/不同运行目录下路径稳定
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    // 一般保持默认 base 即可，如需相对路径部署可设为 './'
    // base: '/',
    build: {
      target: 'es2018',        // 兼顾体积与兼容性（现代浏览器）
      outDir: 'dist',
      assetsDir: 'assets',
      cssCodeSplit: true,
      sourcemap: false,        // 生产环境默认关闭（需要排查时再临时打开）
      minify: isProd ? 'esbuild' : false, // 开发构建时不压缩（几乎不用 build），生产用 esbuild
      chunkSizeWarningLimit: 700,
      modulePreload: {
        polyfill: false        // 减少运行时代码
      },
      rollupOptions: {
        output: {
          // 粒度合适的手动分包：Vue 栈、UI/样式工具与其他第三方库拆分
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('/vue')) return 'vue'
              if (id.includes('pinia') || id.includes('vue-router')) return 'vue'
              if (id.includes('unocss')) return 'ui'
              return 'vendor'
            }
          }
        }
      },
      brotliSize: false        // 避免无意义的体积计算耗时
    },
    esbuild: {
      // 生产环境移除调试语句
      drop: isProd ? ['console', 'debugger'] : [],
      legalComments: 'none'
    },
    define: {
      // 生产环境关闭 DevTools
      __VUE_PROD_DEVTOOLS__: false
      // 如明确不使用 Options API，可设为 false 进一步瘦身：
      // __VUE_OPTIONS_API__: false
    }
  }
})