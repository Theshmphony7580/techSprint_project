# Test Login and Project Creation
Write-Host "Testing Login with existing user..." -ForegroundColor Cyan

$loginBody = '{"email":"gov@test.com","password":"password123"}'

try {
    $loginResponse = Invoke-RestMethod -Uri 'http://localhost:3001/auth/login' -Method POST -Headers @{'Content-Type'='application/json'} -Body $loginBody
    Write-Host "Login Success!" -ForegroundColor Green
    $token = $loginResponse.token
    Write-Host "Token received: $($token.Substring(0,30))..." -ForegroundColor Gray
    
    # Now test project creation
    Write-Host "`nTesting Project Creation..." -ForegroundColor Cyan
    $projectBody = '{"projectName":"Highway Expansion Project","department":"Public Works","budget":5000000,"location":{"district":"Mumbai","state":"Maharashtra"}}'
    
    try {
        $projectResponse = Invoke-RestMethod -Uri 'http://localhost:3001/projects' -Method POST -Headers @{'Content-Type'='application/json';'Authorization'="Bearer $token"} -Body $projectBody
        Write-Host "Project Created Successfully!" -ForegroundColor Green
        Write-Host "Project ID: $($projectResponse.project.id)" -ForegroundColor Gray
        Write-Host "Project Name: $($projectResponse.project.projectName)" -ForegroundColor Gray
        Write-Host "`nSUCCESS: All tests passed!" -ForegroundColor Green
    } catch {
        Write-Host "Project Creation Failed!" -ForegroundColor Red
        Write-Host "Error: $_" -ForegroundColor Red
    }
} catch {
    Write-Host "Login Failed!" -ForegroundColor Red
    Write-Host "Error: $_" -ForegroundColor Red
    Write-Host "`nNote: The existing user was created before the fix." -ForegroundColor Yellow
    Write-Host "We need to update the existing user's verified status in the database." -ForegroundColor Yellow
}
