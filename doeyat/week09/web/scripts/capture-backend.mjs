import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
import { mkdir, writeFile, cp } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const week = fileURLToPath(new URL('../../', import.meta.url));
const output = path.join(week, 'docs/backend-screenshots');
const reports = path.join(week, 'docs/backend-test-report');
const origin = process.env.BACKEND_URL || 'http://127.0.0.1:8089';
await mkdir(output, { recursive: true });
await cp(path.join(week, 'backend/build/reports/tests/test'), reports, { recursive: true });
const browser = await chromium.launch({ headless: true, executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE });
const page = await browser.newPage({ viewport: { width: 1440, height: 1050 }, deviceScaleFactor: 1 });
const captured = [];
async function shot(name, locator = page) {
  await locator.screenshot({ path: path.join(output, name + '.png'), ...(locator === page ? { fullPage: true } : {}) });
  captured.push(name + '.png');
}
function operation(method, route) {
  return page.locator(`.opblock-${method}`).filter({ has: page.locator(`.opblock-summary-path[data-path="${route}"]`) });
}
try {
  const specResponse = await fetch(origin + '/v3/api-docs');
  assert.equal(specResponse.status, 200);
  const spec = await specResponse.json();
  await writeFile(path.join(output, 'openapi.json'), JSON.stringify(spec, null, 2));
  await page.goto(origin + '/swagger-ui/index.html');
  await page.locator('.opblock').nth(13).waitFor();
  await shot('01-swagger-all');
  const docs = [
    ['post', '/ratings', '02-rating-create'],
    ['patch', '/ratings/{ratingId}', '03-rating-update'],
    ['delete', '/ratings/{ratingId}', '04-rating-delete'],
    ['get', '/members/{memberId}/ratings', '05-rating-list-public'],
    ['get', '/members/me', '06-profile-get'],
    ['patch', '/members/me', '07-profile-update'],
    ['get', '/favorites', '08-favorite-list'],
    ['get', '/favorites/{movieId}', '09-favorite-status'],
    ['delete', '/favorites/{movieId}', '10-favorite-delete'],
    ['post', '/favorites', '11-favorite-create'],
  ];
  for (const [method, route, name] of docs) {
    const block = operation(method, route);
    await block.locator('.opblock-summary').click();
    await block.locator('.responses-table').waitFor();
    await shot(name, block);
    await block.locator('.opblock-summary').click();
  }

  // Execute actual requests through Swagger UI; capture only the response table so no JWT is exposed.
  const rating = operation('post', '/ratings');
  await rating.locator('.opblock-summary').click();
  await rating.getByRole('button', { name: 'Try it out', exact: true }).click();
  await rating.locator('textarea').fill(JSON.stringify({ movieId: 550, score: 5, comment: 'Swagger 실제 요청' }));
  await rating.getByRole('button', { name: 'Execute', exact: true }).click();
  await rating.locator('.live-responses-table .response-col_status').filter({ hasText: '401' }).waitFor();
  await shot('12-rating-without-token-401', rating.locator('.live-responses-table'));

  const email = `backend${Date.now()}@example.com`;
  const password = 'Umc!1234';
  const signup = await fetch(origin + '/members', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, nickname: `도얏${String(Date.now()).slice(-7)}`, password }) });
  assert.equal(signup.status, 201);
  const login = await fetch(origin + '/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
  assert.equal(login.status, 200);
  const { result: { accessToken } } = await login.json();
  await page.getByRole('button', { name: /^Authorize/ }).first().click();
  const modal = page.locator('.dialog-ux');
  await modal.locator('input').fill(accessToken);
  await modal.getByRole('button', { name: 'Apply credentials', exact: true }).click();
  await modal.getByRole('button', { name: 'Close', exact: true }).click();
  for (const [status, name] of [[201, '13-rating-authorized-201'], [409, '14-rating-duplicate-409']]) {
    await rating.getByRole('button', { name: 'Execute', exact: true }).click();
    await rating.locator('.live-responses-table .response-col_status').filter({ hasText: String(status) }).waitFor();
    await shot(name, rating.locator('.live-responses-table'));
  }
  await rating.locator('.opblock-summary').click();
  const favorite = operation('post', '/favorites');
  await favorite.locator('.opblock-summary').click();
  await favorite.getByRole('button', { name: 'Try it out', exact: true }).click();
  await favorite.locator('textarea').fill('{"movieId":550}');
  for (const [status, name] of [[201, '15-favorite-authorized-201'], [409, '16-favorite-duplicate-409']]) {
    await favorite.getByRole('button', { name: 'Execute', exact: true }).click();
    await favorite.locator('.live-responses-table .response-col_status').filter({ hasText: String(status) }).waitFor();
    await shot(name, favorite.locator('.live-responses-table'));
  }
  for (const [file, name] of [
    ['index.html', '17-all-tests-passed'],
    ['classes/com.umc.movie.RatingServiceTest.html', '18-rating-unit-tests'],
    ['classes/com.umc.movie.RatingMissionIntegrationTest.html', '19-rating-integration-tests'],
  ]) {
    await page.goto(pathToFileURL(path.join(reports, file)).href);
    await page.locator('#content').waitFor();
    await shot(name);
  }
  await writeFile(path.join(output, 'capture-result.json'), JSON.stringify({ capturedAt: new Date().toISOString(), origin, screenshots: captured, apiStatuses: { withoutToken: 401, ratingCreated: 201, ratingDuplicate: 409, favoriteCreated: 201, favoriteDuplicate: 409 }, tokenSaved: false }, null, 2));
  console.log(`PASS: ${captured.length} screenshots from real Swagger UI and Gradle reports; API 401/201/409 verified.`);
} finally {
  await browser.close();
}
