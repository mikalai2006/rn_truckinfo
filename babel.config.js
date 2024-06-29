module.exports = {
    presets: ['module:metro-react-native-babel-preset'],
    plugins: [
        'nativewind/babel',
        // [
        //   'babel-plugin-inline-import',
        //   {
        //     extensions: ['.svg'],
        //   },
        // ],
        [
            'module-resolver',
            {
                root: ['./'],
                alias: {
                    /**
                     * Regular expression is used to match all files inside `./src` directory and map each `.src/folder/[..]` to `~folder/[..]` path
                     */
                    '^~(.+)': './src/\\1',
                    extensions: ['.ios.js', '.android.js', '.js', '.jsx', '.json', '.tsx', '.ts', '.native.js'],
                },
            },
        ],
        'module:react-native-dotenv',
        'react-native-reanimated/plugin',
    ],
};
