module.exports = function (api) {
    api.cache(true);
    return {
        presets: ['babel-preset-expo'],
        plugins: [
            'module:react-native-dotenv',  // ✅ Corrected dotenv plugin
            'react-native-reanimated/plugin', // ✅ Keep this as well
        ],
    };
};
