# UMC 7주차 Spring Boot API 전체 시나리오 검증 스크립트
$baseUrl = "http://localhost:8080"

function Invoke-ApiRequest {
    param(
        [string]$Uri,
        [string]$Method = "GET",
        [string]$Token = $null,
        [string]$Body = $null
    )
    $req = [System.Net.HttpWebRequest]::Create($Uri)
    $req.Method = $Method
    if ($Token) {
        $req.Headers.Add("Authorization", "Bearer $Token")
    }
    if ($Body) {
        $req.ContentType = "application/json"
        $bytes = [System.Text.Encoding]::UTF8.GetBytes($Body)
        $req.GetRequestStream().Write($bytes, 0, $bytes.Length)
    }

    try {
        $res = $req.GetResponse()
        $stream = $res.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($stream)
        $content = $reader.ReadToEnd()
        Write-Host " [HTTP $([int]$res.StatusCode)]" -ForegroundColor Green
        return $content | ConvertFrom-Json
    } catch [System.Net.WebException] {
        $stream = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($stream)
        $content = $reader.ReadToEnd()
        Write-Host " [HTTP $([int]$_.Exception.Response.StatusCode)]" -ForegroundColor Red
        return $content | ConvertFrom-Json
    }
}

Write-Host "`n=======================================================" -ForegroundColor Cyan
Write-Host "1. 회원가입: 회원 A (a@umc.com) & 회원 B (b@umc.com)" -ForegroundColor Yellow
Write-Host "=======================================================" -ForegroundColor Cyan
$aSignUp = Invoke-ApiRequest -Uri "$baseUrl/members" -Method "POST" -Body '{"email":"a@umc.com","password":"Password123!","nickname":"userA"}'
$bSignUp = Invoke-ApiRequest -Uri "$baseUrl/members" -Method "POST" -Body '{"email":"b@umc.com","password":"Password123!","nickname":"userB"}'
Write-Host "A 가입 결과: $($aSignUp.message)"
Write-Host "B 가입 결과: $($bSignUp.message)"

Write-Host "`n=======================================================" -ForegroundColor Cyan
Write-Host "2. 로그인: 회원 A & 회원 B 로그인 후 JWT 토큰 발급" -ForegroundColor Yellow
Write-Host "=======================================================" -ForegroundColor Cyan
$aLogin = Invoke-ApiRequest -Uri "$baseUrl/auth/login" -Method "POST" -Body '{"email":"a@umc.com","password":"Password123!"}'
$tokenA = $aLogin.result.accessToken
Write-Host "Token A (일부): $($tokenA.Substring(0, 30))..." -ForegroundColor Green

$bLogin = Invoke-ApiRequest -Uri "$baseUrl/auth/login" -Method "POST" -Body '{"email":"b@umc.com","password":"Password123!"}'
$tokenB = $bLogin.result.accessToken
Write-Host "Token B (일부): $($tokenB.Substring(0, 30))..." -ForegroundColor Green

Write-Host "`n=======================================================" -ForegroundColor Cyan
Write-Host "3. 내 정보 조회: GET /members/me (토큰 A 정상)" -ForegroundColor Yellow
Write-Host "=======================================================" -ForegroundColor Cyan
$me = Invoke-ApiRequest -Uri "$baseUrl/members/me" -Method "GET" -Token $tokenA
$me | ConvertTo-Json -Depth 5

Write-Host "`n=======================================================" -ForegroundColor Cyan
Write-Host "4. 토큰 없이 요청 (401 AUTH401_2 예상)" -ForegroundColor Yellow
Write-Host "=======================================================" -ForegroundColor Cyan
$noToken = Invoke-ApiRequest -Uri "$baseUrl/members/me" -Method "GET"
$noToken | ConvertTo-Json -Depth 5

Write-Host "`n=======================================================" -ForegroundColor Cyan
Write-Host "5. 위조된 서명 토큰 요청 (401 AUTH401_3 예상)" -ForegroundColor Yellow
Write-Host "=======================================================" -ForegroundColor Cyan
$tamperedToken = $tokenA.Substring(0, 20) + "X" + $tokenA.Substring(21)
$invalidToken = Invoke-ApiRequest -Uri "$baseUrl/members/me" -Method "GET" -Token $tamperedToken
$invalidToken | ConvertTo-Json -Depth 5

Write-Host "`n=======================================================" -ForegroundColor Cyan
Write-Host "6. 평점 등록: POST /ratings (토큰 A로 영화 100번에 평점 등록, 201 Created)" -ForegroundColor Yellow
Write-Host "=======================================================" -ForegroundColor Cyan
$ratingCreate = Invoke-ApiRequest -Uri "$baseUrl/ratings" -Method "POST" -Token $tokenA -Body '{"movieId":100,"score":5,"comment":"인생 영화입니다!"}'
$ratingCreate | ConvertTo-Json -Depth 5
$ratingId = $ratingCreate.result.ratingId

Write-Host "`n=======================================================" -ForegroundColor Cyan
Write-Host "7. 중복 평점 등록 시도 (409 RATING409_1 예상)" -ForegroundColor Yellow
Write-Host "=======================================================" -ForegroundColor Cyan
$duplicateRating = Invoke-ApiRequest -Uri "$baseUrl/ratings" -Method "POST" -Token $tokenA -Body '{"movieId":100,"score":4,"comment":"다시 등록 시도"}'
$duplicateRating | ConvertTo-Json -Depth 5

Write-Host "`n=======================================================" -ForegroundColor Cyan
Write-Host "8. 본인 평점 수정: PATCH /ratings/$ratingId (토큰 A, 200 OK)" -ForegroundColor Yellow
Write-Host "=======================================================" -ForegroundColor Cyan
$updateMyRating = Invoke-ApiRequest -Uri "$baseUrl/ratings/$ratingId" -Method "PATCH" -Token $tokenA -Body '{"score":4,"comment":"다시 보니 4점입니다."}'
$updateMyRating | ConvertTo-Json -Depth 5

Write-Host "`n=======================================================" -ForegroundColor Cyan
Write-Host "9. [중요] 남의 평점 수정 시도: PATCH /ratings/$ratingId (토큰 B, 403 RATING403_1 예상)" -ForegroundColor Yellow
Write-Host "=======================================================" -ForegroundColor Cyan
$updateOtherRating = Invoke-ApiRequest -Uri "$baseUrl/ratings/$ratingId" -Method "PATCH" -Token $tokenB -Body '{"score":1,"comment":"남의 평점 건드리기"}'
$updateOtherRating | ConvertTo-Json -Depth 5

Write-Host "`n=======================================================" -ForegroundColor Cyan
Write-Host "10. 없는 평점 삭제 시도 (404 RATING404_1 예상)" -ForegroundColor Yellow
Write-Host "=======================================================" -ForegroundColor Cyan
$deleteNotFound = Invoke-ApiRequest -Uri "$baseUrl/ratings/99999" -Method "DELETE" -Token $tokenA
$deleteNotFound | ConvertTo-Json -Depth 5

Write-Host "`n=======================================================" -ForegroundColor Cyan
Write-Host "11. 본인 평점 삭제: DELETE /ratings/$ratingId (토큰 A, 200 OK)" -ForegroundColor Yellow
Write-Host "=======================================================" -ForegroundColor Cyan
$deleteMyRating = Invoke-ApiRequest -Uri "$baseUrl/ratings/$ratingId" -Method "DELETE" -Token $tokenA
$deleteMyRating | ConvertTo-Json -Depth 5

Write-Host "`n=======================================================" -ForegroundColor Green
Write-Host "🎉 모든 7주차 API 시나리오 테스트 검증이 완료되었습니다!" -ForegroundColor Green
Write-Host "=======================================================" -ForegroundColor Green
