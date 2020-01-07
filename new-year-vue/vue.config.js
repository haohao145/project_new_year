const path = require('path');

module.exports = {
    // 部署应用包时的基本 URL,用法和 webpack 本身的 output.publicPath 一致
    publicPath: './',
    // 输出文件目录
    outputDir: 'dist',
    // eslint-loader 是否在保存的时候检查
    lintOnSave: false,
    // 是否使用包含运行时编译器的 Vue 构建版本
    runtimeCompiler: false,
    // 生产环境是否生成 sourceMap 文件
    productionSourceMap: false,
    // 生成的 HTML 中的 <link rel="stylesheet"> 和 <script> 标签上启用 Subresource Integrity (SRI)
    integrity: false,
    // 以下是pwa配置  设置浏览器小图标
    pwa: {
        iconPaths: {
            favicon32: 'xxl-logo.ico',
            favicon16: 'xxl-logo.ico',
            appleTouchIcon: 'xxl-logo.ico',
            maskIcon: 'xxl-logo.ico',
            msTileImage: 'xxl-logo.ico'
        }
    },
    // webpack相关配置
    chainWebpack: (config) => {
        config.resolve.alias
            .set('vue$', 'vue/dist/vue.esm.js')
            .set('@', path.resolve(__dirname, './src'));
        config.resolve.symlinks(true); //热更新
    },
    configureWebpack: (config) => {
        if (process.env.NODE_ENV === 'production') {
            // 生产环境
            config.mode = 'production'
        } else {
            // 开发环境
            config.mode = 'development'
        }
    },
    // chainWebpack: config => {
    //     // 修复HMR
    //     config.resolve.symlinks(true);

    // },
    // css相关配置
    css: {
        // 是否分离css（插件ExtractTextPlugin）
        extract: true,
        // 是否开启 CSS source maps
        sourceMap: false,
        // css预设器配置项
        loaderOptions: {
            sass: {
                //~表示这是一个模块  为了解决  vue中 sass  引入 其他 sass 是 里面的图片路径问题
                prependData: `@import "~@/assets/sass/index.scss";`
            }
        },
        // 是否启用 CSS modules for all css / pre-processor files.
        requireModuleExtension: true
    },
    // 是否使用 thread-loader
    parallel: require('os').cpus().length > 1,
    // PWA 插件相关配置
    pwa: {},
    // webpack-dev-server 相关配置
    devServer: {
        open: true,
        host: '10.0.111.18',
        port: 8090,
        https: false,
        hotOnly: false,
        // http 代理配置
        proxy: {
            '/proxyApi': {
                target: 'http://10.0.111.18:3000/',
                changeOrigin: true,
                pathRewrite: {
                    '^/proxyApi': ''
                }
            }
        },
        before: (app) => {}
    },
    // 第三方插件配置
    pluginOptions: {
        //配置  sass 中的 图片路径问题
        // "style-resources-loader": {
        //     preProcessor: "less",
        //     patterns: [path.resolve(__dirname, "./src/assets/sass/index.sass")]
        // }
    }
}
