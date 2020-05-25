#!/bin/node

import chokidar from 'chokidar'
import DtsCreator from 'typed-css-modules'

chokidar.watch('src/**/*.css').on('all', (event, path) => {
  const creator = new DtsCreator.default()
  creator.create(path)
  .then(content => {
      console.log(`${event} -> ${path}: [${content.tokens}]`)
      content.writeFile()                  // writes this content to "src/style.css.d.ts"
    })
})
