import { describe, expect, it } from 'vitest';
import { externalLinkProps } from './externalLinkProps';

const EXTERNAL = { target: '_blank', rel: 'noopener noreferrer' } as const;

describe('externalLinkProps', () => {
  it.each(['https://scrapup.dev', 'HTTP://example.com', '//cdn.example.com/x', '  https://scrapup.dev'])(
    'opens external link %j in a new tab without opener (D-06)',
    (href) => {
      expect(externalLinkProps(href)).toEqual({ href, ...EXTERNAL });
    },
  );

  it.each(['/manifesto', './docs', '#waitlist', '?lang=pt', 'mailto:hi@scrapup.dev', 'tel:+5511999999999', ''])(
    'keeps internal or safe link %j as a plain href',
    (href) => {
      expect(externalLinkProps(href)).toEqual({ href });
    },
  );

  it.each([
    'javascript:alert(1)',
    '  JavaScript:alert(1)',
    'java\tscript:alert(1)',
    'vbscript:msgbox(1)',
    'data:text/html,<b>x</b>',
    'blob:https://x/1',
    'ms-msdt:/id',
  ])('neutralizes unsafe scheme %j to #', (href) => {
    expect(externalLinkProps(href)).toEqual({ href: '#' });
  });
});
