import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderHighlight } from './renderHighlight';

describe('renderHighlight', () => {
  it('wraps exactly one occurrence in the given class', () => {
    const { container } = render(<h1>{renderHighlight('forged and forged', 'forged', 'mark')}</h1>);
    expect(container.querySelectorAll('.mark')).toHaveLength(1);
    expect(container.textContent).toBe('forged and forged');
  });

  it.each([undefined, '', 'absent'])('returns the plain text for highlight %j', (highlight) => {
    const { container } = render(<h1>{renderHighlight('Plain title', highlight, 'mark')}</h1>);
    expect(container.querySelector('.mark')).toBeNull();
    expect(container.textContent).toBe('Plain title');
  });
});
