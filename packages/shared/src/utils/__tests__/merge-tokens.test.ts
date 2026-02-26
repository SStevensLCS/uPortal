import { describe, it, expect } from 'vitest';
import {
  resolveMergeTokens,
  getMergeTokenValue,
  extractTokens,
} from '../merge-tokens';
import type { MergeTokenContext } from '../merge-tokens';

describe('resolveMergeTokens', () => {
  it('replaces tokens in a template string', () => {
    const context: MergeTokenContext = {
      parent: { first_name: 'Sarah', last_name: 'Johnson' },
    };
    const result = resolveMergeTokens(
      'Hello {{parent.first_name}} {{parent.last_name}}!',
      context
    );
    expect(result).toBe('Hello Sarah Johnson!');
  });

  it('replaces missing tokens with empty string', () => {
    const context: MergeTokenContext = {
      parent: { first_name: 'Sarah' },
    };
    const result = resolveMergeTokens(
      'Hello {{parent.first_name}}, code: {{parent.code}}',
      context
    );
    expect(result).toBe('Hello Sarah, code: ');
  });

  it('handles empty context', () => {
    const result = resolveMergeTokens('Hello {{parent.name}}!', {});
    expect(result).toBe('Hello !');
  });

  it('handles template with no tokens', () => {
    const result = resolveMergeTokens('Hello World!', {
      parent: { name: 'Sarah' },
    });
    expect(result).toBe('Hello World!');
  });

  it('replaces multiple occurrences of same token', () => {
    const context: MergeTokenContext = {
      student: { first_name: 'Emma' },
    };
    const result = resolveMergeTokens(
      '{{student.first_name}} said hi to {{student.first_name}}',
      context
    );
    expect(result).toBe('Emma said hi to Emma');
  });

  it('handles tokens across multiple namespaces', () => {
    const context: MergeTokenContext = {
      parent: { first_name: 'Sarah' },
      student: { first_name: 'Emma' },
      school: { name: 'Lincoln Academy' },
    };
    const result = resolveMergeTokens(
      'Dear {{parent.first_name}}, {{student.first_name}} has been accepted at {{school.name}}.',
      context
    );
    expect(result).toBe(
      'Dear Sarah, Emma has been accepted at Lincoln Academy.'
    );
  });
});

describe('getMergeTokenValue', () => {
  it('resolves a simple token', () => {
    const context: MergeTokenContext = {
      student: { first_name: 'Emma' },
    };
    expect(getMergeTokenValue('student.first_name', context)).toBe('Emma');
  });

  it('returns empty string for missing namespace', () => {
    expect(getMergeTokenValue('student.first_name', {})).toBe('');
  });

  it('returns empty string for missing field', () => {
    const context: MergeTokenContext = {
      student: { first_name: 'Emma' },
    };
    expect(getMergeTokenValue('student.last_name', context)).toBe('');
  });

  it('returns empty string for token without dot', () => {
    expect(getMergeTokenValue('invalid', {})).toBe('');
  });

  it('handles current.year token', () => {
    const result = getMergeTokenValue('current.year', {});
    expect(result).toBe(new Date().getFullYear().toString());
  });
});

describe('extractTokens', () => {
  it('extracts tokens from template', () => {
    const tokens = extractTokens(
      'Hello {{parent.first_name}}, re: {{student.full_name}}'
    );
    expect(tokens).toEqual(['parent.first_name', 'student.full_name']);
  });

  it('deduplicates tokens', () => {
    const tokens = extractTokens(
      '{{student.name}} and {{student.name}}'
    );
    expect(tokens).toEqual(['student.name']);
  });

  it('returns empty array for template with no tokens', () => {
    const tokens = extractTokens('Hello World!');
    expect(tokens).toEqual([]);
  });
});
