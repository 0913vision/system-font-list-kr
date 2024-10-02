/**
 * @editor Mideum_
 */

'use strict'

const standardize = require('./libs/standardize')
const platform = process.platform
const LIBRARY_NAME = 'system-font-list-kr'

let getFontsFunc;
switch (platform) {
  case 'win32':
    getFontsFunc = require('./libs/win32')
    break
  default:
    throw new Error(`Error: ${LIBRARY_NAME} can not run on ${platform}.`)
}

const defaultOptions = {
  disableQuoting: false
}

exports.getFonts = async (options) => {
  options = Object.assign({}, defaultOptions, options)

  let fonts = await getFontsFunc()
  fonts = standardize(fonts, options)

  // 폰트 이름을 기준으로 정렬 (name 필드 사용)
  fonts.sort((a, b) => {
    return a.name.replace(/^['"]+/, '').toLocaleLowerCase() < b.name.replace(/^['"]+/, '').toLocaleLowerCase() ? -1 : 1
  })

  return fonts
}