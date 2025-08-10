import presetWind4 from '@unocss/preset-wind4'

import { defineConfig, presetIcons, presetTypography, presetAttributify, transformerDirectives } from 'unocss'

export default defineConfig({
    presets: [
        // 预设Wind4 - 提供Tailwind CSS v4兼容的工具类
        presetWind4(),
        // 预设Icons - 支持图标类名，可以直接使用图标
        presetIcons(),
        // 预设Attributify - 支持属性化模式，可以将工具类写在HTML属性中
        presetAttributify(),
        // 预设Typography - 提供排版相关的工具类
        presetTypography(),
    ],
    transformers: [
        // 转换器Directives - 支持@apply等CSS指令
        transformerDirectives(),
    ],
    theme: {
        colors: {
            // 亮色主题色彩 
            'warm-light': '#F7F5F2',
            'coral': {
                100: '#FFE5E5',
                200: '#FFCCCC',
                300: '#FFB3B3',
                400: '#FF9999',
                500: '#FF6B6B',
                600: '#FF5252',
                700: '#FF3939',
                800: '#E63946',
                900: '#CC2936'
            },
            'lemon': {
                100: '#FFF9E6',
                200: '#FFF3CC',
                300: '#FFECB3',
                400: '#FFE699',
                500: '#FFD166',
                600: '#FFCC52',
                700: '#FFC739',
                800: '#E6B85C',
                900: '#CCA352'
            },
            // 夜间主题色彩
            'night-dark': '#1A202C',
            'cyber-pink': '#F43F5E',
            'electric-blue': '#3B82F6'
        }
    }
})
