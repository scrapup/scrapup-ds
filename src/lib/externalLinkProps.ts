export interface LinkProps {
  href: string;
  target?: '_blank';
  rel?: string;
}

// Browsers ignore ASCII whitespace and control characters inside the scheme.
// eslint-disable-next-line no-control-regex -- matching control characters is the point here.
const IGNORED_IN_SCHEME = /[\u0000- ]/g;
const SCHEME = /^([a-z][a-z0-9+.-]*):/i;
const SAFE_SCHEMES = new Set(['http', 'https', 'mailto', 'tel']);
const EXTERNAL = /^(?:https?:)?\/\//i;

/**
 * Link attributes for an `href` (D-06). Allowlist: relative URLs and the http, https, mailto and
 * tel schemes; any other scheme (javascript:, data:, vbscript:, OS protocol handlers…) becomes `#`.
 * External http(s) and protocol-relative links open in a new tab without opener/referrer.
 */
export function externalLinkProps(href: string): LinkProps {
  const normalized = href.replace(IGNORED_IN_SCHEME, '');
  const scheme = SCHEME.exec(normalized)?.[1]?.toLowerCase();
  if (scheme !== undefined && !SAFE_SCHEMES.has(scheme)) return { href: '#' };
  if (EXTERNAL.test(normalized)) return { href, target: '_blank', rel: 'noopener noreferrer' };
  return { href };
}
