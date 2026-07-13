"use client";

import { useMemo, useReducer } from "react";
import { calculateSeveranceTax, type SeveranceInput } from "@/lib/calculations";
import ResultDisplay from "@/components/ResultDisplay";
import CTA from "@/components/CTA";

type State = {
  severancePay: string;
  serviceYears: string;
  serviceMonths: string;
  isDisability: boolean;
  isBoardMember: boolean;
};

type Action =
  | { type: "set"; field: keyof State; value: string | boolean }
  | { type: "reset" };

const initialState: State = {
  severancePay: "20000000",
  serviceYears: "30",
  serviceMonths: "0",
  isDisability: false,
  isBoardMember: false,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "set":
      return { ...state, [action.field]: action.value };
    case "reset":
      return initialState;
    default:
      return state;
  }
}

/** 全角数字→半角、数字以外を除去して非負整数に */
function toInt(raw: string): number {
  const half = raw.replace(/[０-９]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xfee0));
  const digits = half.replace(/[^0-9]/g, "");
  const n = parseInt(digits, 10);
  return Number.isFinite(n) ? n : 0;
}

export default function Calculator() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const input: SeveranceInput = useMemo(
    () => ({
      severancePay: toInt(state.severancePay),
      serviceYears: toInt(state.serviceYears),
      serviceMonths: Math.min(11, toInt(state.serviceMonths)),
      isDisability: state.isDisability,
      isBoardMember: state.isBoardMember,
    }),
    [state],
  );

  const result = useMemo(() => calculateSeveranceTax(input), [input]);

  const setField = (field: keyof State) => (value: string | boolean) =>
    dispatch({ type: "set", field, value });

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <form
        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        aria-label="退職金の税金計算フォーム"
        onSubmit={(e) => e.preventDefault()}
      >
        <h2 className="mb-4 text-lg font-bold text-slate-800">条件を入力</h2>

        <div className="space-y-5">
          <div>
            <label htmlFor="severancePay" className="mb-1 block text-sm font-medium text-slate-700">
              退職金の額（源泉徴収前・円）
            </label>
            <input
              id="severancePay"
              inputMode="numeric"
              autoComplete="off"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-right text-lg tabular-nums focus:border-brand focus:ring-2 focus:ring-brand/30"
              value={state.severancePay}
              onChange={(e) => setField("severancePay")(e.target.value)}
            />
            <p className="mt-1 text-right text-xs text-slate-500">
              {toInt(state.severancePay).toLocaleString("ja-JP")} 円
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="serviceYears" className="mb-1 block text-sm font-medium text-slate-700">
                勤続年数（年）
              </label>
              <input
                id="serviceYears"
                inputMode="numeric"
                autoComplete="off"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-right tabular-nums focus:border-brand focus:ring-2 focus:ring-brand/30"
                value={state.serviceYears}
                onChange={(e) => setField("serviceYears")(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="serviceMonths" className="mb-1 block text-sm font-medium text-slate-700">
                端数（月・0〜11）
              </label>
              <input
                id="serviceMonths"
                inputMode="numeric"
                autoComplete="off"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-right tabular-nums focus:border-brand focus:ring-2 focus:ring-brand/30"
                value={state.serviceMonths}
                onChange={(e) => setField("serviceMonths")(e.target.value)}
              />
            </div>
          </div>
          <p className="text-xs text-slate-500">
            1か月でも端数があれば勤続年数は1年に切り上げて計算します。
          </p>

          <fieldset className="space-y-3">
            <legend className="text-sm font-medium text-slate-700">該当する場合はチェック</legend>
            <label className="flex items-start gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                className="mt-0.5 h-4 w-4 rounded border-slate-300 text-brand focus:ring-brand/30"
                checked={state.isDisability}
                onChange={(e) => setField("isDisability")(e.target.checked)}
              />
              <span>障害者になったことが直接の原因で退職した（控除額に+100万円）</span>
            </label>
            <label className="flex items-start gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                className="mt-0.5 h-4 w-4 rounded border-slate-300 text-brand focus:ring-brand/30"
                checked={state.isBoardMember}
                onChange={(e) => setField("isBoardMember")(e.target.checked)}
              />
              <span>役員等である（勤続5年以下だと2分の1課税の対象外）</span>
            </label>
          </fieldset>

          <button
            type="button"
            className="text-sm text-slate-500 underline underline-offset-2 hover:text-slate-700"
            onClick={() => dispatch({ type: "reset" })}
          >
            入力をリセット
          </button>
        </div>
      </form>

      <div className="space-y-6">
        <ResultDisplay result={result} />
        <CTA />
      </div>
    </div>
  );
}
