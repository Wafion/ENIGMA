param([string]$InDir,[string]$OutFile,[string[]]$Names,[int]$ThumbWidth=620,[int]$Columns=2)
Add-Type -AssemblyName System.Drawing
$files = $Names | ForEach-Object { Get-Item (Join-Path $InDir $_) }
$cellW=$ThumbWidth; $cellH=[int]($ThumbWidth*0.625); $labelH=20
$rows=[Math]::Ceiling($files.Count/$Columns)
$sheet=New-Object System.Drawing.Bitmap(($cellW*$Columns),(($cellH+$labelH)*$rows))
$g=[System.Drawing.Graphics]::FromImage($sheet); $g.Clear([System.Drawing.Color]::FromArgb(18,18,18))
$g.InterpolationMode=[System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$font=New-Object System.Drawing.Font("Consolas",10); $brush=[System.Drawing.Brushes]::White
for($i=0;$i -lt $files.Count;$i++){
 $img=[System.Drawing.Image]::FromFile($files[$i].FullName)
 $col=$i%$Columns; $row=[Math]::Floor($i/$Columns); $x=$col*$cellW; $y=$row*($cellH+$labelH)
 $ratio=[Math]::Min($cellW/$img.Width,$cellH/$img.Height); $w=[int]($img.Width*$ratio); $h=[int]($img.Height*$ratio)
 $g.DrawImage($img,$x,$y,$w,$h); $g.DrawString($files[$i].Name,$font,$brush,($x+5),($y+$cellH+3)); $img.Dispose()
}
$g.Dispose(); $sheet.Save($OutFile,[System.Drawing.Imaging.ImageFormat]::Png); $sheet.Dispose()
