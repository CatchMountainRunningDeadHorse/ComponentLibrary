const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')
 
module.exports = {
    configureWebpack: {
        plugins: [
            new CopyWebpackPlugin([
                {
                    from: path.join(__dirname, 'node_modules'),
                    to: path.join(__dirname, 'unpackage/dist', process.env.NODE_ENV === 'development' ? 'dev' : 'build', process.env.UNI_PLATFORM, 'node_modules')
                }
            ])
        ]
    }
}