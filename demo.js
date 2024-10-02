'use strict'

require('./index').getFonts()
  .then(fonts => {
    console.log(fonts)
  })
  .catch(err => {
    console.log(err)
  })