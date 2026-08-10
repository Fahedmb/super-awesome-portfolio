Add-Type -AssemblyName System.Drawing
$path = "c:\Users\fahed\Projects\super awesome portfolio\public\assets\scene_1\0001.webp"
$img = [System.Drawing.Image]::FromFile($path)
Write-Host "Width: $($img.Width), Height: $($img.Height)"
$img.Dispose()
