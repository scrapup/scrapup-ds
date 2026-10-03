# scrapup-ds

[English](README.md) | **Português** | [日本語](README.ja.md)

`@scrapup/ds` é o design system do **scrapup**: tokens da marca, assets da marca e 23 componentes
React, portados do projeto de design do scrapup. Ele dá a todas as superfícies do scrapup a mesma
aparência a partir de uma stylesheet e de uma biblioteca de componentes.

Status: Beta. A API pode mudar antes da 1.0.

## Instalação

Instale a partir de uma tag Git (o pacote não é publicado no npm):

```bash
npm i github:scrapup/scrapup-ds#v0.1.0 # x-release-please-version
```

Requisitos: Node.js 24 ou superior, React 19 (`react` e `react-dom` são peer dependencies).
O pacote faz o próprio build na instalação (`prepare`).

### Scripts de instalação

Como o pacote é instalado a partir do Git, o npm executa o script `prepare` para gerar `dist/`.

- O npm 11 exibe um aviso `allow-scripts` para `@scrapup/ds`. Nas versões atuais do npm o aviso é
  apenas consultivo e o build continua a rodar; o npm informa que uma versão futura bloqueará scripts
  de instalação não revisados. Aprove o pacote uma vez para registrá-lo no seu `package.json`
  (`allowScripts`, fixado no commit instalado):

```bash
npm approve-scripts @scrapup/ds
```

- Com scripts de instalação desativados (`--ignore-scripts` ou `ignore-scripts=true`), `dist/` não é
  gerado e o pacote não pode ser importado. Permita os scripts deste pacote, ou instale sem essa flag.

## Uso

Importe a stylesheet uma vez, na entrada da aplicação, e depois use os componentes:

```tsx
import '@scrapup/ds/styles.css';
import { Button, Panel } from '@scrapup/ds';

export function Example() {
  return (
    <Panel variant="strong">
      <Button>JOIN THE WAITLIST ↗</Button>
    </Panel>
  );
}
```

| Entrada | Conteúdo |
|---|---|
| `@scrapup/ds` | Componentes React e seus tipos TypeScript |
| `@scrapup/ds/styles.css` | Webfonts, tokens, estilos base e estilos dos componentes |
| `@scrapup/ds/tokens.css` | Apenas tokens (custom properties) e keyframes da marca: sem fontes, sem estilos base ou de componentes |
| `@scrapup/ds/assets/*` | Assets da marca (logos) |

## Componentes

| Grupo | Componentes |
|---|---|
| brand | `Wordmark`, `Backdrop` |
| actions | `Button`, `LangSwitch` |
| navigation | `TopBar`, `Footer` |
| content | `Hero`, `SectionHeader`, `Eyebrow`, `StatusPill`, `Callout`, `Tag`, `CodeChip`, `FlowLine` |
| surfaces | `Panel`, `StatCard`, `FeatureCard`, `StatementList`, `ValueStatement` |
| process | `MilestoneAxis`, `PhaseSteps` |
| forms | `WaitlistForm` |
| feedback | `GlitchCode` |

As props e variantes de cada componente estão documentadas nos seus tipos TypeScript e no catálogo
local (veja Catálogo local abaixo).

## Tema de acento

O acento primário é o neon (`--su-neon`). Sobrescreva `--accent` em `:root` para retingir o sistema:

```css
:root {
  --accent: var(--su-cyan);
}
```

Aplique a sobrescrita em `:root`, não em uma subárvore. Os tokens derivados (`--glow-*`, `--shadow-*`,
`--border-accent*`, `--surface-accent-*`) são declarados em `:root` e resolvem `--accent` ali; uma
sobrescrita em subárvore muda `--accent`, mas não os tokens derivados.

## Assets

Os assets da marca são distribuídos em `assets/logos/` e exportados como `@scrapup/ds/assets/logos/<file>`:

| Arquivo | Uso |
|---|---|
| `scrapup-wordmark-dark.png`, `scrapup-wordmark-light.png` | Wordmark sobre fundo escuro / claro |
| `scrapup-wordmark.gif`, `scrapup-square.gif` | Wordmark animado / marca quadrada |
| `scrapup-avatar.png` | Avatar e tile de ícone de app |
| `scrapup-favicon.png` | Favicon |
| `scrapup-social.png` | Preview social |

```tsx
import wordmark from '@scrapup/ds/assets/logos/scrapup-wordmark-dark.png';
```

## Animações

As animações fazem parte da marca e vêm ligadas por padrão. Elas não seguem a preferência de
movimento reduzido do utilizador; cada componente animado oferece uma propriedade para renderização estática:

| Componente | Propriedade |
|---|---|
| `Wordmark` | `flicker={false}` |
| `GlitchCode` | `animated={false}` |
| `Backdrop` | `scanlines={false}` |

## Regras da marca

- Cantos retos. Exceções: dots de status e tiles de avatar/ícone de app.
- Hairlines de 1px com tom ciano; bordas tracejadas significam "não é nosso / ainda não".
- Sem backdrop blur, sem emoji; glifos unicode servem como ícones.
- O nome do produto é sempre em minúsculas: **scrapup**.
- Use o componente de wordmark ou os assets distribuídos; nunca redesenhe o wordmark.
- Estilize apenas com tokens: sem estilos inline, sem cores fora da paleta.

## Fontes e privacidade

`styles.css` carrega Space Grotesk, IBM Plex Sans, IBM Plex Mono e Noto Sans JP do Google Fonts.
Cada pilha de fontes tem fallback local, então a página continua a renderizar quando a requisição é bloqueada.

- O navegador busca as fontes em `fonts.googleapis.com` e `fonts.gstatic.com`, o que expõe o
  endereço IP do visitante ao Google. Trate isso no seu aviso de privacidade, ou use `tokens.css` e
  sirva as fontes você mesmo.
- Com Content Security Policy, permita `style-src https://fonts.googleapis.com` e
  `font-src https://fonts.gstatic.com`.
- Hints de preconnect opcionais:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
```

## WaitlistForm

`WaitlistForm` é apresentacional: valida o e-mail, chama `onSubmit` e renderiza os estados idle,
submitting, success e error. Ele nunca envia, armazena ou registra dados. O consumidor é responsável por:

- a requisição, o seu timeout, o log de erros, a validação no servidor, rate limiting e medidas anti-bot;
- a base legal e a finalidade do tratamento, o consentimento quando exigido, a retenção e os direitos do titular;
- o aviso de privacidade no ponto de coleta (passe-o pela propriedade `note`).

```tsx
<WaitlistForm
  note={<a href="/privacy">How we use your e-mail</a>}
  onSubmit={async (email) => {
    const response = await fetch('/api/waitlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    if (!response.ok) throw new Error(`Waitlist request failed: ${response.status}`);
  }}
/>
```

## Catálogo local

O catálogo (Storybook) roda apenas localmente:

```bash
npm ci
npm run storybook
```

Ele abre em `http://localhost:6006`.

## Releases

O versionamento é automatizado pelo release-please a partir dos títulos de PR em Conventional Commits
(squash merge): `fix:` gera um patch, `feat:` uma versão minor (enquanto abaixo de 1.0). Cada release
cria uma tag `vX.Y.Z`, uma GitHub Release e uma entrada no `CHANGELOG.md`. Veja [CONTRIBUTING.md](CONTRIBUTING.md).

## Licença

[MIT](LICENSE) © 2026 scrapup
