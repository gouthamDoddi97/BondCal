import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { usd } from '../utils/bondCalculations';
import type { CashFlowRow } from '../utils/bondCalculations';
import { useScreenWidth } from '../hooks/useScreenWidth';

interface Props {
  cashFlows: CashFlowRow[];
  faceValue: number;
}

const COLS: Array<{ key: keyof CashFlowRow; label: string; flex: number }> = [
  { key: 'period', label: '#', flex: 42 },
  { key: 'paymentDate', label: 'Date', flex: 115 },
  { key: 'couponPayment', label: 'Coupon', flex: 95 },
  { key: 'cumulativeInterest', label: 'Cumulative', flex: 105 },
  { key: 'remainingPrincipal', label: 'Principal', flex: 100 },
];

const TOTAL_FLEX = COLS.reduce((s, c) => s + c.flex, 0);

function cellText(key: keyof CashFlowRow, value: string | number): string {
  if (key === 'period' || key === 'paymentDate') return String(value);
  return usd(value as number);
}

const FIXED_MIN_WIDTH = 481;

export default function CashFlowTable({ cashFlows, faceValue }: Props) {
  const [expanded, setExpanded] = useState(true);
  const screenWidth = useScreenWidth();
  // Fill the card on all platforms (screen width minus 32px horizontal margins).
  const tableWidth = Math.max(screenWidth - 32, FIXED_MIN_WIDTH);

  // Compute pixel widths proportionally from tableWidth
  const colWidths = COLS.map(col => Math.floor((col.flex / TOTAL_FLEX) * tableWidth));

  if (cashFlows.length === 0) return null;

  const totalCoupon = cashFlows.reduce((s, r) => s + r.couponPayment, 0);
  const lastCumulative = cashFlows[cashFlows.length - 1].cumulativeInterest;

  return (
    <View style={styles.container}>
      {/* Collapsible title bar */}
      <TouchableOpacity
        style={styles.titleBar}
        onPress={() => setExpanded(e => !e)}
        activeOpacity={0.8}
        
      >
        <Text style={styles.titleText}>Cash Flow Schedule</Text>
        <Text style={styles.chevron}>{expanded ? '▲' : '▼'}</Text>
      </TouchableOpacity>

      {expanded && (
        <ScrollView horizontal showsHorizontalScrollIndicator>
          <View style={{ minWidth: tableWidth }}>
            {/* Column headers */}
            <View style={styles.headRow}>
              {COLS.map((col, i) => (
                <Text key={col.key} style={[styles.headCell, { width: colWidths[i] }]}>
                  {col.label}
                </Text>
              ))}
            </View>

            {/* Data rows */}
            {cashFlows.map((row, idx) => (
              <View
                key={row.period}
                style={[styles.dataRow, idx % 2 === 0 ? styles.rowEven : styles.rowOdd]}
              >
                {COLS.map((col, i) => (
                  <Text key={col.key} style={[styles.cell, { width: colWidths[i] }]}>
                    {cellText(col.key, row[col.key])}
                  </Text>
                ))}
              </View>
            ))}

            {/* Totals footer */}
            <View style={styles.footRow}>
              <Text style={[styles.footCell, { width: colWidths[0] }]}>Σ</Text>
              <Text style={[styles.footCell, { width: colWidths[1] }]}>Totals</Text>
              <Text style={[styles.footCell, { width: colWidths[2] }]}>{usd(totalCoupon)}</Text>
              <Text style={[styles.footCell, { width: colWidths[3] }]}>{usd(lastCumulative)}</Text>
              <Text style={[styles.footCell, { width: colWidths[4] }]}>{usd(faceValue)} *</Text>
            </View>
          </View>
        </ScrollView>
      )}

      {expanded && (
        <Text style={styles.footnote}>* Face value repaid at maturity</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginBottom: 32,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#1C3360',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
  titleBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1C3360',
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  titleText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  chevron: {
    color: '#93C5FD',
    fontSize: 12,
    fontWeight: '700',
  },
  headRow: {
    flexDirection: 'row',
    backgroundColor: '#EBF0F8',
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  headCell: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4A5568',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  dataRow: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  rowEven: { backgroundColor: '#FFFFFF' },
  rowOdd: { backgroundColor: '#F7FAFC' },
  cell: {
    fontSize: 13,
    color: '#2D3748',
  },
  footRow: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#EBF0F8',
    borderTopWidth: 1.5,
    borderTopColor: '#CBD5E0',
  },
  footCell: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1C3360',
  },
  footnote: {
    fontSize: 11,
    color: '#718096',
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontStyle: 'italic',
  },
});
