import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { expectNoA11yViolations } from './a11y';

describe('expectNoA11yViolations', () => {
  it('passes for accessible markup', async () => {
    const { container } = render(<button type="button">Join</button>);
    await expect(expectNoA11yViolations(container)).resolves.toBeUndefined();
  });

  it('fails for a serious violation (button without a name)', async () => {
    const { container } = render(<button type="button" />);
    await expect(expectNoA11yViolations(container)).rejects.toThrow(/button-name/);
  });
});
