/**
 * Google Analytics 4（gtag.js）。
 *
 * next/script は使わない（重要）。next/script は strategy に関わらず gtag を
 * クライアント側で body に注入するため、静的HTMLの <head> にスニペットが載らない。
 * Search Console の「Google アナリティクス」所有権確認は
 * 「トラッキングコードが <body> ではなく <head> セクションにあること」を要件とするため、
 * 素の <script> を layout.tsx の <head> 内に直接描画する。
 *
 * NEXT_PUBLIC_GA_MEASUREMENT_ID はビルド時にインライン化される公開値（Vercel で Sensitive=OFF）。
 * 未設定ならタグを出力しない（ローカル開発やプレビューで無害）。
 */
export default function Analytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  if (!gaId) return null;

  return (
    <>
      <script async src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} />
      <script
        dangerouslySetInnerHTML={{
          __html: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${gaId}');`,
        }}
      />
    </>
  );
}
