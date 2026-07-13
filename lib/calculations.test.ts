import { describe, it, expect } from "vitest";
import {
  salaryIncomeDeduction,
  basicDeductionIncomeTax,
  incomeTaxByBracket,
  socialInsurance,
  calculateNetSalary,
} from "./calculations";

describe("salaryIncomeDeduction — 給与所得控除（令和7年分以降）", () => {
  it("190万円以下は最低保障65万円", () => {
    expect(salaryIncomeDeduction(1_000_000)).toBe(650_000);
    expect(salaryIncomeDeduction(1_900_000)).toBe(650_000);
  });
  it("区分ごとの速算表", () => {
    expect(salaryIncomeDeduction(3_600_000)).toBe(1_160_000); // 30%+8万
    expect(salaryIncomeDeduction(6_600_000)).toBe(1_760_000); // 20%+44万
    expect(salaryIncomeDeduction(8_500_000)).toBe(1_950_000); // 10%+110万
  });
  it("850万円超は上限195万円", () => {
    expect(salaryIncomeDeduction(10_000_000)).toBe(1_950_000);
  });
});

describe("basicDeductionIncomeTax — 基礎控除（令和7〜8年分・合計所得別）", () => {
  it("各区分の境界", () => {
    expect(basicDeductionIncomeTax(1_320_000)).toBe(950_000);
    expect(basicDeductionIncomeTax(1_320_001)).toBe(880_000);
    expect(basicDeductionIncomeTax(3_360_000)).toBe(880_000);
    expect(basicDeductionIncomeTax(3_360_001)).toBe(680_000);
    expect(basicDeductionIncomeTax(4_890_000)).toBe(680_000);
    expect(basicDeductionIncomeTax(4_890_001)).toBe(630_000);
    expect(basicDeductionIncomeTax(6_550_000)).toBe(630_000);
    expect(basicDeductionIncomeTax(6_550_001)).toBe(580_000);
    expect(basicDeductionIncomeTax(23_500_000)).toBe(580_000);
  });
});

describe("incomeTaxByBracket — 所得税速算表の境界", () => {
  it("195万・330万の境界", () => {
    expect(incomeTaxByBracket(1_949_000)).toBe(97_450);
    expect(incomeTaxByBracket(1_950_000)).toBe(97_500);
    expect(incomeTaxByBracket(3_300_000)).toBe(232_500);
  });
  it("課税0は税0", () => {
    expect(incomeTaxByBracket(0)).toBe(0);
  });
});

describe("socialInsurance — 社会保険料（従業員負担）", () => {
  it("40歳未満は介護保険なし", () => {
    const si = socialInsurance(4_000_000, false);
    expect(si.health).toBe(200_000);
    expect(si.nursing).toBe(0);
    expect(si.pension).toBe(366_000);
    expect(si.employment).toBe(24_000);
    expect(si.total).toBe(590_000);
  });
  it("40歳以上は介護保険が加わる", () => {
    const si = socialInsurance(4_000_000, true);
    expect(si.nursing).toBe(Math.round(4_000_000 * 0.00795)); // 31,800
    expect(si.total).toBe(590_000 + si.nursing);
  });
  it("厚生年金は標準報酬月額上限（年780万相当）で頭打ち", () => {
    const hi = socialInsurance(20_000_000, false);
    expect(hi.pension).toBe(Math.round(7_800_000 * 0.0915)); // 713,700 で頭打ち
  });
});

describe("calculateNetSalary — 年収400万・40歳未満（基準ケース）", () => {
  const r = calculateNetSalary({ annualIncome: 4_000_000, isOver40: false });
  it("社会保険料・所得税・住民税・手取り", () => {
    expect(r.socialInsurance).toBe(590_000);
    expect(r.salaryDeduction).toBe(1_240_000);
    expect(r.employmentIncome).toBe(2_760_000);
    expect(r.taxableIncomeForIncomeTax).toBe(1_290_000);
    expect(r.incomeTax).toBe(65_854);
    expect(r.residentTax).toBe(179_000);
    expect(r.totalDeduction).toBe(834_854);
    expect(r.takeHome).toBe(3_165_146);
    expect(r.takeHomeMonthly).toBe(263_762);
  });
});

describe("calculateNetSalary — 年収600万・40歳未満", () => {
  const r = calculateNetSalary({ annualIncome: 6_000_000, isOver40: false });
  it("内訳と手取り", () => {
    expect(r.socialInsurance).toBe(885_000);
    expect(r.employmentIncome).toBe(4_360_000);
    expect(r.incomeTax).toBe(185_822);
    expect(r.residentTax).toBe(309_500);
    expect(r.takeHome).toBe(4_619_678);
  });
});

describe("calculateNetSalary — 整合性・低所得・境界", () => {
  it("手取り = 年収 − (社会保険料 + 所得税 + 住民税)", () => {
    for (const income of [1_000_000, 3_000_000, 5_000_000, 8_000_000, 12_000_000]) {
      const r = calculateNetSalary({ annualIncome: income, isOver40: true });
      expect(r.takeHome).toBe(income - (r.socialInsurance + r.incomeTax + r.residentTax));
      expect(r.totalDeduction).toBe(r.socialInsurance + r.incomeTax + r.residentTax);
    }
  });
  it("年収100万は所得税・住民税ともゼロ（社会保険料のみ差引）", () => {
    const r = calculateNetSalary({ annualIncome: 1_000_000, isOver40: false });
    expect(r.incomeTax).toBe(0);
    expect(r.residentTax).toBe(0);
    // 社会保険料（健保5%＋厚年9.15%＋雇用0.6%＝約14.75%）のみ引かれる
    expect(r.takeHome).toBe(1_000_000 - r.socialInsurance);
    expect(r.takeHomeRate).toBeGreaterThan(0.84);
  });
  it("年収0は全項目0", () => {
    const r = calculateNetSalary({ annualIncome: 0, isOver40: false });
    expect(r.takeHome).toBe(0);
    expect(r.totalDeduction).toBe(0);
    expect(r.takeHomeRate).toBe(0);
  });
});
