import type { Metadata } from "next";
import { FAQ_ITEMS } from "@/lib/faq";

export const metadata: Metadata = {
  title: "よくある質問",
  description:
    "退職金の税金・退職所得控除・確定申告の要否など、退職金にかかる税金についてよくある質問と回答をまとめました。",
  alternates: { canonical: "/faq" },
};

export default function FaqPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <article className="max-w-none">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <h1 className="text-2xl font-bold text-slate-900">よくある質問</h1>
      <dl className="mt-6 space-y-4">
        {FAQ_ITEMS.map((item) => (
          <div key={item.question} className="rounded-xl border border-slate-200 bg-white p-5">
            <dt className="font-semibold text-slate-800">{item.question}</dt>
            <dd className="mt-2 text-slate-600">{item.answer}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-6 text-xs text-slate-400">
        回答は一般的な情報提供を目的としたものであり、個別の税務相談に代わるものではありません。
      </p>
    </article>
  );
}
