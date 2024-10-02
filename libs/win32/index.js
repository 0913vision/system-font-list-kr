/**
 * index.js
 * @author Mideum_
 */

'use strict'

const getByPowerShell = require('./getByPowerShell')
const os = require('os')

module.exports = async () => {
  if(parseInt(os.release())<10) {
    throw new Error('Error: system-font-list-kr can not run on this version of Windows.')
  }
  let fonts = []

  try {
    fonts = await getByPowerShell()
    console.log(Array.isArray(fonts), fonts.length)
    // console.log(fonts)
    if (fonts.length > 0) {
      return fonts
    }
  } catch (e) {
    console.log(e)
  }
}