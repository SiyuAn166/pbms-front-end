module.exports = {
    publicPath: '/', //项目的访问路径
    assetsDir: './static',  //静态资源，js css等的输出路径
    outputDir: 'petrobest',
    devServer: {
        proxy: {
            "/api": {   //后台应用接口
                target: "http://localhost:8802",
                changeOrigin: true,
                pathRewrite: {
                    "^/api": ""
                }
            }

        }
    }
}
