/**
 * getByPowerShell
 * @author: Mideum_
 */
const fs = require('fs')
const exec = require('child_process').exec

const parse = (str) => {
  return str
    .split('\n')
    .map(ln => ln.trim())
    .filter(f => !!f)
    .map(ln => {
      try {
        // JSON.parse 결과가 배열이면, 바로 반환
        const parsed = JSON.parse(ln);
        return Array.isArray(parsed) ? parsed : [parsed];
      } catch (e) {
        console.error("Parsing error:", e);
        return null;
      }
    })
    .filter(f => f) // null 값 제거
    .flat(); // 중첩 배열을 평탄화
}

module.exports = () => new Promise((resolve, reject) => {
  const psScript = `
  chcp 65001 | Out-Null
  Add-Type -AssemblyName PresentationCore
  $families = [Windows.Media.Fonts]::SystemFontFamilies
  $results = @()
  foreach ($family in $families) {
    $name = ''
    if (-not $family.FamilyNames.TryGetValue([Windows.Markup.XmlLanguage]::GetLanguage('ko-kr'), [ref]$name)) {
      $name = $family.FamilyNames[[Windows.Markup.XmlLanguage]::GetLanguage('en-us')]
    }
    $weights = @()
    foreach ($typeface in $family.FamilyTypefaces) {
      $weightValue = $typeface.Weight.ToOpenTypeWeight()
      $weights += $weightValue
    }
    $fontInfo = @{
      family = $name
      weights = $weights
    }
    $results += $fontInfo
  }
  $jsonOutput = ConvertTo-Json -InputObject $results -Compress
  Write-Output $jsonOutput
  `
  const tempScriptPath = 'temp_font_script.ps1';
  fs.writeFileSync(tempScriptPath, psScript);
  
  const cmd = `chcp 65001 | powershell -NoProfile -ExecutionPolicy Bypass -File "${tempScriptPath}"`;

  exec(cmd, { maxBuffer: 1024 * 1024 * 10 }, (err, stdout, stderr) => {
    fs.unlinkSync(tempScriptPath);
    if (err) {
      reject(err)
      return
    }

    if (stderr) {
      console.error("PowerShell Error:", stderr)
      reject(new Error(stderr))
      return
    }

    if (!stdout) {
      console.warn("No output received from PowerShell.")
      reject(new Error("No output received from PowerShell."))
      return
    }

    resolve(parse(stdout))
  })
})