import type { SeveranceResult } from "@/lib/calculations";
import { yen } from "@/lib/format";

function Row({
  label,
  value,
  strong = false,
  sub,
}: {
  label: string;
  value: string;
  strong?: boolean;
  sub?: string;
}) {
  return (
    <div className="flex items-baseline justify-between gap-3 py-2">
      <span className={strong ? "text-sm font-semibold text-slate-700" : "text-sm text-slate-600"}>
        {label}
        {sub ? <span className="ml-1 text-xs text-slate-400">{sub}</span> : null}
      </span>
      <span
        className={
          strong
            ? "text-lg font-bold tabular-nums text-slate-900"
            : "tabular-nums text-slate-800"
        }
      >
        {value}
      </span>
    </div>
  );
}

export default function ResultDisplay({ result }: { result: SeveranceResult }) {
  const {
    serviceYearsCounted,
    retirementDeduction,
    incomeAfterDeduction,
    taxableRetirementIncome,
    incomeTax,
    reconstructionTax,
    residentTax,
    totalTax,
    takeHome,
    isSpecialOfficer,
    isShortTerm,
  } = result;

  return (
    <section
      className="rounded-2xl border border-brand/20 bg-brand/5 p-6"
      aria-label="計算結果"
      aria-live="polite"
    >
      <h2 className="mb-1 text-lg font-bold text-slate-800">計算結果</h2>
      <p className="mb-4 text-xs text-slate-500">※あくまで参考値です。実際の税額は勤務先・自治体・個別事情により異なります。</p>

      <div className="mb-4 rounded-xl bg-white p-4 shadow-sm">
        <div className="flex items-baseline justify-between">
          <span className="text-sm font-semibold text-slate-700">税額の合計（概算）</span>
          <span className="text-2xl font-bold tabular-nums text-brand-dark">{yen(totalTax)}</span>
        </div>
        <div className="mt-2 flex items-baseline justify-between border-t border-slate-100 pt-2">
          <span className="text-sm text-slate-600">手取り額の目安</span>
          <span className="text-xl font-bold tabular-nums text-slate-900">{yen(takeHome)}</span>
        </div>
      </div>

      <div className="divide-y divide-slate-200">
        <Row label="勤続年数（切り上げ後）" value={`${serviceYearsCounted} 年`} />
        <Row label="退職所得控除額" value={yen(retirementDeduction)} />
        <Row label="控除後の金額" value={yen(incomeAfterDeduction)} />
        <Row label="課税退職所得金額" value={yen(taxableRetirementIncome)} />
        <Row label="所得税" value={yen(incomeTax)} />
        <Row label="復興特別所得税" sub="所得税の2.1%" value={yen(reconstructionTax)} />
        <Row label="住民税" sub="市6%＋県4%" value={yen(residentTax)} />
        <Row label="税額の合計" value={yen(totalTax)} strong />
      </div>

      {(isSpecialOfficer || isShortTerm) && (
        <p className="mt-4 rounded-lg bg-amber-50 p-3 text-xs text-amber-800">
          {isSpecialOfficer
            ? "役員等で勤続5年以下のため「特定役員退職手当等」として、2分の1課税が適用されていません。"
            : "勤続5年以下のため「短期退職手当等」として、控除後300万円を超える部分には2分の1課税が適用されていません。"}
        </p>
      )}

      <p className="mt-4 text-xs text-slate-500">
        「退職所得の受給に関する申告書」を勤務先へ提出している前提で計算しています。未提出の場合は退職金の額に一律20.42%が源泉徴収され、計算が異なります。
      </p>
    </section>
  );
}
