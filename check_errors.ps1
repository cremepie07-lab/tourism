$root = $PSScriptRoot
$frontend = Join-Path $root "frontend"
$backend = Join-Path $root "backend"

Write-Host "=== KIEM TRA FILE JS BI THIEU ===" -ForegroundColor Cyan

# Check JS references in HTML files
$htmlFiles = Get-ChildItem $frontend -Filter "*.html"
$allMissing = @()

foreach ($f in $htmlFiles) {
    $content = Get-Content $f.FullName -Raw
    $matches2 = [regex]::Matches($content, 'src="([^"]+\.js)"')
    foreach ($m in $matches2) {
        $js = $m.Groups[1].Value
        $path = Join-Path $frontend $js
        if (-not (Test-Path $path)) {
            $allMissing += "$($f.Name) -> $js"
            Write-Host "MISSING: $($f.Name) -> $js" -ForegroundColor Red
        }
    }
}

if ($allMissing.Count -eq 0) {
    Write-Host "Khong co file JS nao bi thieu!" -ForegroundColor Green
}

Write-Host ""
Write-Host "=== KIEM TRA CSS BI THIEU ===" -ForegroundColor Cyan

foreach ($f in $htmlFiles) {
    $content = Get-Content $f.FullName -Raw
    $matches2 = [regex]::Matches($content, 'href="([^"]+\.css)"')
    foreach ($m in $matches2) {
        $css = $m.Groups[1].Value
        if ($css -notlike "http*") {
            $path = Join-Path $frontend $css
            if (-not (Test-Path $path)) {
                Write-Host "MISSING CSS: $($f.Name) -> $css" -ForegroundColor Red
            }
        }
    }
}

Write-Host ""
Write-Host "=== KIEM TRA SERVER ===" -ForegroundColor Cyan

$port5000 = netstat -ano | findstr ":5000" | findstr "LISTENING"
if ($port5000) {
    Write-Host "Server dang chay tren port 5000" -ForegroundColor Green
} else {
    Write-Host "SERVER CHUA CHAY! Chay: node backend/server.js" -ForegroundColor Red
}

Write-Host ""
Write-Host "=== KIEM TRA API ===" -ForegroundColor Cyan

try {
    $res = Invoke-WebRequest -Uri "http://localhost:5000/api/tours" -UseBasicParsing -TimeoutSec 3
    Write-Host "API /api/tours: OK (status $($res.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host "API /api/tours: LOI - $($_.Exception.Message)" -ForegroundColor Red
}

try {
    $res = Invoke-WebRequest -Uri "http://localhost:5000/trang_chu.html" -UseBasicParsing -TimeoutSec 3
    Write-Host "Frontend trang_chu.html: OK (status $($res.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host "Frontend trang_chu.html: LOI - $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "=== DONE ===" -ForegroundColor Cyan
