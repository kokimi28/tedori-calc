import { describe, it, expect } from "vitest";
import {
  countServiceYears,
  retirementDeduction,
  incomeTaxByBracket,
  calculateSeveranceTax,
} from "./calculations";

describe("countServiceYears — 勤続年数の端数切り上げ", () => {
  it("端数の月があれば1年に切り上げる", () => {
    expect(countServiceYears(10, 1)).toBe(11);
    expect(countServiceYears(10, 11)).toBe(11);
  });
  it("端数がなければそのまま", () => {
    expect(countServiceYears(10, 0)).toBe(10);
    expect(countServiceYears(20, 0)).toBe(20);
  });
  it("最低1年", () => {
    expect(countServiceYears(0, 0)).toBe(1);
    expect(countServiceYears(-5, 0)).toBe(1);
  });
});

describe("retirementDeduction — 退職所得控除額", () => {
  it("下限は80万円（勤続1年）", () => {
    expect(retirementDeduction(1, false)).toBe(800_000);
  });
  it("勤続20年ちょうどは 40万×20 = 800万", () => {
    expect(retirementDeduction(20, false)).toBe(8_000_000);
  });
  it("勤続21年は 800万 + 70万×1 = 870万（20年境界）", () => {
    expect(retirementDeduction(21, false)).toBe(8_700_000);
  });
  it("勤続30年は 800万 + 70万×10 = 1500万", () => {
    expect(retirementDeduction(30, false)).toBe(15_000_000);
  });
  it("障害退職は +100万", () => {
    expect(retirementDeduction(30, true)).toBe(16_000_000);
  });
});

describe("incomeTaxByBracket — 所得税速算表の境界", () => {
  it("195万未満は5%", () => {
    expect(incomeTaxByBracket(1_949_000)).toBe(97_450);
  });
  it("195万で10%区分に切り替わる", () => {
    expect(incomeTaxByBracket(1_950_000)).toBe(97_500);
  });
  it("330万で20%区分", () => {
    expect(incomeTaxByBracket(3_300_000)).toBe(232_500);
  });
  it("課税所得0は税0", () => {
    expect(incomeTaxByBracket(0)).toBe(0);
  });
});

describe("calculateSeveranceTax — 通常ケース（非役員・障害なし）", () => {
  const r = calculateSeveranceTax({
    severancePay: 20_000_000,
    serviceYears: 30,
    serviceMonths: 0,
    isDisability: false,
    isBoardMember: false,
  });
  it("控除・課税所得", () => {
    expect(r.retirementDeduction).toBe(15_000_000);
    expect(r.incomeAfterDeduction).toBe(5_000_000);
    expect(r.taxableRetirementIncome).toBe(2_500_000); // 1/2課税
  });
  it("所得税・復興・住民税・合計", () => {
    expect(r.incomeTax).toBe(152_500);
    expect(r.reconstructionTax).toBe(3_202);
    expect(r.incomeTaxTotal).toBe(155_702);
    expect(r.residentTax).toBe(250_000);
    expect(r.totalTax).toBe(405_702);
    expect(r.takeHome).toBe(19_594_298);
  });
});

describe("calculateSeveranceTax — 収入が控除以下なら税0", () => {
  const r = calculateSeveranceTax({
    severancePay: 3_000_000,
    serviceYears: 10,
    serviceMonths: 0,
    isDisability: false,
    isBoardMember: false,
  });
  it("課税所得0・税0・手取り=収入", () => {
    expect(r.incomeAfterDeduction).toBe(0);
    expect(r.taxableRetirementIncome).toBe(0);
    expect(r.totalTax).toBe(0);
    expect(r.takeHome).toBe(3_000_000);
  });
});

describe("calculateSeveranceTax — 特定役員退職手当等（役員・勤続5年以下は1/2なし）", () => {
  const r = calculateSeveranceTax({
    severancePay: 6_000_000,
    serviceYears: 5,
    serviceMonths: 0,
    isDisability: false,
    isBoardMember: true,
  });
  it("1/2課税されない", () => {
    expect(r.isSpecialOfficer).toBe(true);
    expect(r.incomeAfterDeduction).toBe(4_000_000);
    expect(r.taxableRetirementIncome).toBe(4_000_000);
  });
  it("税額", () => {
    expect(r.incomeTax).toBe(372_500);
    expect(r.incomeTaxTotal).toBe(380_322);
    expect(r.residentTax).toBe(400_000);
    expect(r.totalTax).toBe(780_322);
  });
});

describe("calculateSeveranceTax — 短期退職手当等（非役員・勤続5年以下・300万超部分は1/2なし）", () => {
  const over = calculateSeveranceTax({
    severancePay: 8_000_000,
    serviceYears: 4,
    serviceMonths: 0,
    isDisability: false,
    isBoardMember: false,
  });
  it("300万超部分は全額課税", () => {
    expect(over.isShortTerm).toBe(true);
    expect(over.incomeAfterDeduction).toBe(6_400_000);
    expect(over.taxableRetirementIncome).toBe(4_900_000); // 150万 + (640万-300万)
    expect(over.totalTax).toBe(1_054_102);
  });

  const under = calculateSeveranceTax({
    severancePay: 3_000_000,
    serviceYears: 3,
    serviceMonths: 0,
    isDisability: false,
    isBoardMember: false,
  });
  it("300万以下は通常の1/2課税", () => {
    expect(under.isShortTerm).toBe(true);
    expect(under.incomeAfterDeduction).toBe(1_800_000);
    expect(under.taxableRetirementIncome).toBe(900_000); // 1/2
    expect(under.totalTax).toBe(135_945);
  });
});

describe("calculateSeveranceTax — 障害退職の大口ケース", () => {
  const r = calculateSeveranceTax({
    severancePay: 30_000_000,
    serviceYears: 25,
    serviceMonths: 0,
    isDisability: true,
    isBoardMember: false,
  });
  it("控除に+100万・1/2課税・各税", () => {
    expect(r.retirementDeduction).toBe(12_500_000);
    expect(r.taxableRetirementIncome).toBe(8_750_000);
    expect(r.incomeTax).toBe(1_376_500);
    expect(r.incomeTaxTotal).toBe(1_405_406);
    expect(r.residentTax).toBe(875_000);
    expect(r.totalTax).toBe(2_280_406);
  });
});
