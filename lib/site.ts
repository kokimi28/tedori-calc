/**
 * サイト共通の定数。
 * 本番ドメインが Vercel の既定サブドメインと異なる場合は SITE_URL の1行だけ差し替える。
 */
export const SITE_URL = "https://taishoku-zei-calc.vercel.app";

export const SITE_NAME = "退職金の税金計算シミュレーター";

/** title 用の短い名称 */
export const SITE_SHORT = "退職金の税金計算";

/** meta description（120〜160字目安） */
export const SITE_DESCRIPTION =
  "退職金にかかる所得税・復興特別所得税・住民税を、退職金額と勤続年数を入れるだけで自動計算。退職所得控除・2分の1課税・勤続20年の境界・障害退職・役員や短期退職の特例にも対応した無料シミュレーターです。結果はあくまで参考値としてご利用ください。";

/** 計算ロジックの法令確認日（各ページ末尾に表示） */
export const LAW_CHECKED_AT = "2026-07-13";

export const NAV_LINKS = [
  { href: "/", label: "計算ツール" },
  { href: "/about", label: "このサイトについて" },
  { href: "/faq", label: "よくある質問" },
] as const;

export const FOOTER_LINKS = [
  { href: "/about", label: "このサイトについて" },
  { href: "/faq", label: "よくある質問" },
  { href: "/disclosure", label: "免責事項・広告表記" },
  { href: "/privacy", label: "プライバシーポリシー" },
] as const;
