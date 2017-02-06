import babel from 'rollup-plugin-babel';
import eslint from 'rollup-plugin-eslint';

import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

import replace from 'rollup-plugin-replace';
import uglify from 'rollup-plugin-uglify';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import progress from 'rollup-plugin-progress';

export default {
  entry: 'src/scripts/main.js',
  dest: 'build/js/build.min.js',
  format: 'iife',
  sourceMap: 'inline',
  plugins: [
  	nodeResolve({
      jsnext: true,
      main: true,
      browser: true,
    }),
    commonjs(),
    eslint({
      exclude: [
        'src/styles/**',
      ]
    }),
    babel({
      exclude: 'node_modules/**',
    }),
    replace({
      exclude: 'node_modules/**',
      ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
    }),
    (process.env.NODE_ENV === 'production' && uglify()),
    (process.env.NODE_ENV !== 'production' && serve({
    	contentBase: 'build',
    	historyApiFallback: false,
    	host: 'localhost',
    	port: 4001
    })),
    (process.env.NODE_ENV !== 'production' && livereload()),
    progress({
      clearLine: false // default: true
    }),
  ],
};
