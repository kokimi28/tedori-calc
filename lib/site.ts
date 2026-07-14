/**
 * サイト共通の定数。
 * 本番ドメインが Vercel の既定サブドメインと異なる場合は SITE_URL の1行だけ差し替える。
 */
// 注意: tedori-calc.vercel.app は第三者の同種ツールが占有済み（2026-07-14 確認）。
// Vercel の Project Name を「tedori-keisan」にして import する前提（空きは同日確認済み）。
// 実際の本番ドメインが異なる場合はこの1行だけ差し替える。
export const SITE_URL = "https://tedori-keisan.vercel.app";

export const SITE_NAME = "年収の手取り計算シミュレーター";

/** title 用の短い名称 */
export const SITE_SHORT = "年収の手取り計算";

/** meta description（120〜160字目安） */
export const SITE_DESCRIPTION =
  "年収を入力するだけで、手取り額（年収から社会保険料・所得税・住民税を差し引いた金額）を自動計算。健康保険・厚生年金・雇用保険・介護保険と、令和7年改正後の給与所得控除・基礎控除に対応した無料の手取りシミュレーターです。結果はあくまで概算・参考値です。";

/** 計算ロジックの法令・料率確認日（各ページ末尾に表示） */
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
