import { describe, expect, it } from 'vitest';
import { externalLinkProps } from './externalLinkProps';

describe('externalLinkProps', () => {
  it('opens http(s) links in a new tab without opener (D-06)', () => {
    expect(externalLinkProps('https://scrapup.dev')).toEqual({
      href: 'https://scrapup.dev',
      target: '_blank',
      rel: 'noopener noreferrer',
    });
    expect(externalLinkProps('HTTP://example.com')).toEqual({
      href: 'HTTP://example.com',
      target: '_blank',
      rel: 'noopener noreferrer',
    });
  });

  it('keeps internal, anchor and mailto links as plain hrefs', () => {
    expect(externalLinkProps('/manifesto')).toEqual({ href: '/manifesto' });
    expect(externalLinkProps('#waitlist')).toEqual({ href: '#waitlist' });
    expect(externalLinkProps('mailto:hi@scrapup.dev')).toEqual({ href: 'mailto:hi@scrapup.dev' });
  });

  it('neutralizes script URLs, whatever the case or surrounding whitespace', () => {
    expect(externalLinkProps('javascript:alert(1)')).toEqual({ href: '#' });
    expect(externalLinkProps('  JavaScript:alert(1)')).toEqual({ href: '#' });
    expect(externalLinkProps('java\tscript:alert(1)')).toEqual({ href: '#' });
    expect(externalLinkProps('vbscript:msgbox(1)')).toEqual({ href: '#' });
    expect(externalLinkProps('data:text/html,<b>x</b>')).toEqual({ href: '#' });
  });
});
