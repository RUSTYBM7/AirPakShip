import React from 'react';
import { motion } from 'framer-motion';

export interface InvoiceTotals {
  subtotal: number;
  taxTotal: number;
  discountTotal: number;
  total: number;
}

interface InvoiceCalculatorProps {
  totals: InvoiceTotals;
  currency: string;
  onDiscountChange?: (discount: number) => void;
  discount?: number;
}

const currencySymbols: Record<string, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  CNY: '¥',
};

export function InvoiceCalculator({
  totals,
  currency,
  onDiscountChange,
  discount = 0,
}: InvoiceCalculatorProps) {
  const symbol = currencySymbols[currency] || currency;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-800/50 backdrop-blur-md border border-slate-700 p-6 rounded-xl space-y-4"
    >
      <h3 className="text-lg font-semibold text-slate-100 mb-4">Invoice Totals</h3>

      <div className="flex justify-between items-center text-slate-300">
        <span>Subtotal</span>
        <span>{symbol}{totals.subtotal.toFixed(2)}</span>
      </div>

      {onDiscountChange && (
        <div className="flex justify-between items-center text-slate-300">
          <span>Discount</span>
          <div className="flex items-center space-x-2">
            <span className="text-slate-400">{symbol}</span>
            <input
              type="number"
              value={discount}
              onChange={(e) => onDiscountChange(parseFloat(e.target.value) || 0)}
              className="w-24 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-right text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>
      )}

      <div className="flex justify-between items-center text-slate-300">
        <span>Tax Total</span>
        <span>{symbol}{totals.taxTotal.toFixed(2)}</span>
      </div>

      <div className="h-px bg-slate-700 my-4"></div>

      <div className="flex justify-between items-center text-xl font-bold text-white">
        <span>Total Due</span>
        <span className="text-blue-400">
          {symbol}{(totals.total - discount).toFixed(2)}
        </span>
      </div>
    </motion.div>
  );
}
