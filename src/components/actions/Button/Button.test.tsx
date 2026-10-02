import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { expectNoA11yViolations } from '../../../../test/a11y';
import { Button } from './Button';

describe('Button', () => {
  it('renders a primary md <button type="button"> by default', () => {
    render(<Button>JOIN</Button>);
    const button = screen.getByRole('button', { name: 'JOIN' });
    expect(button.className).toBe('su-button su-button--primary su-button--md');
    expect(button.getAttribute('type')).toBe('button');
  });

  it.each(['primary', 'secondary', 'link'] as const)('applies the %s variant', (variant) => {
    render(<Button variant={variant}>GO</Button>);
    expect(screen.getByRole('button').classList.contains(`su-button--${variant}`)).toBe(true);
  });

  it('applies the sm size and the submit type', () => {
    render(<Button size="sm" type="submit">SEND</Button>);
    const button = screen.getByRole('button');
    expect(button.classList.contains('su-button--sm')).toBe(true);
    expect(button.getAttribute('type')).toBe('submit');
  });

  it('falls back to the defaults for unknown variant, size and type (D-05)', () => {
    render(
      <Button size={'xl' as never} type={'reset' as never} variant={'ghost' as never}>
        GO
      </Button>,
    );
    const button = screen.getByRole('button');
    expect(button.className).toBe('su-button su-button--primary su-button--md');
    expect(button.getAttribute('type')).toBe('button');
  });

  it('calls onClick when activated with the mouse or the keyboard', async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(<Button onClick={onClick}>GO</Button>);
    await user.click(screen.getByRole('button'));
    await user.keyboard('{Enter}');
    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it('renders the icon as a decorative element before the label', () => {
    const { container } = render(<Button icon="★">STAR ON GITHUB</Button>);
    const icon = container.querySelector('.su-button__icon');
    expect(icon?.textContent).toBe('★');
    expect(icon?.getAttribute('aria-hidden')).toBe('true');
    expect(icon?.nextElementSibling?.className).toBe('su-button__label');
  });

  it('omits an empty label and names an icon-only button through aria-label (D-07)', () => {
    const { container } = render(<Button aria-label="Back" icon="←" />);
    expect(container.querySelector('.su-button__label')).toBeNull();
    expect(container.textContent).toBe('←');
    expect(screen.getByRole('button', { name: 'Back' })).not.toBeNull();
  });

  it.each([undefined, ''])('omits the icon slot when icon is %j (D-07)', (icon) => {
    const { container } = render(<Button icon={icon}>GO</Button>);
    expect(container.querySelector('.su-button__icon')).toBeNull();
  });

  it('disables the native button', async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(
      <Button disabled onClick={onClick}>
        SEND
      </Button>,
    );
    await user.click(screen.getByRole('button'));
    expect(screen.getByRole('button')).toHaveProperty('disabled', true);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('renders an external link with safe attributes (D-06)', () => {
    render(<Button href="https://github.com/scrapup">READ THE DOCS ↗</Button>);
    const link = screen.getByRole('link', { name: 'READ THE DOCS ↗' });
    expect(link.getAttribute('target')).toBe('_blank');
    expect(link.getAttribute('rel')).toBe('noopener noreferrer');
    expect(link.hasAttribute('type')).toBe(false);
  });

  it('renders an internal link without target', () => {
    render(<Button href="/manifesto">MANIFESTO</Button>);
    expect(screen.getByRole('link').hasAttribute('target')).toBe(false);
  });

  it('neutralizes script URLs to "#"', () => {
    render(<Button href="javascript:alert(1)">BAD</Button>);
    expect(screen.getByRole('link').getAttribute('href')).toBe('#');
  });

  it('calls onClick on links too', async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(
      <Button href="/" onClick={onClick}>
        HOME
      </Button>,
    );
    await user.click(screen.getByRole('link'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('appends className to the root', () => {
    render(<Button className="extra">GO</Button>);
    expect(screen.getByRole('button').classList.contains('extra')).toBe(true);
  });

  it('has no critical or serious a11y violations', async () => {
    const { container } = render(
      <>
        <Button>JOIN</Button>
        <Button href="/" variant="link">
          ← BACK
        </Button>
      </>,
    );
    await expectNoA11yViolations(container);
  });
});
