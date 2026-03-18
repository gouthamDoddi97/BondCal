import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

interface Props {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  prefix?: string;
  suffix?: string;
}

export default function InputField({
  label,
  value,
  onChangeText,
  placeholder = '0',
  prefix,
  suffix,
}: Props) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.row}>
        {prefix != null ? <Text style={styles.adornment}>{prefix}</Text> : null}
        <TextInput
          style={[styles.input, prefix != null ? styles.padLeft : null]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#9EAAB8"
          keyboardType="decimal-pad"
          returnKeyType="done"
          selectTextOnFocus
        />
        {suffix != null ? <Text style={styles.adornment}>{suffix}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: 14 },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4A5568',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7FAFC',
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#D8E3ED',
    paddingHorizontal: 14,
    height: 50,
  },
  adornment: {
    fontSize: 15,
    color: '#718096',
    fontWeight: '500',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1A202C',
    paddingVertical: 0,
    marginLeft: 2,
  },
  padLeft: { marginLeft: 8 },
});
