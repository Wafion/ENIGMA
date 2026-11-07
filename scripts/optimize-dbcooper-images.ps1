Add-Type -AssemblyName System.Drawing
$root = Join-Path $PSScriptRoot "..\public\assets\db-cooper"
$out = Join-Path $root "opt"
New-Item -ItemType Directory -Force -Path $out | Out-Null

$files = @(
  @{ In = "images\cooper-vane-727.jpg"; Base = "cooper-vane-727" },
  @{ In = "images\lake-merwin-aerial.jpg"; Base = "lake-merwin-aerial" },
  @{ In = "fbi\fbi-plane-ticket-1971.jpg"; Base = "fbi-plane-ticket-1971" },
  @{ In = "fbi\flight-305-crew-cabin-1971.jpg"; Base = "flight-305-crew-cabin-1971" },
  @{ In = "images\boeing-727-51-n838n.jpg"; Base = "boeing-727-51-n838n" },
  @{ In = "fbi\fbi-tina-bar-money-1980.jpg"; Base = "fbi-tina-bar-money-1980" }
)

$codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
$encParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
$encParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [long]82)

foreach ($f in $files) {
  $srcPath = Join-Path $root $f.In
  if (!(Test-Path $srcPath)) { continue }
  $img = [System.Drawing.Image]::FromFile($srcPath)
  foreach ($w in @(1600, 900)) {
    if ($img.Width -le $w) { continue }
    $h = [int][Math]::Round($img.Height * ($w / $img.Width))
    $bmp = New-Object System.Drawing.Bitmap($w, $h)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.DrawImage($img, 0, 0, $w, $h)
    $g.Dispose()
    $dest = Join-Path $out "$($f.Base)-$w.jpg"
    $bmp.Save($dest, $codec, $encParams)
    $bmp.Dispose()
  }
  $img.Dispose()
}
Get-ChildItem $out | Select-Object Name, @{N='KB';E={[math]::Round($_.Length/1KB)}} | Format-Table -AutoSize
