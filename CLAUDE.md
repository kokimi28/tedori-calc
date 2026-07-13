# CLAUDE.md — tedori-calc（年収の手取り計算ツール）

「単機能ツール工場（Tool Factory）」の1本。静的な日本語税務系の計算ツール。**SEO＋アフィリエイトで収益化**する。intake は dev-env Issue #4。

> 経緯: 当初 `taishoku-zei-calc`（退職金）で構築 → 既存の公開済み `retirement-tax-sim`（S001）と重複していたためリネーム転用。**新規ツールを作る前に必ず既存リポ（inventory / `gh repo list`）と重複チェックする**（この失敗を繰り返さない）。

## 最優先の規約（この規約が他のあらゆる記載に優先する）

本サイトは**静的な計算ツール**。永続化なし・サーバー秘密なし。

- **スタック固定**：Next.js 14 App Router + TypeScript + Tailwind。ホスティングは **Vercel 無料枠のみ**。
- 状態は **useState / useReducer のみ**。

### 禁止（提案も却下する）
- DB / Neon / Supabase / あらゆる永続化
- 認証・会員機能・管理画面
- **localStorage / sessionStorage**
- 本番での OpenAI / Anthropic 等の LLM API 呼び出し
- 重量級ライブラリ（D3 / Three.js / チャート系の大物 等）
- WebSocket / SSE
- 決済・課金機能

### secrets / 環境変数
- 扱うのは公開値 **`NEXT_PUBLIC_GA_MEASUREMENT_ID` の1つだけ**（ビルド時インライン化されるため Vercel で **Sensitive=OFF**）。
- **Doppler は使わない**。サーバー秘密を増やさない。値には触れず名前のみ扱う。

## 開発フェーズの順序（崩さない）

1. `lib/calculations.ts` … **料率・法的根拠コメント＋最終確認日＋境界値の単体テスト必須**（`lib/calculations.test.ts`）。
2. 最小 UI（`components/Calculator.tsx` 他）。
3. CTA（`components/CTA.tsx` / `lib/affiliate.ts`）… アフィリ表記ルール厳守（下記）。
4. SEO（title / meta / OGP / JSON-LD / sitemap / robots / canonical / H1 に KW / img alt）。
5. about / faq / privacy / disclosure。
6. デプロイ → Search Console → 記事（`lib/articles.ts` に追記・後追い可）。

### アフィリエイト（CTA）ルール
- リンクは `rel="sponsored nofollow"` かつ `target="_blank" rel="noopener noreferrer"`。
- **PR・広告**表記を必ず出す。**1ページ3本まで**。
- 計算結果には必ず「**※あくまで概算・参考値です**」を添える。
- ASP の案件 URL 未取得の間は `lib/affiliate.ts` の `enabled:false` のままにする＝CTA は非表示で先行公開できる。URL 取得後に `url` を埋め `enabled:true`。

### 計算ロジックの鉄則
- 金額は**整数（円）で計算**する。`× 1.021` のような浮動小数点はズレる（`× 1021 / 1000` を使う）。端数処理は法令どおり（課税所得は1000円未満切捨、住民税所得割は100円未満切捨、所得税等は1円未満切捨）。
- 社会保険料は標準報酬月額の等級表を用いない**年収ベースの概算**（扶養なし・協会けんぽ・一般の事業前提）。精緻化（等級表・都道府県別料率・扶養）は後追い。
- **料率・控除は毎年改定される**。改定時は `lib/calculations.ts` の定数・各コメントの最終確認日・`LAW_CHECKED_AT` を必ず更新。変更したら必ず `npm run test`。

## 過去パターン警告（このリポで繰り返しがちな失敗）

- **完璧主義 → 即デプロイで打ち消す**：完成度50%でも公開する。公開遅延を作らない。
- **機能拡張欲求 → 業務SaaS化の入口**：入力保存・比較機能・アカウント・ダッシュボード等を作りたくなったら止まる。本ラインは単機能ツールの量産であって SaaS ではない。
- **データ永続化 → 禁止を再確認**：「便利だから保存」は禁止。状態は useState/useReducer のみ、サーバーへ送らない。
- **重複量産 → 着手前に既存リポと照合**：新ツール提案の前に `gh repo list` / dev-env inventory を確認（本リポがこの失敗の当事者）。

## 運用

- 進捗・質問・👤依頼・完了報告は dev-env **Issue #4** のコメントに集約する。
- コミットは小さく、差分と根拠を残す。CI（`npm run test` ＋ `npm run build`）green を確認してからマージ。
- Windows: git は `"C:\Program Files\Git\cmd\git.exe"`、`npm install` は `--include=dev`。
