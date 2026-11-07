param([string]$Root = "docs\research\screens")
Add-Type -AssemblyName System.Drawing
$dirs = Get-ChildItem -Path $Root -Directory
foreach ($dir in $dirs) {
  $files = Get-ChildItem -Path $dir.FullName -Filter *.png | Where-Object { $_.Name -notlike 'contact*' } | Sort-Object Name
  if ($files.Count -eq 0) { continue }
  $cols = [Math]::Min(3, $files.Count)
  $rows = [Math]::Ceiling($files.Count / 3)
  $tw = 480
  $ch = [int]($tw * 0.625)
  $lh = 20
  $sheet = New-Object System.Drawing.Bitmap(($tw * $cols), (($ch + $lh) * $rows))
  $g = [System.Drawing.Graphics]::FromImage($sheet)
  $g.Clear([System.Drawing.Color]::FromArgb(12,13,15))
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $font = New-Object System.Drawing.Font("Consolas", 8)
  for ($i = 0; $i -lt $files.Count; $i++) {
    $img = [System.Drawing.Image]::FromFile($files[$i].FullName)
    $col = $i % 3; $row = [Math]::Floor($i / 3)
    $x = $col * $tw; $y = $row * ($ch + $lh)
    $g.DrawImage($img, $x, $y, $tw, $ch)
    $g.DrawString($files[$i].Name, $font, [System.Drawing.Brushes]::White, $x + 4, $y + $ch + 3)
    $img.Dispose()
  }
  $g.Dispose()
  $out = Join-Path $dir.FullName "contact.png"
  $sheet.Save($out, [System.Drawing.Imaging.ImageFormat]::Png)
  $sheet.Dispose()
  Write-Output $out
}
