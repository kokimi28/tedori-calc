import type { Metadata } from "next";
import Link from "next/link";
import { LAW_CHECKED_AT } from "@/lib/site";

export const metadata: Metadata = {
  title: "このサイトについて",
  description:
    "年収の手取り計算シミュレーターの計算方針・料率の確認日・運営について。表示される金額はあくまで概算・参考値です。",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <article className="prose-jp max-w-none">
      <h1 className="text-2xl font-bold text-slate-900">このサイトについて</h1>

      <div className="mt-6 space-y-4 text-slate-700">
        <p>
          「年収の手取り計算シミュレーター」は、年収（額面）から社会保険料・所得税・住民税を差し引いた手取り額を概算できる無料ツールです。会員登録は不要で、入力した数値はサーバーへ送信・保存されません（すべてブラウザ内で計算されます）。
        </p>

        <h2 className="text-xl font-bold text-slate-900">計算の前提</h2>
        <p>本ツールは、次の前提で手取りを概算しています。</p>
        <ul className="list-disc space-y-1 pl-6">
          <li>会社員（協会けんぽ・一般の事業）で扶養家族なし</li>
          <li>社会保険料：健康保険（従業員5%）・厚生年金（9.15%）・雇用保険（0.6%）、40〜64歳は介護保険（0.795%）を加算</li>
          <li>給与所得控除・基礎控除は令和7年度税制改正後（令和7〜8年分）の金額</li>
          <li>所得税（速算表＋復興特別所得税2.1%）／住民税（所得割10%＋均等割）</li>
          <li>社会保険料は標準報酬月額の等級表を用いない年収ベースの概算</li>
        </ul>
        <p>
          料率・控除額の最終確認日は <strong>{LAW_CHECKED_AT}</strong> です。健康保険料率は都道府県で異なり、料率・控除は毎年改定されます。
        </p>

        <h2 className="text-xl font-bold text-slate-900">ご利用にあたって</h2>
        <p>
          表示される金額は<strong>あくまで概算・参考値</strong>です。実際の手取りは勤務先・自治体・扶養状況・各種控除により異なります。正確な金額は勤務先の給与担当や自治体、税理士等にご確認ください。詳しくは
          <Link href="/disclosure" className="text-brand-dark underline underline-offset-2">
            免責事項・広告表記
          </Link>
          をご覧ください。
        </p>
      </div>
    </article>
  );
}
