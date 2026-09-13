import { TestInputs, TestResults } from "@/types";

export function calculateTestResults(inputs: TestInputs): TestResults {
  const { supplierCost, sellingPrice, shipping, adBudget, targetCPA, expectedAOV } = inputs;
  const landedCost = supplierCost + shipping;
  const grossMarginPerUnit = Math.round((sellingPrice - landedCost) * 100) / 100;
  const grossMarginPct = sellingPrice > 0 ? Math.round((grossMarginPerUnit / sellingPrice) * 1000) / 10 : 0;

  // Break-even ROAS: revenue needed to cover cost of goods, expressed as a
  // multiple of ad spend at the point where profit = 0.
  const breakEvenRoas = grossMarginPerUnit > 0 ? Math.round((sellingPrice / grossMarginPerUnit) * 100) / 100 : Infinity;
  const breakEvenCpa = Math.max(0, Math.round(grossMarginPerUnit * 100) / 100);

  const unitsFromBudget = targetCPA > 0 ? adBudget / targetCPA : 0;
  const potentialProfit = Math.round((unitsFromBudget * grossMarginPerUnit - adBudget * 0) * 100) / 100; // ad spend already implied by CPA
  const potentialLoss = Math.round(adBudget * 100) / 100; // worst case: full budget spent, zero conversions

  const recommendedBudget = Math.max(adBudget, Math.round(breakEvenCpa > 0 ? breakEvenCpa * 20 : adBudget));
  const recommendedDays = 5;

  return {
    grossMarginPerUnit,
    grossMarginPct,
    breakEvenRoas: Number.isFinite(breakEvenRoas) ? breakEvenRoas : 0,
    breakEvenCpa,
    potentialProfit,
    potentialLoss,
    recommendedBudget,
    recommendedDays,
  };
}
