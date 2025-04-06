// src/utils/formatCurrency.js

import { toWords } from 'number-to-words';

/**
 * Format number as ₦ with commas
 * @param {number|string} amount
 * @returns {string}
 */
export const formatNaira = (amount) => {
  const num = Number(amount);
  if (isNaN(num)) return '₦0.00';

  return num.toLocaleString('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 2,
  });
};

/**
 * Return a human-readable label: Thousand, Million, etc.
 * @param {number|string} amount
 * @returns {string}
 */
export const describeAmount = (amount) => {
  const num = Number(amount);
  if (isNaN(num) || num <= 0) return 'Zero Naira';

  const thresholds = [
    { value: 1_000_000_000, label: 'Billion' },
    { value: 1_000_000, label: 'Million' },
    { value: 1_000, label: 'Thousand' },
    { value: 100, label: 'Hundred' },
  ];

  for (const t of thresholds) {
    if (num >= t.value) {
      const count = Math.floor(num / t.value);
      return `${capitalize(toWords(count))} ${t.label} Naira`;
    }
  }

  return `${capitalize(toWords(num))} Naira`;
};

/**
 * Capitalize first letter of any string
 */
const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
