import { test, expect } from '@playwright/test';

test('목록 URL 페이지 이동과 서버 즐겨찾기의 새로고침 복원', async ({ page, request }) => {
  const stamp=Date.now();const email=`e2e${stamp}@example.com`;const password='Umc!1234';
  const signup=await request.post('/api/members',{data:{email,nickname:`e${String(stamp).slice(-9)}`,password}});
  expect(signup.status()).toBe(201);
  await page.goto('/login');
  await page.locator('#login-email').fill(email);
  await page.locator('#login-password').fill(password);
  await page.getByRole('button',{name:'로그인',exact:true}).click();
  await expect(page.getByRole('button',{name:'로그아웃'})).toBeVisible();
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/?page=1');
  const bookmark = page.getByRole('button', { name: /북마크/ }).first();
  const label = await bookmark.getAttribute('aria-label');
  await bookmark.click();
  await expect(bookmark).toHaveAttribute('aria-pressed', 'true');
  await page.reload();
  await expect(page.getByRole('button', { name: label!, exact: true })).toHaveAttribute('aria-pressed', 'true');
  await page.screenshot({ path: '../docs/screenshots/09-bookmark-restored.png', fullPage: true });
  // 샘플 영화는 10편이라 한 페이지이며, 두 번째 페이지 직접 접근은 빈 결과다.
  await expect(page.getByRole('button', { name: '다음', exact: true })).toBeDisabled();
  await page.goto('/?page=2');
  await expect(page).toHaveURL(/page=2/);
  await expect(page.getByText('표시할 영화가 없습니다.', { exact: true })).toBeVisible();
  await page.goBack();
  await expect(page).toHaveURL(/page=1/);
  await expect(page.getByRole('button', { name: label!, exact: true })).toHaveAttribute('aria-pressed', 'true');
  await page.goto('/?page=abc');
  await expect(page.getByRole('button', { name: label!, exact: true })).toBeVisible();
  expect(errors).toEqual([]);
});

test('검색어 인코딩, 뒤로 가기와 동적 상세 직접 접근', async ({ page }) => {
  await page.goto('/search?query=스파이더');
  await expect(page.getByLabel('검색어')).toHaveValue('스파이더');
  const detail = page.locator('main a[href^="/movies/"]').first();
  const href = await detail.getAttribute('href');
  await page.screenshot({ path: '../docs/screenshots/10-search.png', fullPage: true });
  await detail.click();
  await expect(page).toHaveURL(new RegExp(href!));
  await page.reload();
  await expect(page.locator('main h1')).toBeVisible();
  await page.screenshot({ path: '../docs/screenshots/11-detail.png', fullPage: true });
  await page.goBack();
  await expect(page.getByLabel('검색어')).toHaveValue('스파이더');
  await page.getByLabel('검색어').fill('한글 & title');
  await page.getByRole('button', { name: '검색', exact: true }).click();
  await expect.poll(() => new URL(page.url()).searchParams.get('query')).toBe('한글 & title');
  await expect(page.getByText('검색 결과가 없어요.', { exact: true })).toBeVisible();
});

test('비로그인 내 정보, 잘못된 ID, 없는 경로', async ({ page }) => {
  await page.goto('/mypage/edit');
  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByRole('heading', { name: '로그인', exact: true })).toBeVisible();
  await page.goto('/movies/abc');
  await expect(page.getByText('올바르지 않은 영화 ID입니다.', { exact: true })).toBeVisible();
  const response = await page.goto('/missing');
  expect(response?.status()).toBe(404);
  await expect(page.getByRole('heading', { name: '페이지를 찾을 수 없어요.' })).toBeVisible();
});
