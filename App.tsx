import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar as RNStatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

import InputField from './src/components/InputField';
import ResultCard from './src/components/ResultCard';
import CashFlowTable from './src/components/CashFlowTable';
import {
  calculate,
  usd,
  pct,
  type CouponFrequency,
  type BondResults,
  type CashFlowRow,
} from './src/utils/bondCalculations';

const TOP_PAD = Platform.OS === 'ios' ? 54 : (RNStatusBar.currentHeight ?? 24) + 4;

export default function App() {
  // ─── Inputs ───────────────────────────────────────────────────────────────
  const [faceValue, setFaceValue] = useState('1000');
  const [couponRate, setCouponRate] = useState('5');
  const [marketPrice, setMarketPrice] = useState('950');
  const [years, setYears] = useState('10');
  const [frequency, setFrequency] = useState<CouponFrequency>(2);

  // ─── Outputs ──────────────────────────────────────────────────────────────
  const [results, setResults] = useState<BondResults | null>(null);
  const [cashFlows, setCashFlows] = useState<CashFlowRow[]>([]);
  const [error, setError] = useState<string | null>(null);

  // ─── Calculate ────────────────────────────────────────────────────────────
  function handleCalculate() {
    const fv = parseFloat(faceValue);
    const cr = parseFloat(couponRate);
    const mp = parseFloat(marketPrice);
    const yr = parseFloat(years);

    if ([fv, cr, mp, yr].some(Number.isNaN)) {
      setError('Please fill in all fields with valid numbers.');
      return;
    }
    if (fv <= 0 || mp <= 0 || yr <= 0 || cr < 0) {
      setError('Face value, market price, and years must be positive. Coupon rate ≥ 0.');
      return;
    }
    if (cr > 100) {
      setError('Coupon rate seems unusually high — please double-check.');
      return;
    }

    setError(null);
    const { results: r, cashFlows: cf } = calculate({
      faceValue: fv,
      annualCouponRate: cr,
      marketPrice: mp,
      yearsToMaturity: yr,
      frequency,
    });
    setResults(r);
    setCashFlows(cf);

  }

  // ─── Derived display values ───────────────────────────────────────────────
  const pricingColor =
    results?.pricingStatus === 'premium'
      ? '#0D9E72'
      : results?.pricingStatus === 'discount'
      ? '#DC3545'
      : '#2E6AD6';

  const pricingBadge =
    results?.pricingStatus === 'premium'
      ? 'TRADING PREMIUM'
      : results?.pricingStatus === 'discount'
      ? 'TRADING DISCOUNT'
      : 'AT PAR';

  const pricingValue = results
    ? (results.pricingDifference >= 0 ? '+' : '') + usd(results.pricingDifference)
    : '';

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar style="light" />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingTop: TOP_PAD }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ── */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Bond Yield</Text>
          <Text style={styles.headerSub}>CALCULATOR</Text>
        </View>

        {/* ── Input card ── */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Bond Parameters</Text>

          <InputField
            label="Face Value"
            value={faceValue}
            onChangeText={setFaceValue}
            prefix="$"
            placeholder="1000"
          />
          <InputField
            label="Annual Coupon Rate"
            value={couponRate}
            onChangeText={setCouponRate}
            suffix="%"
            placeholder="5.00"
          />
          <InputField
            label="Market Price"
            value={marketPrice}
            onChangeText={setMarketPrice}
            prefix="$"
            placeholder="950"
          />
          <InputField
            label="Years to Maturity"
            value={years}
            onChangeText={setYears}
            placeholder="10"
          />

          <Text style={styles.freqLabel}>Coupon Frequency</Text>
          <View style={styles.freqRow}>
            {([1, 2] as CouponFrequency[]).map(f => (
              <TouchableOpacity
                key={f}
                style={[styles.freqBtn, frequency === f && styles.freqBtnActive]}
                onPress={() => setFrequency(f)}
                activeOpacity={0.70}
              >
                <Text style={[styles.freqBtnText, frequency === f && styles.freqBtnTextActive]}>
                  {f === 1 ? 'Annual' : 'Semi-Annual'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {error != null ? <Text style={styles.error}>{error}</Text> : null}

          <TouchableOpacity style={styles.calcBtn} onPress={handleCalculate} activeOpacity={0.85}>
            <Text style={styles.calcBtnText}>Calculate Yield</Text>
          </TouchableOpacity>
        </View>

        {/* ── Results ── */}
        {results != null && (
          <>
            <Text style={styles.sectionLabel}>Results</Text>
            <View style={styles.resultsGrid}>
              <ResultCard
                label="Current Yield"
                value={pct(results.currentYield)}
                valueColor="#2E6AD6"
              />
              <ResultCard
                label="Yield to Maturity"
                value={pct(results.ytm)}
                valueColor="#1C3360"
              />
              <ResultCard
                label="Total Interest Earned"
                value={usd(results.totalInterest)}
                valueColor="#0D9E72"
              />
              <ResultCard
                label="Market vs Face"
                value={pricingValue}
                valueColor={pricingColor}
                badge={pricingBadge}
                badgeColor={pricingColor}
              />
            </View>

            <CashFlowTable cashFlows={cashFlows} faceValue={parseFloat(faceValue)} />
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#EBF0F6' },
  scroll: { flex: 1 },
  content: { paddingBottom: 60 },

  header: {
    backgroundColor: '#1C3360',
    paddingHorizontal: 22,
    paddingTop: 20,
    paddingBottom: 30,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  headerSub: {
    color: '#93C5FD',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 3,
    marginTop: 2,
  },

  card: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: -6,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#1C3360',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1C3360',
    marginBottom: 18,
  },

  freqLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4A5568',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  freqRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 18,
  },
  freqBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#D8E3ED',
    backgroundColor: '#F7FAFC',
  },
  freqBtnActive: {
    backgroundColor: '#1C3360',
    borderColor: '#1C3360',
  },
  freqBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#718096',
  },
  freqBtnTextActive: { color: '#FFFFFF' },

  error: {
    color: '#DC3545',
    fontSize: 13,
    marginBottom: 12,
    lineHeight: 18,
  },

  calcBtn: {
    backgroundColor: '#2E6AD6',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
  },
  calcBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },

  sectionLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1C3360',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  resultsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
});
