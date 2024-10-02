/**
 * @author Mideum_
 */

'use strict'

module.exports = function (fonts, options) {
  fonts = fonts.map(font => {
    let family = font.family;

    // 유니코드 처리
    try {
      family = family.replace(/\\u([\da-f]{4})/ig, (m, s) => String.fromCharCode(parseInt(s, 16)))
    } catch (e) {
      console.log(e)
    }

    // disableQuoting 옵션 처리
    if (options && options.disableQuoting) {
      if (family.startsWith('"') && family.endsWith('"')) {
        family = `${family.substr(1, family.length - 2)}`
      }
    } else if (family.match(/[\s()+]/) && !family.startsWith('"')) {
      family = `"${family}"`
    }

    // 변경된 name을 적용한 새로운 객체 반환
    return {
      ...font,
      family
    }
  })

  return fonts
}