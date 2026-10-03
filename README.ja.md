# scrapup-ds

[English](README.md) | [Português](README.pt.md) | **日本語**

`@scrapup/ds` は **scrapup** のデザインシステムです。ブランドトークン、ブランドアセット、23 個の React
コンポーネントを、scrapup のデザインプロジェクトから移植して提供します。1 つのスタイルシートと 1 つの
コンポーネントライブラリで、scrapup のすべての画面に同じ外観を与えます。

ステータス: ベータ。1.0 までに API が変わる可能性があります。

## インストール

Git タグからインストールします(パッケージは npm に公開されていません):

```bash
npm i github:scrapup/scrapup-ds#v0.1.0 # x-release-please-version
```

要件: Node.js 24 以上、React 19(`react` と `react-dom` は peer dependencies)。
パッケージはインストール時に自動でビルドされます(`prepare`)。

## 使い方

アプリのエントリでスタイルシートを 1 回だけ import し、コンポーネントを使います:

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

| エントリ | 内容 |
|---|---|
| `@scrapup/ds` | React コンポーネントとその TypeScript 型 |
| `@scrapup/ds/styles.css` | Web フォント、トークン、ベーススタイル、コンポーネントスタイル |
| `@scrapup/ds/tokens.css` | トークン(カスタムプロパティ)とブランドのキーフレームのみ。フォント、ベーススタイル、コンポーネントスタイルは含みません |
| `@scrapup/ds/assets/*` | ブランドアセット(ロゴ) |

## コンポーネント

| グループ | コンポーネント |
|---|---|
| brand | `Wordmark`, `Backdrop` |
| actions | `Button`, `LangSwitch` |
| navigation | `TopBar`, `Footer` |
| content | `Hero`, `SectionHeader`, `Eyebrow`, `StatusPill`, `Callout`, `Tag`, `CodeChip`, `FlowLine` |
| surfaces | `Panel`, `StatCard`, `FeatureCard`, `StatementList`, `ValueStatement` |
| process | `MilestoneAxis`, `PhaseSteps` |
| forms | `WaitlistForm` |
| feedback | `GlitchCode` |

各コンポーネントの props とバリアントは、TypeScript の型とローカルカタログ(後述の「ローカルカタログ」)に記載されています。

## アクセントのテーマ

プライマリアクセントはネオン(`--su-neon`)です。`:root` で `--accent` を上書きすると、システム全体の色味が変わります:

```css
:root {
  --accent: var(--su-cyan);
}
```

上書きはサブツリーではなく `:root` に設定してください。派生トークン(`--glow-*`、`--shadow-*`、
`--border-accent*`、`--surface-accent-*`)は `:root` で宣言され、そこで `--accent` を解決します。
サブツリーで上書きすると `--accent` は変わりますが、派生トークンは変わりません。

## アセット

ブランドアセットは `assets/logos/` に含まれ、`@scrapup/ds/assets/logos/<file>` としてエクスポートされます:

| ファイル | 用途 |
|---|---|
| `scrapup-wordmark-dark.png`, `scrapup-wordmark-light.png` | 暗い背景 / 明るい背景用のワードマーク |
| `scrapup-wordmark.gif`, `scrapup-square.gif` | アニメーションのワードマーク / 正方形のマーク |
| `scrapup-avatar.png` | アバターとアプリアイコンのタイル |
| `scrapup-favicon.png` | ファビコン |
| `scrapup-social.png` | ソーシャルプレビュー |

```tsx
import wordmark from '@scrapup/ds/assets/logos/scrapup-wordmark-dark.png';
```

## アニメーション

アニメーションはブランドの一部で、デフォルトで有効です。ユーザーの「視差効果を減らす」設定には
従いません。アニメーションするコンポーネントには、静的に表示するためのプロパティがあります:

| コンポーネント | プロパティ |
|---|---|
| `Wordmark` | `flicker={false}` |
| `GlitchCode` | `animated={false}` |
| `Backdrop` | `scanlines={false}` |

## ブランドルール

- 角は直角。例外: ステータスドット、アバター / アプリアイコンのタイル。
- シアン系の 1px ヘアライン。破線のボーダーは「自分たちのものではない / まだない」を意味します。
- 背景のぼかしなし、絵文字なし。アイコンには Unicode のグリフを使います。
- 製品名は常に小文字: **scrapup**。
- ワードマークのコンポーネントか同梱のアセットを使い、ワードマークを描き直さないでください。
- スタイルはトークンのみで指定します。インラインスタイルやパレット外の色は使いません。

## フォントとプライバシー

`styles.css` は Space Grotesk、IBM Plex Sans、IBM Plex Mono、Noto Sans JP を Google Fonts から読み込みます。
各フォントスタックにはローカルのフォールバックがあるため、リクエストがブロックされてもページは表示されます。

- ブラウザは `fonts.googleapis.com` と `fonts.gstatic.com` からフォントを取得するため、訪問者の IP
  アドレスが Google に送られます。プライバシーポリシーで扱うか、`tokens.css` を使ってフォントを自分で配信してください。
- Content Security Policy を使う場合は、`style-src https://fonts.googleapis.com` と
  `font-src https://fonts.gstatic.com` を許可してください。
- 任意の preconnect ヒント:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
```

## WaitlistForm

`WaitlistForm` は表示専用のコンポーネントです。メールアドレスを検証し、`onSubmit` を呼び出し、
idle、submitting、success、error の各状態を表示します。データの送信、保存、ログ記録は一切行いません。利用者が責任を持つもの:

- リクエスト、そのタイムアウト、エラーのログ、サーバー側の検証、レート制限、ボット対策;
- 処理の法的根拠と目的、必要な場合の同意、保持期間、データ主体の権利;
- 収集時点でのプライバシー通知(`note` プロパティで渡します)。

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

## ローカルカタログ

カタログ(Storybook)はローカルでのみ動作します:

```bash
npm ci
npm run storybook
```

`http://localhost:6006` で開きます。

## リリース

バージョン管理は、Conventional Commits 形式の PR タイトル(squash merge)から release-please が自動で行います。
`fix:` はパッチ、`feat:` はマイナーバージョンをリリースします(1.0 未満の間)。各リリースで `vX.Y.Z`
タグ、GitHub Release、`CHANGELOG.md` のエントリが作成されます。[CONTRIBUTING.md](CONTRIBUTING.md) を参照してください。

## ライセンス

[MIT](LICENSE) © 2026 scrapup
