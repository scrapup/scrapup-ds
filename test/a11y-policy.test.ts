import { describe, expect, it } from 'vitest';
import { blockingViolations, isExemptLogotypeContrast } from './a11y-policy';

describe('a11y policy', () => {
  it('exempts color contrast inside the logotype only', () => {
    expect(isExemptLogotypeContrast('color-contrast', '.su-wordmark > span > .su-wordmark__up')).toBe(true);
    expect(isExemptLogotypeContrast('color-contrast', '.su-wordmark--light > span[aria-hidden="true"] > .su-wordmark__up')).toBe(true);
    expect(isExemptLogotypeContrast('color-contrast', '.su-wordmark-link')).toBe(false);
    expect(isExemptLogotypeContrast('color-contrast', '.su-wordmark-caption')).toBe(false);
    expect(isExemptLogotypeContrast('button-name', '.su-wordmark')).toBe(false);
  });

  it('keeps serious and critical violations outside the logotype, one entry per node', () => {
    const result = blockingViolations([
      { id: 'color-contrast', help: 'Contrast', impact: 'serious', nodes: [{ target: ['.su-wordmark'] }, { target: ['.su-tag'] }] },
      { id: 'region', help: 'Landmarks', impact: 'moderate', nodes: [{ target: ['main'] }] },
      { id: 'button-name', help: 'Button name', impact: 'critical', nodes: [{ target: ['button'] }] },
    ]);
    expect(result).toEqual(['color-contrast: Contrast (.su-tag)', 'button-name: Button name (button)']);
  });
});
