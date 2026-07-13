import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "プライバシーポリシー",
  description:
    "退職金の税金計算シミュレーターのプライバシーポリシー。アクセス解析（Google Analytics）とアフィリエイトプログラムの利用について記載しています。",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <article className="prose-jp max-w-none text-slate-700">
      <h1 className="text-2xl font-bold text-slate-900">プライバシーポリシー</h1>

      <div className="mt-6 space-y-6">
        <section>
          <h2 className="text-lg font-bold text-slate-900">入力データの取り扱い</h2>
          <p className="mt-2">
            当サイトの計算ツールに入力された退職金額・勤続年数などの数値は、ご利用者のブラウザ内でのみ処理され、当サイトのサーバーへ送信・保存されることはありません。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-900">アクセス解析について</h2>
          <p className="mt-2">
            当サイトでは、サービス改善のため Google LLC が提供するアクセス解析ツール「Google
            アナリティクス」を利用する場合があります。Google
            アナリティクスはクッキー（Cookie）を使用して匿名のトラフィックデータを収集します。個人を特定する情報は含まれません。ブラウザの設定でクッキーを無効にすることで、データの収集を拒否できます。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-900">広告・アフィリエイトについて</h2>
          <p className="mt-2">
            当サイトは、第三者が提供するアフィリエイトプログラム（広告）を利用する場合があります。これらの広告配信事業者は、ユーザーの興味に応じた広告を表示するためにクッキーを使用することがあります。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-900">免責事項</h2>
          <p className="mt-2">
            当サイトの計算結果および掲載情報は、情報提供を目的とした参考値であり、正確性・完全性を保証するものではありません。ご利用によって生じた損害について、当サイトは一切の責任を負いかねます。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-900">改定について</h2>
          <p className="mt-2">
            本ポリシーは、必要に応じて予告なく改定することがあります。改定後の内容は当ページに掲載した時点で効力を生じます。
          </p>
        </section>
      </div>
    </article>
  );
}
