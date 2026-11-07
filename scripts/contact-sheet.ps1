param(
  [Parameter(Mandatory=$true)][string]$InDir,
  [Parameter(Mandatory=$true)][string]$OutFile,
  [string]$Filter = "*.png",
  [int]$ThumbWidth = 420,
  [int]$Columns = 3,
  [int]$Rows = 4
)
Add-Type -AssemblyName System.Drawing

$files = Get-ChildItem -Path $InDir -Filter $Filter | Sort-Object Name
$cellW = $ThumbWidth
$cellH = [int]($ThumbWidth * 0.625)
$labelH = 18
$sheetW = $cellW * $Columns
$sheetH = ($cellH + $labelH) * $Rows
$sheet = New-Object System.Drawing.Bitmap($sheetW, $sheetH)
$g = [System.Drawing.Graphics]::FromImage($sheet)
$g.Clear([System.Drawing.Color]::FromArgb(20,22,25))
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$font = New-Object System.Drawing.Font("Consolas", 8)
$brush = [System.Drawing.Brushes]::White
for ($i = 0; $i -lt $files.Count -and $i -lt ($Columns * $Rows); $i++) {
  $img = [System.Drawing.Image]::FromFile($files[$i].FullName)
  $col = $i % $Columns
  $row = [Math]::Floor($i / $Columns)
  $x = $col * $cellW
  $y = $row * ($cellH + $labelH)
  $ratio = [Math]::Min($cellW / $img.Width, $cellH / $img.Height)
  $w = [int]($img.Width * $ratio)
  $h = [int]($img.Height * $ratio)
  $g.DrawImage($img, $x, $y, $w, $h)
  $g.DrawString($files[$i].Name, $font, $brush, $x + 4, $y + $cellH + 2)
  $img.Dispose()
}
$g.Dispose()
$sheet.Save($OutFile, [System.Drawing.Imaging.ImageFormat]::Png)
$sheet.Dispose()
Write-Output $OutFile
