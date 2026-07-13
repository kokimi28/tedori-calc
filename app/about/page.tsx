import type { Metadata } from "next";
import Link from "next/link";
import { LAW_CHECKED_AT } from "@/lib/site";

export const metadata: Metadata = {
  title: "このサイトについて",
  description:
    "退職金の税金計算シミュレーターの計算方針・法令確認日・運営について。表示される金額はあくまで参考値です。",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <article className="prose-jp max-w-none">
      <h1 className="text-2xl font-bold text-slate-900">このサイトについて</h1>

      <div className="mt-6 space-y-4 text-slate-700">
        <p>
          「退職金の税金計算シミュレーター」は、退職金にかかる所得税・復興特別所得税・住民税を、退職金の額と勤続年数を入力するだけで概算できる無料ツールです。会員登録は不要で、入力した数値はサーバーへ送信・保存されません（すべてブラウザ内で計算されます）。
        </p>

        <h2 className="text-xl font-bold text-slate-900">計算の方針</h2>
        <p>本ツールは、次の考え方にもとづいて退職所得の税額を計算しています。</p>
        <ul className="list-disc space-y-1 pl-6">
          <li>退職所得控除（勤続20年までは1年40万円・最低80万円、20年超は1年70万円、障害退職は+100万円）</li>
          <li>原則2分の1課税（特定役員退職手当等・短期退職手当等の特例に対応）</li>
          <li>所得税の速算表 ＋ 復興特別所得税（所得税額の2.1%）</li>
          <li>住民税（分離課税・特別徴収、市町村民税6%＋道府県民税4%）</li>
          <li>「退職所得の受給に関する申告書」を提出済みの前提</li>
        </ul>
        <p>
          法令の最終確認日は <strong>{LAW_CHECKED_AT}</strong> です。税制改正により内容が変わることがあります。
        </p>

        <h2 className="text-xl font-bold text-slate-900">ご利用にあたって</h2>
        <p>
          表示される金額は<strong>あくまで参考値</strong>です。実際の税額・端数処理は勤務先や自治体、個別の事情により異なります。正確な金額は勤務先の担当部署・税務署・税理士等の専門家にご確認ください。詳しくは
          <Link href="/disclosure" className="text-brand-dark underline underline-offset-2">
            免責事項・広告表記
          </Link>
          をご覧ください。
        </p>
      </div>
    </article>
  );
}
