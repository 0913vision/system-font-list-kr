/**
 * @author Mideum_
 */

'use strict'

module.exports = function (fonts, options) {
  fonts = fonts.map(font => {
    let name = font.name;

    // 유니코드 처리
    try {
      name = name.replace(/\\u([\da-f]{4})/ig, (m, s) => String.fromCharCode(parseInt(s, 16)))
    } catch (e) {
      console.log(e)
    }

    // disableQuoting 옵션 처리
    if (options && options.disableQuoting) {
      if (name.startsWith('"') && name.endsWith('"')) {
        name = `${name.substr(1, name.length - 2)}`
      }
    } else if (name.match(/[\s()+]/) && !name.startsWith('"')) {
      name = `"${name}"`
    }

    // 변경된 name을 적용한 새로운 객체 반환
    return {
      ...font,
      name
    }
  })

  return fonts
}