# Simple API Test
Write-Host "Testing Login..." -ForegroundColor Cyan

$loginBody = '{"email":"gov@test.com","password":"password123"}'

try {
    $response = Invoke-RestMethod -Uri 'http://localhost:3001/auth/login' -Method POST -Headers @{'Content-Type'='application/json'} -Body $loginBody
    Write-Host "Login Success!" -ForegroundColor Green
    Write-Host "Token: $($response.token)"
} catch {
    Write-Host "Login Failed - trying registration first..." -ForegroundColor Yellow
    
    $regBody = '{"name":"Test User","email":"gov@test.com","password":"password123","department":"Public Works"}'
    try {
        $regResponse = Invoke-RestMethod -Uri 'http://localhost:3001/auth/register' -Method POST -Headers @{'Content-Type'='application/json'} -Body $regBody
        Write-Host "Registration Success!" -ForegroundColor Green
        
        # Try login again
        $response = Invoke-RestMethod -Uri 'http://localhost:3001/auth/login' -Method POST -Headers @{'Content-Type'='application/json'} -Body $loginBody
        Write-Host "Login Success!" -ForegroundColor Green
        Write-Host "Token: $($response.token)"
    } catch {
        Write-Host "Error: $_" -ForegroundColor Red
        exit 1
    }
}
