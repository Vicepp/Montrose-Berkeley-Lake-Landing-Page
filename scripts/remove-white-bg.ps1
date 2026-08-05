$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

$src = $args[0]
$dst = $args[1]
$thresh = 232   # treat >= this on all channels as background white

$orig = New-Object System.Drawing.Bitmap $src
$w = $orig.Width; $h = $orig.Height

# normalise to 32bpp ARGB so we can write alpha
$bmp = New-Object System.Drawing.Bitmap $w, $h, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.DrawImage($orig, 0, 0, $w, $h)
$g.Dispose(); $orig.Dispose()

# read all pixels into a flat array
$px = New-Object 'int[]' ($w * $h)
for ($y = 0; $y -lt $h; $y++) {
  for ($x = 0; $x -lt $w; $x++) {
    $px[$y * $w + $x] = $bmp.GetPixel($x, $y).ToArgb()
  }
}

$isWhite = {
  param($argb)
  $r = ($argb -shr 16) -band 0xFF
  $gg = ($argb -shr 8) -band 0xFF
  $b = $argb -band 0xFF
  ($r -ge $thresh) -and ($gg -ge $thresh) -and ($b -ge $thresh)
}

# BFS from every border pixel — only background-connected white is removed,
# so white *inside* the mark (the "S") is left alone.
$visited = New-Object 'bool[]' ($w * $h)
$queue = New-Object System.Collections.Generic.Queue[int]

$lastY = $h - 1
$lastX = $w - 1
$topBottom = @(0, $lastY)
$leftRight = @(0, $lastX)

for ($x = 0; $x -lt $w; $x++) {
  foreach ($y in $topBottom) {
    $i = $y * $w + $x
    if (-not $visited[$i] -and (& $isWhite $px[$i])) { $visited[$i] = $true; $queue.Enqueue($i) }
  }
}
for ($y = 0; $y -lt $h; $y++) {
  foreach ($x in $leftRight) {
    $i = $y * $w + $x
    if (-not $visited[$i] -and (& $isWhite $px[$i])) { $visited[$i] = $true; $queue.Enqueue($i) }
  }
}

$neighbours = New-Object 'System.Collections.Generic.List[int[]]'
$neighbours.Add(@(1,0)); $neighbours.Add(@(-1,0)); $neighbours.Add(@(0,1)); $neighbours.Add(@(0,-1))

while ($queue.Count -gt 0) {
  $i = $queue.Dequeue()
  $x = $i % $w; $y = [int][Math]::Floor($i / $w)
  foreach ($d in $neighbours) {
    $nx = $x + $d[0]; $ny = $y + $d[1]
    if ($nx -lt 0 -or $ny -lt 0 -or $nx -ge $w -or $ny -ge $h) { continue }
    $ni = $ny * $w + $nx
    if ($visited[$ni]) { continue }
    if (& $isWhite $px[$ni]) { $visited[$ni] = $true; $queue.Enqueue($ni) }
  }
}

$cleared = 0
for ($y = 0; $y -lt $h; $y++) {
  for ($x = 0; $x -lt $w; $x++) {
    $i = $y * $w + $x
    if ($visited[$i]) {
      $bmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 255, 255, 255))
      $cleared++
    }
  }
}

$bmp.Save($dst, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()

$pct = [math]::Round(100 * $cleared / ($w * $h), 1)
Write-Host ("{0}: {1}x{2}, cleared {3:N0} px ({4}% of image) -> {5}" -f (Split-Path $src -Leaf), $w, $h, $cleared, $pct, (Split-Path $dst -Leaf))
