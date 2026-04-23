import test from 'node:test';
import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import { constants } from 'node:fs';
import { join } from 'node:path';

const projectRoot = process.cwd();

const salaryPagePath = join(projectRoot, 'src', 'pages', 'คำนวณเงินเดือนสุทธิ', 'index.astro');
const creditCardPagePath = join(projectRoot, 'src', 'pages', 'คำนวณดอกเบี้ยบัตรเครดิต', 'index.astro');
const transferFeePagePath = join(projectRoot, 'src', 'pages', 'คำนวณค่าโอนบ้าน', 'index.astro');
const percentagePagePath = join(projectRoot, 'src', 'pages', 'คำนวณเปอร์เซ็นต์', 'index.astro');
const homePagePath = join(projectRoot, 'src', 'pages', 'index.astro');

async function readUtf8(path) {
  return readFile(path, 'utf8');
}

test('calculator source includes transfer-fee and percentage routes', async () => {
  await access(transferFeePagePath, constants.R_OK);
  await access(percentagePagePath, constants.R_OK);
});

test('income calculator includes required ratio selector compatibility', async () => {
  const salaryPage = await readUtf8(salaryPagePath);
  assert.match(salaryPage, /id="res-income-ratio"/);
  assert.match(salaryPage, /getElementById\('res-income-ratio'\)/);
});

test('credit-card calculator keeps required interest selectors', async () => {
  const creditPage = await readUtf8(creditCardPagePath);
  assert.match(creditPage, /id="res-total-interest"/);
  assert.match(creditPage, /id="res-next-balance"/);
});

test('homepage links include transfer-fee and percentage calculators', async () => {
  const homePage = await readUtf8(homePagePath);
  assert.match(homePage, /href:\s*'\/คำนวณค่าโอนบ้าน\/'/);
  assert.match(homePage, /href:\s*'\/คำนวณเปอร์เซ็นต์\/'/);
});
