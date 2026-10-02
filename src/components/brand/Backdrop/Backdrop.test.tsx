import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { expectNoA11yViolations } from '../../../../test/a11y';
import { Backdrop } from './Backdrop';

describe('Backdrop', () => {
  it('renders the ambient and scanline layers, corner marks, frame labels and children by default', () => {
    const { container } = render(<Backdrop>content</Backdrop>);
    const root = container.firstElementChild;
    expect(root?.className).toBe('su-backdrop');
    expect(container.querySelector('.su-backdrop__ambient')).not.toBeNull();
    expect(container.querySelector('.su-backdrop__scanlines')).not.toBeNull();
    expect(container.querySelectorAll('.su-backdrop__mark')).toHaveLength(2);
    expect(container.querySelector('.su-backdrop__site')?.textContent).toBe('SCRAPUP.DEV');
    expect(container.querySelector('.su-backdrop__label')?.textContent).toBe('FIG · 01 — IDENTITY');
    expect(screen.getByText('content').className).toBe('su-backdrop__content');
  });

  it('hides every decorative element from assistive technology', () => {
    const { container } = render(<Backdrop>content</Backdrop>);
    const decorative = container.querySelectorAll('.su-backdrop__ambient, .su-backdrop__scanlines, .su-backdrop__frame');
    expect(decorative.length).toBeGreaterThan(0);
    for (const element of decorative) expect(element.getAttribute('aria-hidden')).toBe('true');
  });

  it('omits the scanlines and the frame when disabled', () => {
    const { container } = render(<Backdrop marks={false} scanlines={false} />);
    expect(container.querySelector('.su-backdrop__scanlines')).toBeNull();
    expect(container.querySelector('.su-backdrop__frame')).toBeNull();
  });

  it('omits empty labels (D-07)', () => {
    const { container } = render(<Backdrop label="" site="" />);
    expect(container.querySelector('.su-backdrop__site')).toBeNull();
    expect(container.querySelector('.su-backdrop__label')).toBeNull();
    expect(container.querySelectorAll('.su-backdrop__mark')).toHaveLength(2);
  });

  it('renders custom labels', () => {
    const { container } = render(<Backdrop label="FIG · 02" site="EXAMPLE.DEV" />);
    expect(container.querySelector('.su-backdrop__site')?.textContent).toBe('EXAMPLE.DEV');
    expect(container.querySelector('.su-backdrop__label')?.textContent).toBe('FIG · 02');
  });

  it('applies the full-height modifier and appends className', () => {
    const { container } = render(<Backdrop className="page" fullHeight />);
    expect(container.firstElementChild?.className).toBe('su-backdrop su-backdrop--full-height page');
  });

  it('has no critical or serious a11y violations', async () => {
    const { container } = render(<Backdrop>content</Backdrop>);
    await expectNoA11yViolations(container);
  });
});
