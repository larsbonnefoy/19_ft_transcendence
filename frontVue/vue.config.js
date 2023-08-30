module.exports = {
    devServer: {
    proxy: 'http://${import.meta.env.VITE_BACK}/',
    }
    }