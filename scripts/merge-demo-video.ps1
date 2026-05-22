# Merge Playwright videos into final demo MP4 with optional captions
# Requires ffmpeg: https://ffmpeg.org/download.html

$ErrorActionPreference = "Stop"
$outDir = Join-Path $PSScriptRoot "..\dist\demo"
$videoDir = Join-Path $outDir "videos"
New-Item -ItemType Directory -Force -Path $outDir | Out-Null

$videos = Get-ChildItem -Path "test-results" -Recurse -Filter "video.webm" -ErrorAction SilentlyContinue
if (-not $videos) {
    Write-Host "No Playwright videos found. Run: pnpm demo:record"
    exit 1
}

$listFile = Join-Path $outDir "filelist.txt"
$videos | ForEach-Object { "file '$($_.FullName -replace '\\', '/')'" } | Set-Content $listFile

$output = Join-Path $outDir "marcelino-school-demo.mp4"
ffmpeg -y -f concat -safe 0 -i $listFile -c:v libx264 -preset fast -crf 23 -c:a aac $output

if ($LASTEXITCODE -eq 0) {
    Write-Host "Demo video created: $output"
} else {
    Write-Host "ffmpeg failed. Install ffmpeg and retry."
}
