/**
 * 退職金にかかる税金（所得税・復興特別所得税・住民税）の計算ロジック。
 *
 * ─────────────────────────────────────────────────────────────
 *  法的根拠（最終確認日: 2026-07-13 / 出典はいずれも国税庁・総務省の公表資料）
 * ─────────────────────────────────────────────────────────────
 *  - 退職所得の課税方式（分離課税）: 所得税法 第30条
 *  - 退職所得控除額 / 1/2課税:        所得税法 第30条、国税庁 No.1420「退職金を受け取ったとき（退職所得）」
 *      https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1420.htm
 *  - 特定役員退職手当等（役員等勤続年数5年以下は1/2課税なし）: 所得税法 第30条、国税庁 No.2732
 *      https://www.nta.go.jp/taxes/shiraberu/taxanswer/gensen/2732.htm
 *  - 短期退職手当等（令和4年分以後・役員等以外で勤続5年以下）:  国税庁 No.1420 / No.2725
 *      （収入金額−退職所得控除額）が300万円を超える部分は1/2課税の対象外
 *  - 所得税の速算表（税率・控除額）:  国税庁 No.2260「所得税の税率」
 *      https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/2260.htm
 *  - 復興特別所得税（基準所得税額の2.1%・2013〜2037年）: 復興財源確保法
 *  - 退職所得に係る住民税（分離課税・特別徴収）: 地方税法 第50条の2・第328条
 *      標準税率10%（市町村民税6% + 道府県民税4%）。各100円未満切捨。
 *      ※平成25年1月1日以後に支払われる退職手当等は「10%税額控除」は廃止済み。
 *
 *  前提: 「退職所得の受給に関する申告書」を提出済み（分離課税で正規に計算される場合）。
 *        未提出の場合は収入金額に対して一律20.42%が源泉徴収されるため、本計算とは異なる。
 *
 *  ※ 出力はあくまで参考値。実際の税額・端数処理は勤務先・自治体・個別事情により異なる。
 */

/** ユーザー入力 */
export interface SeveranceInput {
  /** 退職金の収入金額（源泉徴収前・円） */
  severancePay: number;
  /** 勤続年数（年・整数部分） */
  serviceYears: number;
  /** 勤続年数の端数（月・0〜11）。1か月でもあれば1年に切り上げ */
  serviceMonths: number;
  /** 障害者になったことに直接基因して退職したか（控除額+100万円） */
  isDisability: boolean;
  /** 役員等（役員・国会議員・地方議員・公務員等）か */
  isBoardMember: boolean;
}

/** 計算結果（内訳つき） */
export interface SeveranceResult {
  /** 端数切り上げ後の勤続年数（控除計算に用いる年数） */
  serviceYearsCounted: number;
  /** 退職所得控除額 */
  retirementDeduction: number;
  /** 収入金額 − 退職所得控除額（0未満は0） */
  incomeAfterDeduction: number;
  /** 特定役員退職手当等に該当するか（1/2課税なし） */
  isSpecialOfficer: boolean;
  /** 短期退職手当等に該当するか（300万円超部分は1/2課税なし） */
  isShortTerm: boolean;
  /** 課税退職所得金額（1000円未満切捨後） */
  taxableRetirementIncome: number;
  /** 所得税額（復興特別所得税を含まない） */
  incomeTax: number;
  /** 復興特別所得税額 */
  reconstructionTax: number;
  /** 所得税＋復興特別所得税（源泉徴収税額） */
  incomeTaxTotal: number;
  /** 市町村民税 */
  cityTax: number;
  /** 道府県民税 */
  prefTax: number;
  /** 住民税合計（特別徴収） */
  residentTax: number;
  /** 税額合計（所得税＋復興＋住民税） */
  totalTax: number;
  /** 手取り額（収入金額 − 税額合計） */
  takeHome: number;
}

/** 1000円未満切捨 */
const floorTo1000 = (v: number): number => Math.floor(v / 1000) * 1000;
/** 100円未満切捨 */
const floorTo100 = (v: number): number => Math.floor(v / 100) * 100;
/** 負数・NaN を 0 にクランプ */
const clampNonNeg = (v: number): number => (Number.isFinite(v) && v > 0 ? v : 0);

/**
 * 勤続年数を数える（端数切り上げ）。
 * 所得税法上、勤続年数に1年未満の端数があるときは1年に切り上げる。最低1年。
 */
export function countServiceYears(years: number, months: number): number {
  const y = Math.max(0, Math.floor(clampNonNeg(years)));
  const m = Math.max(0, Math.floor(clampNonNeg(months)));
  const counted = y + (m > 0 ? 1 : 0);
  return Math.max(1, counted);
}

/**
 * 退職所得控除額を求める。
 *  - 勤続20年以下: 40万円 × 勤続年数（最低80万円）
 *  - 勤続20年超:   800万円 + 70万円 ×（勤続年数 − 20年）
 *  - 障害退職:     上記に +100万円
 */
export function retirementDeduction(serviceYearsCounted: number, isDisability: boolean): number {
  const a = Math.max(1, Math.floor(serviceYearsCounted));
  let base: number;
  if (a <= 20) {
    base = Math.max(400_000 * a, 800_000);
  } else {
    base = 8_000_000 + 700_000 * (a - 20);
  }
  return base + (isDisability ? 1_000_000 : 0);
}

/**
 * 所得税の速算表（課税退職所得金額 → 所得税額・復興前）。
 * 出典: 国税庁 No.2260。金額は 1000円未満切捨済みの課税退職所得金額を渡す。
 */
export function incomeTaxByBracket(taxable: number): number {
  // 税率は整数（%）で計算し、浮動小数点の誤差（例: t*0.021 の丸め落ち）を避ける。
  const t = clampNonNeg(taxable);
  if (t <= 1_949_000) return (t * 5) / 100;
  if (t <= 3_299_000) return (t * 10) / 100 - 97_500;
  if (t <= 6_949_000) return (t * 20) / 100 - 427_500;
  if (t <= 8_999_000) return (t * 23) / 100 - 636_000;
  if (t <= 17_999_000) return (t * 33) / 100 - 1_536_000;
  if (t <= 39_999_000) return (t * 40) / 100 - 2_796_000;
  return (t * 45) / 100 - 4_796_000;
}

/**
 * 退職金の税額を計算する（メイン関数）。
 */
export function calculateSeveranceTax(input: SeveranceInput): SeveranceResult {
  const severancePay = clampNonNeg(input.severancePay);
  const serviceYearsCounted = countServiceYears(input.serviceYears, input.serviceMonths);
  const deduction = retirementDeduction(serviceYearsCounted, input.isDisability);

  // 収入 − 控除（0未満は0）
  const incomeAfterDeduction = Math.max(0, severancePay - deduction);

  // 1/2課税の判定
  const isSpecialOfficer = input.isBoardMember && serviceYearsCounted <= 5;
  const isShortTerm = !input.isBoardMember && serviceYearsCounted <= 5;

  // 課税退職所得金額（1000円未満切捨前）
  let taxableRaw: number;
  if (isSpecialOfficer) {
    // 特定役員退職手当等: 1/2課税なし
    taxableRaw = incomeAfterDeduction;
  } else if (isShortTerm) {
    // 短期退職手当等: 300万円までは1/2、超過分は全額
    if (incomeAfterDeduction <= 3_000_000) {
      taxableRaw = incomeAfterDeduction * 0.5;
    } else {
      taxableRaw = 1_500_000 + (incomeAfterDeduction - 3_000_000);
    }
  } else {
    // 通常: 1/2課税
    taxableRaw = incomeAfterDeduction * 0.5;
  }

  const taxableRetirementIncome = floorTo1000(taxableRaw);

  // 所得税・復興特別所得税
  const incomeTaxBase = Math.floor(incomeTaxByBracket(taxableRetirementIncome));
  // 源泉徴収税額 = 基準所得税額 × 102.1%（1円未満切捨）。×1021/1000 で整数計算し丸め誤差を避ける
  const incomeTaxTotal = Math.floor((incomeTaxBase * 1021) / 1000);
  const incomeTax = incomeTaxBase;
  const reconstructionTax = incomeTaxTotal - incomeTax;

  // 住民税（分離課税・特別徴収）: 市6% + 県4%、各100円未満切捨
  const cityTax = floorTo100((taxableRetirementIncome * 6) / 100);
  const prefTax = floorTo100((taxableRetirementIncome * 4) / 100);
  const residentTax = cityTax + prefTax;

  const totalTax = incomeTaxTotal + residentTax;
  const takeHome = severancePay - totalTax;

  return {
    serviceYearsCounted,
    retirementDeduction: deduction,
    incomeAfterDeduction,
    isSpecialOfficer,
    isShortTerm,
    taxableRetirementIncome,
    incomeTax,
    reconstructionTax,
    incomeTaxTotal,
    cityTax,
    prefTax,
    residentTax,
    totalTax,
    takeHome,
  };
}
