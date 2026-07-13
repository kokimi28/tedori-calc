# 年収の手取り計算シミュレーター（tedori-calc）

年収（額面）から**社会保険料・所得税・住民税**を差し引いた**手取り額（年額・月額・手取り率）**を概算する静的な単機能ツール。SEO＋アフィリエイトで収益化する「単機能ツール工場（Tool Factory）」の1本。

> 経緯: 当初 `taishoku-zei-calc`（退職金）として構築したが、既存の公開済みツール `retirement-tax-sim`（S001）と重複していたため、未保有の「手取り計算」へ差し替え（リポジトリをリネーム転用）。退職金版のロジックは git 履歴に残っています。

## 技術スタック

- Next.js 14（App Router）/ TypeScript / Tailwind CSS
- ホスティング：Vercel 無料枠
- 永続化・サーバー秘密・認証：**なし**（状態は useState/useReducer のみ）

## セットアップ

```bash
npm install --include=dev   # Windows で NODE_ENV=production の場合 devDeps がスキップされるため --include=dev
npm run dev                 # http://localhost:3000
```

## スクリプト

| コマンド | 内容 |
|---|---|
| `npm run dev` | 開発サーバー |
| `npm run build` | 本番ビルド（型チェック含む） |
| `npm run test` | 計算ロジックの境界値テスト（Vitest） |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | `next lint` |

## 構成

```
app/            画面（page=計算ツール, about/faq/privacy/disclosure, articles/[slug]）＋ sitemap.ts / robots.ts
components/     Calculator（client）/ ResultDisplay / CTA / Analytics
lib/            calculations（手取りロジック＋テスト）/ affiliate / articles / faq / site / format
```

## 環境変数

| 変数 | 用途 | 備考 |
|---|---|---|
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | GA4 計測 ID | 公開値・ビルド時インライン化。Vercel で **Sensitive=OFF**。未設定なら GA タグは出力されない |

## 計算ロジックについて

`lib/calculations.ts` に料率・控除の出典と最終確認日をコメントで明記。金額は整数（円）で計算し、法令どおりの端数処理を行う。社会保険料は標準報酬月額の等級表を用いない年収ベースの**概算**（扶養なし・協会けんぽ前提）。改修時は必ず `npm run test`（境界値テスト）を通すこと。**計算結果はあくまで概算・参考値**であり、税務上の助言ではありません。

詳しい開発規約は [CLAUDE.md](./CLAUDE.md) を参照。
