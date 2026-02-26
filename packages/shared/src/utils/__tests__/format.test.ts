import { describe, it, expect } from 'vitest';
import { formatCurrency, formatDate, formatName, formatPhone } from '../format';

describe('formatCurrency', () => {
  it('formats cents to USD by default', () => {
    expect(formatCurrency(1500)).toBe('$15.00');
  });

  it('formats zero cents', () => {
    expect(formatCurrency(0)).toBe('$0.00');
  });

  it('formats negative amounts', () => {
    expect(formatCurrency(-500)).toBe('-$5.00');
  });

  it('formats large amounts', () => {
    expect(formatCurrency(1250000)).toBe('$12,500.00');
  });

  it('formats single-cent amounts', () => {
    expect(formatCurrency(1)).toBe('$0.01');
  });
});

describe('formatDate', () => {
  it('formats in medium style by default', () => {
    const result = formatDate('2024-09-15T10:30:00Z', 'medium');
    expect(result).toContain('Sep');
    expect(result).toContain('15');
    expect(result).toContain('2024');
  });

  it('formats as ISO string', () => {
    expect(formatDate('2024-09-15T10:30:00Z', 'iso')).toBe('2024-09-15');
  });

  it('handles invalid dates', () => {
    expect(formatDate('not-a-date')).toBe('Invalid date');
  });

  it('accepts Date objects', () => {
    const d = new Date('2024-01-01T00:00:00Z');
    const result = formatDate(d, 'iso');
    expect(result).toBe('2024-01-01');
  });
});

describe('formatName', () => {
  it('formats first and last name', () => {
    expect(formatName('William', 'Smith')).toBe('William Smith');
  });

  it('uses preferred name over first name', () => {
    expect(formatName('William', 'Smith', 'Bill')).toBe('Bill Smith');
  });

  it('handles empty first name', () => {
    expect(formatName('', 'Smith')).toBe('Smith');
  });

  it('handles empty last name', () => {
    expect(formatName('William', '')).toBe('William');
  });

  it('handles both empty', () => {
    expect(formatName('', '')).toBe('');
  });

  it('ignores null preferred name', () => {
    expect(formatName('William', 'Smith', null)).toBe('William Smith');
  });

  it('trims whitespace', () => {
    expect(formatName('  William  ', '  Smith  ')).toBe('William Smith');
  });
});

describe('formatPhone', () => {
  it('formats 10-digit US phone number', () => {
    expect(formatPhone('5551234567')).toBe('(555) 123-4567');
  });

  it('formats 11-digit US phone with country code', () => {
    expect(formatPhone('15551234567')).toBe('+1 (555) 123-4567');
  });

  it('passes through non-US formats', () => {
    expect(formatPhone('+44 20 7123')).toBe('+44 20 7123');
  });

  it('handles phone with existing formatting', () => {
    const result = formatPhone('(555) 123-4567');
    expect(result).toBe('(555) 123-4567');
  });
});
