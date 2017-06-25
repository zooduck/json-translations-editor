const PATH = require("path");
const WEBPACK = require("webpack");
const HTML_WEBPACK_PLUGIN = require("html-webpack-plugin");
const EXTRACT_TEXT_PLUGIN = require("extract-text-webpack-plugin");

const GET_NODE_ENV = () => process.env.NODE_ENV.trim()

const EXTRACT_STYLESHEETS = new EXTRACT_TEXT_PLUGIN({
    filename: "[name].bundle.css",
    disable: GET_NODE_ENV() === "development"
});

const CONFIG = {
    entry: {
        "json-translations-editor": ["./src/index.js"]
    },
    output: {
        path: PATH.resolve(__dirname, "dist"),
        filename: "[name].bundle.js"
    },
    module: {
        rules: [
           // (see end of file)
        ]
    },
    stats: {
        colors: true
    },
    devtool: "source-map",
    devServer: {
        hot: true,
        contentBase: PATH.resolve(__dirname, "dist"),
        publicPath: "/"
    },
    plugins: [
        EXTRACT_STYLESHEETS,
        new WEBPACK.optimize.CommonsChunkPlugin({
            name: "dependencies",
            minChunks: function (module) {
              return module.context && module.context.indexOf("node_modules") !== -1;
            }
        }),
        new WEBPACK.HotModuleReplacementPlugin(),
        new WEBPACK.NamedModulesPlugin(),
        new HTML_WEBPACK_PLUGIN({
          template: "./src/templates/index.html"
        })
    ]
};

// =====================
// config.module.rules
// =====================

// templates
const TEMPLATES_RULE = {
    test: /\.(html|ejs)$/,
    include: PATH.resolve(__dirname, "src"),
    use: [{
        loader: "html-loader",
        options: {
            attrs: ["img:src", "a:href"]
        }
    }]
};

// scripts
const SCRIPTS_RULE = {
    test: /\.js$/,
    include: PATH.resolve(__dirname, "src"),
    use: [{
        loader: "babel-loader",
        options: {
            presets: [
                ["es2015", {modules: false}]
            ]
        }
    }]
};

// fonts
const FONTS_RULE = {
    test: /\.(woff|woff2|eot|otf|ttf|svg)$/,
    include: PATH.resolve(__dirname, "src/fonts"),
    loader: "file-loader",
    options: {
        name: "./fonts/[name].[ext]"
    }
};

// images
const IMAGES_RULE = {
    test: /\.(png|jpe?g|gif|svg)$/,
    include: PATH.resolve(__dirname, "src/img"),
    loader: "file-loader",
    options: {
        name: "./img/[hash].[ext]"
    }
    // options: {
    //     name: "./img/[name].[ext]"
    // }
};

// styles (SASS)
const SCSS_RULE_PROD = { // styles extracted to .css file
    test: /\.scss$/,
    use: EXTRACT_STYLESHEETS.extract({
        fallback: "style-loader",
        use: [
            {
                loader: "css-loader",
                options: { importLoaders: 1 }
            },
            "postcss-loader",
            "sass-loader"
        ]
    })
};

const SCSS_RULE_DEV = { // styles stored in JS
    test: /\.scss$/,
    use: ["style-loader", "css-loader", "postcss-loader", "sass-loader"]
};

CONFIG.module.rules.push(TEMPLATES_RULE, SCRIPTS_RULE, FONTS_RULE, IMAGES_RULE);

if (GET_NODE_ENV() === "production") {
    // production
    CONFIG.module.rules.push(SCSS_RULE_PROD);
    CONFIG.plugins.push(new WEBPACK.optimize.UglifyJsPlugin()); // minify
} else {
    // development
    CONFIG.module.rules.push(SCSS_RULE_DEV);
}

module.exports = CONFIG;
