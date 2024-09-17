import TerserPlugin, { Compiler } from 'terser-webpack-plugin';

type TerserOptions =  ConstructorParameters<typeof TerserPlugin>[0];
type MinifyOptions = import("terser").MinifyOptions;

type Chunk = {
    name: string;
    modulesRegEx: RegExp;
    minifyOptions: TerserOptions;
};

class UnmangleChunkWebpackPlugin {

    private chunk: Chunk;
    private otherMinifyOptions: Array<TerserOptions>;

    constructor(chunk: Chunk, otherMinifyOptions: Array<TerserOptions>) {
        const { name, modulesRegEx, minifyOptions } = chunk;
        this.chunk = {
            name: name || 'unnamed-unmangled-chunk',
            modulesRegEx,
            minifyOptions
        };
        this.otherMinifyOptions = otherMinifyOptions || [];
    }

    apply(compiler: Compiler) {
        compiler.hooks.environment.tap('UnmangleChunkWebpackPlugin', () => {

            // isolate chunk
            if (!compiler.options.optimization) {
                compiler.options.optimization = {};
            }
            if (!compiler.options.optimization.splitChunks) {
                compiler.options.optimization.splitChunks = {};
            }
            if (!compiler.options.optimization.splitChunks.cacheGroups) {
                compiler.options.optimization.splitChunks.cacheGroups = {};
            }
            compiler.options.optimization.splitChunks.cacheGroups[this.chunk.name] = {
                test: this.chunk.modulesRegEx,
                name: this.chunk.name,
                chunks: 'all',
            }

            // modify TerserPlugin configuration
            compiler.options.optimization.minimizer = [

                // minify all but current chunk
                new TerserPlugin({
                    test: new RegExp(`^(?!.*${this.chunk.name}\\.js$).*.js$`)
                }),
                // minify current chunk but no mangle it
                new TerserPlugin<MinifyOptions>(this.chunk.minifyOptions || { 
                    test: `${this.chunk.name}.js`,
                    terserOptions: {
                        mangle: false
                    },
                }),
                ...this.otherMinifyOptions.map(minifyOptions => new TerserPlugin(minifyOptions))
            ]
        })
    }
}

export default UnmangleChunkWebpackPlugin;