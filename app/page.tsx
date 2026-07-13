import type { Metadata } from "next";
import Link from "next/link";
import Calculator from "@/components/Calculator";
import { getAllArticles } from "@/lib/articles";
import { FAQ_ITEMS } from "@/lib/faq";
import { SITE_NAME, SITE_URL, SITE_DESCRIPTION, LAW_CHECKED_AT } from "@/lib/site";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function HomePage() {
  const articles = getAllArticles();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        name: SITE_NAME,
        url: SITE_URL,
        applicationCategory: "FinanceApplication",
        operatingSystem: "Any",
        description: SITE_DESCRIPTION,
        offers: { "@type": "Offer", price: "0", priceCurrency: "JPY" },
        inLanguage: "ja",
      },
      {
        "@type": "FAQPage",
        mainEntity: FAQ_ITEMS.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">
          退職金の税金計算シミュレーター
        </h1>
        <p className="mt-3 text-slate-600">
          退職金の額と勤続年数を入力するだけで、退職金にかかる
          <strong>所得税・復興特別所得税・住民税</strong>と
          <strong>手取り額の目安</strong>を自動で計算します。退職所得控除や2分の1課税、勤続20年の境界、障害退職・役員・短期退職の特例にも対応しています。
        </p>
      </div>

      <Calculator />

      <section className="mt-14" aria-labelledby="how-heading">
        <h2 id="how-heading" className="text-xl font-bold text-slate-900">
          退職金の税金はどう計算する？
        </h2>
        <div className="prose-jp mt-4 space-y-4 text-slate-700">
          <p>
            退職金（退職手当）は、給与や賞与とは分けて「退職所得」として課税されます。長年の勤労に報いる性質があるため、税負担が重くなりすぎないよう次の3ステップで計算します。
          </p>
          <ol className="list-decimal space-y-2 pl-6">
            <li>
              <strong>退職所得控除を差し引く</strong>：勤続20年までは1年40万円（最低80万円）、20年超は1年70万円。障害退職なら+100万円。
            </li>
            <li>
              <strong>残りを2分の1にする</strong>：控除後の金額を原則2分の1にしてから税率を掛けます（役員等で勤続5年以下などの特例を除く）。
            </li>
            <li>
              <strong>所得税・住民税を計算する</strong>：課税退職所得金額に所得税の速算表・復興特別所得税（2.1%）・住民税（原則10%）を適用します。
            </li>
          </ol>
        </div>
      </section>

      <section className="mt-12" aria-labelledby="articles-heading">
        <h2 id="articles-heading" className="text-xl font-bold text-slate-900">
          くわしく知る
        </h2>
        <ul className="mt-4 space-y-3">
          {articles.map((article) => (
            <li key={article.slug}>
              <Link
                href={`/articles/${article.slug}`}
                className="block rounded-xl border border-slate-200 bg-white p-4 transition hover:border-brand hover:bg-brand/5"
              >
                <span className="block font-semibold text-brand-dark">{article.title}</span>
                <span className="mt-1 block text-sm text-slate-600">{article.description}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12" aria-labelledby="faq-heading">
        <h2 id="faq-heading" className="text-xl font-bold text-slate-900">
          よくある質問
        </h2>
        <dl className="mt-4 space-y-4">
          {FAQ_ITEMS.map((item) => (
            <div key={item.question} className="rounded-xl border border-slate-200 bg-white p-4">
              <dt className="font-semibold text-slate-800">{item.question}</dt>
              <dd className="mt-2 text-sm text-slate-600">{item.answer}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-4 text-right text-sm">
          <Link href="/faq" className="text-brand-dark underline underline-offset-2">
            すべての質問を見る →
          </Link>
        </p>
      </section>

      <p className="mt-10 text-xs text-slate-400">
        計算ロジックの法令確認日：{LAW_CHECKED_AT}。税制改正により内容が変わる場合があります。
      </p>
    </>
  );
}
