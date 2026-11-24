# UMC 8주차 Spring Boot API 전체 시나리오 검증 스크립트
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
        if ($_.Exception.Response) {
            $stream = $_.Exception.Response.GetResponseStream()
            $reader = New-Object System.IO.StreamReader($stream)
            $content = $reader.ReadToEnd()
            Write-Host " [HTTP $([int]$_.Exception.Response.StatusCode)]" -ForegroundColor Red
            return $content | ConvertFrom-Json
        } else {
            Write-Host " [ERROR: $($_.Exception.Message)]" -ForegroundColor Red
            return $null
        }
    }
}

Write-Host "`n=======================================================" -ForegroundColor Cyan
Write-Host "1. 회원가입 및 로그인 (회원 A)" -ForegroundColor Yellow
Write-Host "=======================================================" -ForegroundColor Cyan
$null = Invoke-ApiRequest -Uri "$baseUrl/members" -Method "POST" -Body '{"email":"week8_user@umc.com","password":"Password123!","nickname":"week8_user"}'
$login = Invoke-ApiRequest -Uri "$baseUrl/auth/login" -Method "POST" -Body '{"email":"week8_user@umc.com","password":"Password123!"}'
$token = $login.result.accessToken
Write-Host "토큰 발급 완료: $($token.Substring(0, 30))..." -ForegroundColor Green

Write-Host "`n=======================================================" -ForegroundColor Cyan
Write-Host "2. 인증 가드 검증: 토큰 없이 즐겨찾기 조회 -> 401 차단" -ForegroundColor Yellow
Write-Host "=======================================================" -ForegroundColor Cyan
$noTokenRes = Invoke-ApiRequest -Uri "$baseUrl/favorites" -Method "GET"
Write-Host "결과 code: $($noTokenRes.code), message: $($noTokenRes.message)"

Write-Host "`n=======================================================" -ForegroundColor Cyan
Write-Host "3. 즐겨찾기 등록: POST /favorites (movieId: 550) -> 201" -ForegroundColor Yellow
Write-Host "=======================================================" -ForegroundColor Cyan
$favRes = Invoke-ApiRequest -Uri "$baseUrl/favorites" -Method "POST" -Token $token -Body '{"movieId":550}'
Write-Host "결과 favoriteId: $($favRes.result.favoriteId), movieId: $($favRes.result.movieId)" -ForegroundColor Green

Write-Host "`n=======================================================" -ForegroundColor Cyan
Write-Host "4. 중복 즐겨찾기 검증: POST /favorites (movieId: 550) -> 409 FAVORITE409_1" -ForegroundColor Yellow
Write-Host "=======================================================" -ForegroundColor Cyan
$dupFavRes = Invoke-ApiRequest -Uri "$baseUrl/favorites" -Method "POST" -Token $token -Body '{"movieId":550}'
Write-Host "결과 code: $($dupFavRes.code), message: $($dupFavRes.message)" -ForegroundColor Red

Write-Host "`n=======================================================" -ForegroundColor Cyan
Write-Host "5. 내 즐겨찾기 목록 조회: GET /favorites -> 200 OK" -ForegroundColor Yellow
Write-Host "=======================================================" -ForegroundColor Cyan
$myFavList = Invoke-ApiRequest -Uri "$baseUrl/favorites" -Method "GET" -Token $token
Write-Host "등록된 즐겨찾기 개수: $($myFavList.result.Count)" -ForegroundColor Green

Write-Host "`n=======================================================" -ForegroundColor Cyan
Write-Host "6. 단건 즐겨찾기 여부 조회: GET /favorites/{movieId}" -ForegroundColor Yellow
Write-Host "=======================================================" -ForegroundColor Cyan
$status550 = Invoke-ApiRequest -Uri "$baseUrl/favorites/550" -Method "GET" -Token $token
Write-Host "550번 영화 즐겨찾기 여부: $($status550.result.isFavorite)" -ForegroundColor Green
$status999 = Invoke-ApiRequest -Uri "$baseUrl/favorites/999" -Method "GET" -Token $token
Write-Host "999번 영화 즐겨찾기 여부: $($status999.result.isFavorite)" -ForegroundColor Green

Write-Host "`n=======================================================" -ForegroundColor Cyan
Write-Host "7. 즐겨찾기 해제: DELETE /favorites/550 -> 200 OK" -ForegroundColor Yellow
Write-Host "=======================================================" -ForegroundColor Cyan
$delRes = Invoke-ApiRequest -Uri "$baseUrl/favorites/550" -Method "DELETE" -Token $token
Write-Host "해제 메시지: $($delRes.message)" -ForegroundColor Green

Write-Host "`n=======================================================" -ForegroundColor Cyan
Write-Host "8. 존재하지 않는 즐겨찾기 해제: DELETE /favorites/550 -> 404 FAVORITE404_1" -ForegroundColor Yellow
Write-Host "=======================================================" -ForegroundColor Cyan
$delNotFound = Invoke-ApiRequest -Uri "$baseUrl/favorites/550" -Method "DELETE" -Token $token
Write-Host "결과 code: $($delNotFound.code), message: $($delNotFound.message)" -ForegroundColor Red

Write-Host "`n=======================================================" -ForegroundColor Cyan
Write-Host "9. 영화 기록 트랜잭션 저장: POST /movie-records (addToFavorites: true)" -ForegroundColor Yellow
Write-Host "=======================================================" -ForegroundColor Cyan
$recordRes = Invoke-ApiRequest -Uri "$baseUrl/movie-records" -Method "POST" -Token $token -Body '{"movieId":700,"score":5,"comment":"트랜잭션으로 평점과 즐겨찾기를 동시에 저장합니다!","addToFavorites":true}'
Write-Host "평점 ID: $($recordRes.result.rating.ratingId), 즐겨찾기 ID: $($recordRes.result.favorite.favoriteId)" -ForegroundColor Green

Write-Host "`n=======================================================" -ForegroundColor Cyan
Write-Host "10. 영화 기록 중복 방지 트랜잭션: 동일 영화 재기록 -> 409 RATING409_1" -ForegroundColor Yellow
Write-Host "=======================================================" -ForegroundColor Cyan
$dupRecord = Invoke-ApiRequest -Uri "$baseUrl/movie-records" -Method "POST" -Token $token -Body '{"movieId":700,"score":4,"comment":"중복 시도","addToFavorites":true}'
Write-Host "결과 code: $($dupRecord.code), message: $($dupRecord.message)" -ForegroundColor Red

Write-Host "`n8주차 백엔드 전체 시나리오 검증이 완료되었습니다!" -ForegroundColor Green
