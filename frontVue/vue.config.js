module.exports = {
    devServer: {
    proxy: 'http://${import.meta.env.VITE_LOCAL_IP}:${import.meta.env.VITE_BACKEND_PORT}/',
    }
    }