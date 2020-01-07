//判断 当前环境  设置请求位置
let baseUrl = serverConfig.development // 本地代理

import serverConfig from "../../public/serverConfig.json"

switch (process.env.NODE_ENV) {
    case 'development':
        baseUrl = serverConfig.development // 开发环境url
        break
        // case 'pre':
        //     baseUrl = 'https://pre-server.feleti.cn' // 预上线环境url
        //     break
    case 'production':
        baseUrl = serverConfig.production // 生产环境url
        break
}

export default baseUrl
