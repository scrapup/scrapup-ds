export interface LinkProps {
  href: string;
  target?: '_blank';
  rel?: string;
}

const EXTERNAL = /^https?:\/\//i;
// Browsers ignore ASCII whitespace and control characters inside the scheme.
// eslint-disable-next-line no-control-regex -- matching control characters is the point here.
const IGNORED_IN_SCHEME = /[\u0000- ]/g;
const UNSAFE_SCHEME = /^(?:javascript|vbscript|data):/i;

/**
 * Link attributes for an `href` (D-06): external http(s) links open in a new tab without
 * opener/referrer; script-capable URLs are neutralized to `#`.
 */
export function externalLinkProps(href: string): LinkProps {
  if (UNSAFE_SCHEME.test(href.replace(IGNORED_IN_SCHEME, ''))) return { href: '#' };
  if (EXTERNAL.test(href)) return { href, target: '_blank', rel: 'noopener noreferrer' };
  return { href };
}
