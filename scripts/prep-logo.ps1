$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

# Knock white out to transparent, trim to the ink, and scale to a target height.
# Same treatment the existing three press logos got, so the strip stays consistent.
$src = $args[0]; $dst = $args[1]; $targetH = [int]$args[2]
$thresh = 236

$orig = New-Object System.Drawing.Bitmap $src
$w = $orig.Width; $h = $orig.Height
$bmp = New-Object System.Drawing.Bitmap $w, $h, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.DrawImage($orig, 0, 0, $w, $h)
$g.Dispose(); $orig.Dispose()

$minX = $w; $minY = $h; $maxX = -1; $maxY = -1
$cleared = 0
for ($y = 0; $y -lt $h; $y++) {
  for ($x = 0; $x -lt $w; $x++) {
    $c = $bmp.GetPixel($x, $y)
    if ($c.A -lt 12) { continue }
    if ($c.R -ge $thresh -and $c.G -ge $thresh -and $c.B -ge $thresh) {
      $bmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0,255,255,255))
      $cleared++
      continue
    }
    if ($x -lt $minX) { $minX = $x }
    if ($x -gt $maxX) { $maxX = $x }
    if ($y -lt $minY) { $minY = $y }
    if ($y -gt $maxY) { $maxY = $y }
  }
}
if ($maxX -lt 0) { throw "no ink found in $src" }

$cw = $maxX - $minX + 1
$ch = $maxY - $minY + 1
$scale = $targetH / $ch
$ow = [int][Math]::Round($cw * $scale)
$oh = $targetH

$out = New-Object System.Drawing.Bitmap $ow, $oh, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g2 = [System.Drawing.Graphics]::FromImage($out)
$g2.InterpolationMode='HighQualityBicubic'; $g2.SmoothingMode='HighQuality'
$g2.PixelOffsetMode='HighQuality'; $g2.CompositingQuality='HighQuality'
$g2.CompositingMode = [System.Drawing.Drawing2D.CompositingMode]::SourceCopy
$g2.DrawImage($bmp, (New-Object System.Drawing.Rectangle 0,0,$ow,$oh), $minX, $minY, $cw, $ch, [System.Drawing.GraphicsUnit]::Pixel)
$g2.Dispose(); $bmp.Dispose()
$out.Save($dst, [System.Drawing.Imaging.ImageFormat]::Png)
$out.Dispose()

Write-Host ("{0,-22} {1}x{2} -> trimmed {3}x{4} -> {5}x{6}  ({7:N0} white px cleared)  {8:N0} bytes" -f `
  (Split-Path $src -Leaf), $w, $h, $cw, $ch, $ow, $oh, $cleared, (Get-Item $dst).Length)
