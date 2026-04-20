import { describe, it, expect } from 'vitest';
import { calculatePassportFee, getRequiredDocuments } from './passport-fee-calculator';

describe('calculatePassportFee', () => {
  it('adult, 5-year, regular = 1,000 THB', () => {
    const r = calculatePassportFee({ applicantType: 'adult', applicationType: 'first_time', validity: '5year', serviceSpeed: 'regular' });
    expect(r.baseFee).toBe(1000);
    expect(r.expressSurcharge).toBe(0);
    expect(r.totalFee).toBe(1000);
    expect(r.validityYears).toBe(5);
  });

  it('adult, 10-year, regular = 1,500 THB', () => {
    const r = calculatePassportFee({ applicantType: 'adult', applicationType: 'renewal', validity: '10year', serviceSpeed: 'regular' });
    expect(r.baseFee).toBe(1500);
    expect(r.expressSurcharge).toBe(0);
    expect(r.totalFee).toBe(1500);
    expect(r.validityYears).toBe(10);
  });

  it('adult, 5-year, express = 2,000 THB', () => {
    const r = calculatePassportFee({ applicantType: 'adult', applicationType: 'first_time', validity: '5year', serviceSpeed: 'express' });
    expect(r.baseFee).toBe(1000);
    expect(r.expressSurcharge).toBe(1000);
    expect(r.totalFee).toBe(2000);
  });

  it('adult, 10-year, express = 2,500 THB', () => {
    const r = calculatePassportFee({ applicantType: 'adult', applicationType: 'renewal', validity: '10year', serviceSpeed: 'express' });
    expect(r.totalFee).toBe(2500);
  });

  it('minor forced to 5-year even when 10year requested', () => {
    const r = calculatePassportFee({ applicantType: 'minor', applicationType: 'first_time', validity: '10year', serviceSpeed: 'regular' });
    expect(r.validity).toBe('5year');
    expect(r.baseFee).toBe(1000);
    expect(r.totalFee).toBe(1000);
    expect(r.validityYears).toBe(5);
  });

  it('minor, express = 2,000 THB (forced 5-year)', () => {
    const r = calculatePassportFee({ applicantType: 'minor', applicationType: 'first_time', validity: '10year', serviceSpeed: 'express' });
    expect(r.totalFee).toBe(2000);
    expect(r.validity).toBe('5year');
  });

  it('processing days: regular = 2-3 วันทำการ', () => {
    const r = calculatePassportFee({ applicantType: 'adult', applicationType: 'first_time', validity: '5year', serviceSpeed: 'regular' });
    expect(r.processingDays).toBe('2-3 วันทำการ');
  });

  it('processing days: express = 1 วันทำการ', () => {
    const r = calculatePassportFee({ applicantType: 'adult', applicationType: 'first_time', validity: '5year', serviceSpeed: 'express' });
    expect(r.processingDays).toBe('1 วันทำการ');
  });
});

describe('getRequiredDocuments', () => {
  it('adult first-time: includes ID card and house registration', () => {
    const docs = getRequiredDocuments('adult', 'first_time');
    const labels = docs.map((d) => d.label);
    expect(labels).toContain('บัตรประจำตัวประชาชน (ตัวจริง)');
    expect(labels).toContain('ทะเบียนบ้าน (ตัวจริง)');
    // No old passport for first-time
    expect(labels).not.toContain('หนังสือเดินทางเล่มเดิม');
  });

  it('adult renewal: includes old passport', () => {
    const docs = getRequiredDocuments('adult', 'renewal');
    const labels = docs.map((d) => d.label);
    expect(labels).toContain('หนังสือเดินทางเล่มเดิม');
  });

  it('minor: includes birth cert and parental docs', () => {
    const docs = getRequiredDocuments('minor', 'first_time');
    const labels = docs.map((d) => d.label);
    expect(labels).toContain('สูติบัตร (ตัวจริง)');
    expect(labels).toContain('บัตรประจำตัวประชาชนบิดาและมารดา (ตัวจริง)');
    expect(labels).toContain('หนังสือยินยอมจากบิดาและมารดา (กรณีไม่ได้มาด้วย)');
  });
});
