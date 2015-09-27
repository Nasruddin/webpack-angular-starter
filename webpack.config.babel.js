import path from 'path';
import webpack from 'webpack'


module.exports = function(option){

    const entryPoint = {
        app: ["./index.js"],
        vendors: ['jquery']
    };

    const root = path.join(__dirname, '/app');
    const alias = {};
    const aliasLoader = {};
    const externals = [];
    const exclude = /node_modules[\\\/]angular[\\\/]/

    const outputDir = {
        path: path.resolve(__dirname + '/app'),
        filename: 'bundle.js'
    };

    const featureFlagPlugin = new webpack.DefinePlugin({
        __DEV__: JSON.stringify(JSON.parse(process.env.BUILD_DEV || 'true')),
        __PRERELEASE__: JSON.stringify(JSON.parse(process.env.BUILD_PRERELEASE || 'false'))
    });

    const uglifyJsPlugin = new webpack.optimize.UglifyJsPlugin({
        compress: {
            warnings: false
        }
    });

    const providePlugin = new webpack.ProvidePlugin({
        $: "jquery"
    });

    const commonsChunkPlugin = new webpack.optimize.CommonsChunkPlugin(
        'vendors', 'vendors.js', 'Infinity'
    );

    const noErrorsPlugin = new webpack.NoErrorsPlugin();

    const moduleDirectories = ['web_modules', 'node_modules'];

    const extensions = ['', '.js'];

    return {
        context: path.resolve(__dirname + '/app'),
        target: 'web',
        entry: entryPoint,
        output: outputDir,
        module: {

            preLoaders: [ ],

            loaders: [
                {
                    test: /\.js$/,
                    loader: 'ng-annotate-loader!babel-loader', //ng-annotate-loader for angular 1.3 dev injection
                    exclude: /node_modules/
                },
                {
                    test: /\.html$/,
                    loader: 'raw-loader',
                    exclude: /node_modules/
                },
                {
                    test: /\.css$/,
                    loader: 'style-loader!css-loader?-minimize!autoprefixer-loader?browsers=last 2 version'
                }
            ]
        },

        postLoaders: [ ],

        plugins: [
            featureFlagPlugin, uglifyJsPlugin, providePlugin, commonsChunkPlugin, noErrorsPlugin
        ],

        devtool: 'source-map',
        resolveLoader: {
            root: path.resolve(__dirname, 'node_modules'),
            alias: aliasLoader
        },
        externals: externals,
        resolve: {
            root: root,
            modulesDirectories: moduleDirectories,
            extensions: extensions,
            alias: alias
        },

        devServer: {
            stats: {
                cached: false,
                exclude: exclude
            }
        }
    }
}();