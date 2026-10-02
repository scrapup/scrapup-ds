// Shared axe gate policy for the unit (axe-core) and e2e (@axe-core/playwright) helpers.

/** Violations with these impacts fail the gate. */
export const BLOCKING_IMPACTS: ReadonlySet<string> = new Set(['critical', 'serious']);

// The logotype block, its elements (__) and modifiers (--); not other blocks such as su-wordmark-link.
const LOGOTYPE = /\.su-wordmark(?:--|__|(?![-\w]))/;

/** WCAG 1.4.3: text that is part of a logo or brand name has no contrast requirement. */
export function isExemptLogotypeContrast(ruleId: string, selector: string): boolean {
  return ruleId === 'color-contrast' && LOGOTYPE.test(selector);
}

interface AxeViolation {
  id: string;
  help: string;
  impact?: string | null;
  nodes: { target: unknown[] }[];
}

/** Human-readable blocking violations, one entry per failing node (logotype contrast exempt). */
export function blockingViolations(violations: readonly AxeViolation[]): string[] {
  return violations
    .filter((violation) => BLOCKING_IMPACTS.has(violation.impact ?? ''))
    .flatMap((violation) =>
      violation.nodes
        .map((node) => node.target.map(String).join(' '))
        .filter((selector) => !isExemptLogotypeContrast(violation.id, selector))
        .map((selector) => `${violation.id}: ${violation.help} (${selector})`),
    );
}
