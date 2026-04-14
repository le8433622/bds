import { describe, expect, it } from 'vitest';
import { COLORS } from './colors';
import { SPACING } from './spacing';
import { TYPOGRAPHY } from './typography';
import { ROUTES } from './routes';

describe('design tokens and routes', () => {
  it('has required color tokens', () => {
    expect(COLORS.primary).toBeTypeOf('string');
    expect(COLORS.background).toBeTypeOf('string');
  });

  it('has ascending spacing scale', () => {
    expect(SPACING.xs).toBeLessThan(SPACING.sm);
    expect(SPACING.sm).toBeLessThan(SPACING.md);
    expect(SPACING.md).toBeLessThan(SPACING.lg);
    expect(SPACING.lg).toBeLessThan(SPACING.xl);
  });

  it('has expected typography hierarchy', () => {
    expect(TYPOGRAPHY.h1).toBeGreaterThan(TYPOGRAPHY.h2);
    expect(TYPOGRAPHY.h2).toBeGreaterThan(TYPOGRAPHY.title);
    expect(TYPOGRAPHY.title).toBeGreaterThan(TYPOGRAPHY.caption);
  });

  it('has unique route names', () => {
    const values = Object.values(ROUTES);
    expect(new Set(values).size).toBe(values.length);
  });
});
