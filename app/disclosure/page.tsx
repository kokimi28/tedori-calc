import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "免責事項・広告表記",
  description:
    "年収の手取り計算シミュレーターの免責事項と広告（アフィリエイト）表記。計算結果は概算・参考値であり、税務上の助言ではありません。",
  alternates: { canonical: "/disclosure" },
};

export default function DisclosurePage() {
  return (
    <article className="prose-jp max-w-none text-slate-700">
      <h1 className="text-2xl font-bold text-slate-900">免責事項・広告表記</h1>

      <div className="mt-6 space-y-6">
        <section>
          <h2 className="text-lg font-bold text-slate-900">免責事項</h2>
          <p className="mt-2">
            当サイトが提供する計算ツールおよび記事は、給与の手取り・税金・社会保険料に関する<strong>一般的な情報提供</strong>を目的としています。計算結果は<strong>あくまで概算・参考値</strong>であり、実際の手取り額・税額・社会保険料は、勤務先・自治体・扶養状況・各種控除により異なります。
          </p>
          <p className="mt-2">
            当サイトの内容は税理士法に基づく税務相談・税務代理ではなく、個別の税務判断を行うものではありません。正確な金額や手続きについては、勤務先の給与担当部署、お住まいの自治体、または税理士等の専門家にご確認ください。当サイトの情報の利用によって生じたいかなる損害についても、運営者は責任を負いかねます。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-900">広告（アフィリエイト）表記</h2>
          <p className="mt-2">
            当サイトは、第三者が提供するアフィリエイトプログラムに参加し、商品・サービスを紹介することで収益を得る場合があります。「PR・広告」と表示された箇所にはアフィリエイトリンクが含まれます。
          </p>
          <p className="mt-2">
            広告の掲載は当サイトの判断によるものであり、<strong>計算結果や記事の内容が広告主によって左右されることはありません</strong>。また、リンク先の商品・サービスの内容や取引については、各提供事業者の規約・表示をご確認ください。
          </p>
        </section>
      </div>
    </article>
  );
}
