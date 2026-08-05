$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

# Makes EVERY near-white pixel transparent (not just edge-connected ones).
# For the SoMeDocs mark this knocks the white "S" out of the olive tile, so a
# brightness(0) invert(1) silhouette shows the S as a hole rather than losing it.
$src = $args[0]; $dst = $args[1]
$thresh = 228

$orig = New-Object System.Drawing.Bitmap $src
$w = $orig.Width; $h = $orig.Height
$bmp = New-Object System.Drawing.Bitmap $w, $h, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.DrawImage($orig, 0, 0, $w, $h)
$g.Dispose(); $orig.Dispose()

$cleared = 0
for ($y = 0; $y -lt $h; $y++) {
  for ($x = 0; $x -lt $w; $x++) {
    $c = $bmp.GetPixel($x, $y)
    if ($c.A -eq 0) { continue }
    if ($c.R -ge $thresh -and $c.G -ge $thresh -and $c.B -ge $thresh) {
      $bmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 255, 255, 255))
      $cleared++
    }
  }
}

$bmp.Save($dst, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()
Write-Host ("{0}: knocked out {1:N0} white px -> {2}" -f (Split-Path $src -Leaf), $cleared, (Split-Path $dst -Leaf))
