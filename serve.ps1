# Servidor local do site ForjaDev. Uso: powershell -NoProfile -File serve.ps1 [-Porta 5173]
param([int]$Porta = 5173)

$raiz = [IO.Path]::GetFullPath($PSScriptRoot)
$tipos = @{
  '.html' = 'text/html; charset=utf-8'; '.css' = 'text/css; charset=utf-8'; '.js' = 'text/javascript; charset=utf-8'
  '.svg' = 'image/svg+xml'; '.png' = 'image/png'; '.jpg' = 'image/jpeg'; '.jpeg' = 'image/jpeg'
  '.ico' = 'image/x-icon'; '.json' = 'application/json; charset=utf-8'; '.webmanifest' = 'application/manifest+json'
}

$ouvinte = [System.Net.HttpListener]::new()
$ouvinte.Prefixes.Add("http://localhost:$Porta/")
$ouvinte.Start()
Write-Host "ForjaDev no ar em http://localhost:$Porta/  (Ctrl+C para parar)"

try {
  while ($ouvinte.IsListening) {
    $ctx = $ouvinte.GetContext()
    try {
    $rel = [Uri]::UnescapeDataString($ctx.Request.Url.AbsolutePath.TrimStart('/'))
    if ([string]::IsNullOrEmpty($rel) -or $rel.EndsWith('/')) { $rel = $rel + 'index.html' }
    $arquivo = [IO.Path]::GetFullPath((Join-Path $raiz $rel))
    $resp = $ctx.Response
    $resp.Headers.Add('Cache-Control', 'no-store')
    if (-not $arquivo.StartsWith($raiz) -or -not (Test-Path -LiteralPath $arquivo -PathType Leaf)) {
      $resp.StatusCode = 404
      $bytes = [Text.Encoding]::UTF8.GetBytes('404')
    } else {
      $bytes = [IO.File]::ReadAllBytes($arquivo)
      $ext = [IO.Path]::GetExtension($arquivo).ToLower()
      $resp.ContentType = if ($tipos.ContainsKey($ext)) { $tipos[$ext] } else { 'application/octet-stream' }
    }
    $resp.ContentLength64 = $bytes.Length
    if ($ctx.Request.HttpMethod -ne 'HEAD') { $resp.OutputStream.Write($bytes, 0, $bytes.Length) }
    $resp.Close()
    } catch {
      Write-Host "Falha em $($ctx.Request.Url): $($_.Exception.Message)"
      try { $ctx.Response.Abort() } catch {}
    }
  }
} finally {
  $ouvinte.Stop()
}
