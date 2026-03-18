import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
  label: string;
  value: string;
  valueColor?: string;
  badge?: string;
  badgeColor?: string;
}

export default function ResultCard({
  label,
  value,
  valueColor = '#1C3360',
  badge,
  badgeColor = '#2E6AD6',
}: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>{label}</Text>
      <Text
        style={[styles.value, { color: valueColor }]}
        numberOfLines={1}
        adjustsFontSizeToFit
      >
        {value}
      </Text>
      {badge != null ? (
        <View style={[styles.badge, { backgroundColor: badgeColor + '22' }]}>
          <Text style={[styles.badgeText, { color: badgeColor }]}>{badge}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    width: '48%',
    marginBottom: 10,
    shadowColor: '#1C3360',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
  label: {
    fontSize: 10,
    fontWeight: '700',
    color: '#718096',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  value: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  badge: {
    marginTop: 8,
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});
