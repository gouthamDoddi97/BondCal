// ─── Types ───────────────────────────────────────────────────────────────────

export type CouponFrequency = 1 | 2;

export interface BondInputs {
  faceValue: number;
  annualCouponRate: number; // e.g. 5 = 5%
  marketPrice: number;
  yearsToMaturity: number;
  frequency: CouponFrequency;
}

export interface BondResults {
  currentYield: number;      // annualized %
  ytm: number;               // annualized %
  totalInterest: number;     // total coupon cash paid over bond life
  pricingStatus: 'premium' | 'discount' | 'par';
  pricingDifference: number; // marketPrice − faceValue
}

export interface CashFlowRow {
  period: number;
  paymentDate: string;
  couponPayment: number;
  cumulativeInterest: number;
  remainingPrincipal: number;
}

// ─── Formatters ──────────────────────────────────────────────────────────────

export function usd(value: number): string {
  const abs = Math.abs(value);
  const formatted = '$' + abs.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return value < 0 ? '-' + formatted : formatted;
}

export function pct(value: number, digits = 4): string {
  return value.toFixed(digits) + '%';
}

// ─── Math helpers ─────────────────────────────────────────────────────────────

/** Present value of all bond cash flows at a given periodic yield */
function pvBond(y: number, n: number, c: number, fv: number): number {
  let pv = fv / Math.pow(1 + y, n);
  for (let t = 1; t <= n; t++) {
    pv += c / Math.pow(1 + y, t);
  }
  return pv;
}

/** d(price)/d(y) — derivative used by Newton-Raphson */
function dpvBond(y: number, n: number, c: number, fv: number): number {
  let d = -(n * fv) / Math.pow(1 + y, n + 1);
  for (let t = 1; t <= n; t++) {
    d -= (t * c) / Math.pow(1 + y, t + 1);
  }
  return d;
}

/**
 * Newton-Raphson solver for YTM.
 * Returns annualised YTM as a percentage (e.g. 5.23 for 5.23%).
 */
function solveYTM(
  marketPrice: number,
  faceValue: number,
  annualCouponRate: number,
  yearsToMaturity: number,
  frequency: CouponFrequency,
): number {
  const c = (faceValue * annualCouponRate / 100) / frequency;
  const n = Math.round(yearsToMaturity * frequency);

  if (n === 0) return annualCouponRate;

  // Approximate initial guess
  const annualCoupon = faceValue * annualCouponRate / 100;
  const approxAnnual =
    (annualCoupon + (faceValue - marketPrice) / yearsToMaturity) /
    ((faceValue + marketPrice) / 2);
  let y = Math.max(1e-6, approxAnnual / frequency);

  for (let i = 0; i < 500; i++) {
    const err = pvBond(y, n, c, faceValue) - marketPrice;
    if (Math.abs(err) < 1e-7) break;
    const d = dpvBond(y, n, c, faceValue);
    if (Math.abs(d) < 1e-12) break;
    y = Math.max(1e-6, y - err / d);
  }

  return y * frequency * 100;
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function calculate(inputs: BondInputs): {
  results: BondResults;
  cashFlows: CashFlowRow[];
} {
  const { faceValue, annualCouponRate, marketPrice, yearsToMaturity, frequency } = inputs;

  const annualCoupon = faceValue * annualCouponRate / 100;
  const c = annualCoupon / frequency;
  const n = Math.round(yearsToMaturity * frequency);
  const monthsPerPeriod = 12 / frequency;

  const currentYield = (annualCoupon / marketPrice) * 100;
  const ytm = solveYTM(marketPrice, faceValue, annualCouponRate, yearsToMaturity, frequency);
  const totalInterest = c * n;
  const pricingDifference = marketPrice - faceValue;

  const results: BondResults = {
    currentYield,
    ytm,
    totalInterest,
    pricingStatus:
      Math.abs(pricingDifference) < 0.01
        ? 'par'
        : pricingDifference > 0
        ? 'premium'
        : 'discount',
    pricingDifference,
  };

  const today = new Date();
  const cashFlows: CashFlowRow[] = Array.from({ length: n }, (_, i) => {
    const period = i + 1;
    const date = new Date(
      today.getFullYear(),
      today.getMonth() + period * monthsPerPeriod,
      today.getDate(),
    );
    return {
      period,
      paymentDate: date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      couponPayment: c,
      cumulativeInterest: +(c * period).toFixed(2),
      remainingPrincipal: period < n ? faceValue : 0,
    };
  });

  return { results, cashFlows };
}
