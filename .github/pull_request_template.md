# 概要 / What

<!-- この PR は何か（1〜2文） -->

Closes #

## 変更点 / Changes

-

## 検証 / Verification

- [ ] `npm run typecheck` green
- [ ] `npm run test`（境界値・計算ロジック）green
- [ ] `npm run build` 成功
- [ ] UI 変更あり → `node scripts/verify-ui-remote.mjs <URL...>`（またはローカル Playwright MCP）で該当ページを実機確認した / UI 変更なし

## 未検証項目 / Not verified

<!-- 実行環境の制約（リモートセッション: secrets 不在・外部疎通遮断・MCP 不在等）で実行できなかった検証を列挙する。全部実行できたら「なし」と書く -->

- なし

## スコープ確認 / Scope

- [ ] CLAUDE.md「最優先の規約」の禁止リスト（永続化・認証・localStorage・LLM API・重量級ライブラリ・WebSocket/SSE・決済）に抵触していない
- [ ] 収益導線（`lib/affiliate.ts` の `enabled` / `url`）に触れていない（触れる場合はオーナーの Vercel Pro 移行判断＝STOP を経ている）
- [ ] 料率・控除の変更あり → `lib/calculations.ts` の料率コメント最終確認日・`lib/site.ts` の `LAW_CHECKED_AT`・境界値テストを更新した / 料率変更なし
