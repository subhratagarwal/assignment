$base = "http://localhost:5000"
$sess = New-Object Microsoft.PowerShell.Commands.WebRequestSession

Write-Host "`n1) HEALTH"
Invoke-RestMethod -Method GET -Uri "$base/health" | ConvertTo-Json | Write-Host

Write-Host "`n2) LOGIN (demo@example.com / password123)"
$loginResp = Invoke-WebRequest -Method POST -Uri "$base/auth/login" `
  -Body (@{ email="demo@example.com"; password="password123" } | ConvertTo-Json) `
  -ContentType "application/json" -WebSession $sess -UseBasicParsing -ErrorAction Stop
$loginBody = $loginResp.Content | ConvertFrom-Json
$accessToken = $loginBody.accessToken
Write-Host " - Access token length:" ($accessToken.Length)
Write-Host " - User:" ($loginBody.user | ConvertTo-Json)

Write-Host "`n3) CREATE TASK"
$create = Invoke-WebRequest -Method POST -Uri "$base/tasks" `
  -Body (@{ title="Smoke: Create Task"; description="Created during smoke test" } | ConvertTo-Json) `
  -ContentType "application/json" -Headers @{ Authorization = "Bearer $accessToken" } -UseBasicParsing
Write-Host " - Create response:" ($create.Content)

Write-Host "`n4) LIST TASKS"
$list = Invoke-WebRequest -Method GET -Uri "$base/tasks?page=1&pageSize=10" `
  -Headers @{ Authorization = "Bearer $accessToken" } -UseBasicParsing
$listBody = $list.Content | ConvertFrom-Json
Write-Host " - Tasks returned:" ($listBody.tasks.Count)
Write-Host ($listBody | ConvertTo-Json)

Write-Host "`n5) REFRESH"
$refreshResp = Invoke-WebRequest -Method POST -Uri "$base/auth/refresh" -WebSession $sess -UseBasicParsing -ErrorAction SilentlyContinue
if ($refreshResp -and $refreshResp.Content) {
  $refBody = $refreshResp.Content | ConvertFrom-Json
  Write-Host " - Refresh response:" ($refBody | ConvertTo-Json)
  Write-Host " - New access token length:" ($refBody.accessToken.Length)
} else {
  Write-Host " - Refresh failed or returned no content."
}

Write-Host "`n6) LOGOUT"
$logout = Invoke-WebRequest -Method POST -Uri "$base/auth/logout" -WebSession $sess -UseBasicParsing -ErrorAction SilentlyContinue
if ($logout -and $logout.Content) { Write-Host " - Logout response:" (($logout.Content | ConvertFrom-Json) | ConvertTo-Json) } else { Write-Host " - Logout response empty or failed." }

Write-Host "`nSMOKE TEST COMPLETE"
