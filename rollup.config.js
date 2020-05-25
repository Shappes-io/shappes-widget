import typescript from 'rollup-plugin-typescript2'
import minify from 'rollup-plugin-babel-minify'
import postcss from 'rollup-plugin-postcss-modules'
import fs from 'fs'
import glob from 'glob'

/* initialize CSS files because of a catch-22 situation:
https://github.com/rollup/rollup/issues/1404 */
glob.sync('src/**/*.css').forEach((css) => {  // Use forEach because https://github.com/rollup/rollup/issues/1873
  const definition = `${css}.d.ts`
  // if (!fs.existsSync(definition))
  fs.writeFileSync(definition, 'const mod: { [cls: string]: string }\nexport default mod\n')
})

const getConfig = ({ output, isMinify, extract = false }) => {
  return {
    input: 'src/index.ts',
    output: {
      file: output,
      format: 'esm',
      sourcemap: true
    },
    plugins: [
      postcss({
        extract: extract, // 'lib/bundle.css'
        writeDefinitions: true,
      }),
      typescript(),
      ...(isMinify ? [
        minify({
          comments: false
        })
      ] : [])
    ]
  }
}

export default [
  getConfig({ output: 'lib/index.js', extract: 'lib/bundle.css' }),
  getConfig({ output: 'lib/index.mjs' }),
  getConfig({ output: 'lib/index.min.mjs', isMinify: true })
]
