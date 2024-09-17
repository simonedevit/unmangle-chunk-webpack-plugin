# UnmangleChunkWebpackPlugin

`UnmangleChunkWebpackPlugin` is a custom Webpack plugin designed to handle specific chunk isolation and customized minification using `terser-webpack-plugin`. This plugin allows you to configure a particular chunk to be minified but not mangled, while other chunks can still undergo full minification (including mangling) using custom minification options.

## Features

- **Chunk Isolation**: Isolates a specific chunk, identified by name or matching a module regular expression, to be treated separately in terms of optimization and minification.
- **Custom Minification Rules**: Applies different `TerserPlugin` rules for the isolated chunk, ensuring that it is minified but without mangling its code.
- **Flexible Optimization**: Enables full control over how specific chunks are optimized, allowing you to pass additional minification options for other chunks as well.

## Use Case

This plugin is particularly useful when you are working with large bundles and need to exclude certain chunks from mangling, such as external libraries or critical parts of your application where preserving variable/function names is crucial for debugging or interoperability.

## Installation

You can install the plugin by adding it to your project:

```npm
npm install unmangle-chunk-webpack-plugin terser-webpack-plugin --save-dev
```

## Usage
To use the plugin, you can include it in your Webpack configuration. Here is a basic example of how to configure it:

```ts
import { Configuration } from 'webpack';
import UnmangleChunkWebpackPlugin from 'unmangle-chunk-webpack-plugin';

const config = (): Configuration => {
    return {
        // ...
        plugins: [
            // ...other plugins,
            new UnmangleChunkWebpackPlugin({
                name: 'some-library-unmangled',
                modulesRegEx: /node_modules\/some-library/
            }),
        ],
    };
};

export default config;
```

## Parameters
- <b>chunk</b> (required): An object defining the chunk to be isolated and customized. It contains the following properties:

    - <b>name</b>: A string representing the name of the chunk.
    - <b>modulesRegEx</b>: A regular expression to identify the modules belonging to the chunk.
    - <b>minifyOptions</b>: Custom minification options for the isolated chunk, passed to TerserPlugin.
- <b>otherMinifyOptions</b> (optional): An array of additional minification options to be applied to other chunks in the bundle. These options are also passed to TerserPlugin.

## License
This plugin is distributed under the MIT License. 