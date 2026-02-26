import { describe, it, expect } from 'vitest';
import { schoolSettingsSchema, enrollmentSeasonSchema } from '../school';

describe('schoolSettingsSchema', () => {
  const validSchool = {
    name: 'Lincoln Academy',
    slug: 'lincoln-academy',
    timezone: 'America/New_York',
    currency: 'USD',
    school_type: 'independent' as const,
    grade_levels: ['K', '1', '2', '3', '4', '5'],
  };

  it('accepts valid school settings', () => {
    const result = schoolSettingsSchema.safeParse(validSchool);
    expect(result.success).toBe(true);
  });

  it('requires school name', () => {
    const result = schoolSettingsSchema.safeParse({ ...validSchool, name: '' });
    expect(result.success).toBe(false);
  });

  it('validates slug format', () => {
    const result = schoolSettingsSchema.safeParse({
      ...validSchool,
      slug: 'Invalid Slug!',
    });
    expect(result.success).toBe(false);
  });

  it('requires at least one grade level', () => {
    const result = schoolSettingsSchema.safeParse({
      ...validSchool,
      grade_levels: [],
    });
    expect(result.success).toBe(false);
  });

  it('validates currency is 3 characters', () => {
    const result = schoolSettingsSchema.safeParse({
      ...validSchool,
      currency: 'US',
    });
    expect(result.success).toBe(false);
  });

  it('accepts valid school type', () => {
    const result = schoolSettingsSchema.safeParse({
      ...validSchool,
      school_type: 'montessori',
    });
    expect(result.success).toBe(true);
  });

  it('rejects invalid school type', () => {
    const result = schoolSettingsSchema.safeParse({
      ...validSchool,
      school_type: 'invalid_type',
    });
    expect(result.success).toBe(false);
  });
});

describe('enrollmentSeasonSchema', () => {
  const validSeason = {
    name: '2025-2026',
    start_date: '2025-08-01',
    end_date: '2026-07-31',
    is_active: true,
  };

  it('accepts valid enrollment season', () => {
    const result = enrollmentSeasonSchema.safeParse(validSeason);
    expect(result.success).toBe(true);
  });

  it('requires season name', () => {
    const result = enrollmentSeasonSchema.safeParse({ ...validSeason, name: '' });
    expect(result.success).toBe(false);
  });

  it('requires end date after start date', () => {
    const result = enrollmentSeasonSchema.safeParse({
      ...validSeason,
      start_date: '2026-08-01',
      end_date: '2025-07-31',
    });
    expect(result.success).toBe(false);
  });

  it('validates date format', () => {
    const result = enrollmentSeasonSchema.safeParse({
      ...validSeason,
      start_date: 'not-a-date',
    });
    expect(result.success).toBe(false);
  });
});
