module.exports = api => {
    api.cache(false);

    return {
        presets: ["@babel/preset-env", "@babel/preset-react"],
        // presets: [
        //     ['@babel/preset-env',
        //         {
        //             useBuiltIns: 'usage',
        //             corejs: {
        //                 version: '3.8',
        //                 proposals: true
        //             },
        //             modules: 'cjs'
        //         }
        //     ],
        //     '@babel/preset-react'
        // ],
        plugins: []
    }
};
