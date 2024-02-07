import { fileURLToPath } from 'url'
import { defineConfig } from 'vite'
import svg from 'vite-svg-loader'
import vue from '@vitejs/plugin-vue'
import eslint from 'vite-plugin-eslint'
import autoprefixer from 'autoprefixer'

export default defineConfig({
  define: {
    // Enable / disable Options API support
    __VUE_OPTIONS_API__: true,
    // Enable / disable devtools support in production
    __VUE_PROD_DEVTOOLS__: false,
    // Enable / disable detailed warnings for hydration mismatches in production
    __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false,
  },
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: tag => tag.includes('-'),
        },
      },
    }),
    svg({
      defaultImport: 'component',
    }),
    eslint({
      lintOnStart: false,
    }),
  ],
  css: {
    postcss: {
      plugins: [
        autoprefixer(),
      ],
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
