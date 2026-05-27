import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { format } from 'date-fns';

export interface Client {
  id: string;
  name: string;
  email: string;
  address: string;
  company?: string;
}

export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate: number;
  total: number;
}

export interface InvoiceData {
  id: string;
  type: string;
  number: string;
  date: Date;
  dueDate: Date;
  client: Client | null;
  items: LineItem[];
  currency: string;
  subtotal: number;
  taxTotal: number;
  discount: number;
  total: number;
  notes: string;
  terms: string;
  template: string;
}

const currencySymbols: Record<string, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  CNY: '¥',
};

export const generateInvoicePdf = (invoice: InvoiceData) => {
  const doc = new jsPDF();
  const symbol = currencySymbols[invoice.currency] || invoice.currency;

  // Header / Branding
  doc.setFontSize(24);
  doc.setTextColor(30, 58, 138); // Navy blue for AirPak
  doc.text('AirPak Express', 14, 22);

  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text('123 Logistics Way', 14, 30);
  doc.text('Global Hub, NY 10001', 14, 35);
  doc.text('contact@airpakexpress.com', 14, 40);

  // Invoice Details
  doc.setFontSize(20);
  doc.setTextColor(0, 0, 0);
  doc.text(invoice.type.toUpperCase(), 130, 22);

  doc.setFontSize(10);
  doc.text(`Invoice Number: ${invoice.number}`, 130, 30);
  doc.text(`Date: ${format(invoice.date, 'MMM dd, yyyy')}`, 130, 35);
  doc.text(`Due Date: ${format(invoice.dueDate, 'MMM dd, yyyy')}`, 130, 40);

  // Client Details
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Bill To:', 14, 55);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);

  if (invoice.client) {
    doc.text(invoice.client.company || invoice.client.name, 14, 62);
    doc.text(invoice.client.name, 14, 67);
    const addressLines = doc.splitTextToSize(invoice.client.address, 80);
    doc.text(addressLines, 14, 72);
    doc.text(invoice.client.email, 14, 72 + addressLines.length * 5);
  }

  // Items Table
  const tableData = invoice.items.map(item => [
    item.description,
    item.quantity.toString(),
    `${symbol}${item.unitPrice.toFixed(2)}`,
    `${item.taxRate}%`,
    `${symbol}${item.total.toFixed(2)}`
  ]);

  (doc as any).autoTable({
    startY: 95,
    head: [['Description', 'Qty', 'Unit Price', 'Tax', 'Amount']],
    body: tableData,
    theme: invoice.template === 'Modern' ? 'grid' : 'striped',
    headStyles: { fillColor: [30, 58, 138] },
    styles: { fontSize: 9 },
  });

  const finalY = (doc as any).lastAutoTable.finalY || 95;

  // Totals
  doc.setFontSize(10);
  doc.text(`Subtotal: ${symbol}${invoice.subtotal.toFixed(2)}`, 130, finalY + 10);
  if (invoice.discount > 0) {
    doc.text(`Discount: -${symbol}${invoice.discount.toFixed(2)}`, 130, finalY + 16);
    doc.text(`Tax: ${symbol}${invoice.taxTotal.toFixed(2)}`, 130, finalY + 22);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(`Total Due: ${symbol}${(invoice.total - invoice.discount).toFixed(2)}`, 130, finalY + 30);
  } else {
    doc.text(`Tax: ${symbol}${invoice.taxTotal.toFixed(2)}`, 130, finalY + 16);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(`Total Due: ${symbol}${invoice.total.toFixed(2)}`, 130, finalY + 24);
  }

  // Notes & Terms
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Notes:', 14, finalY + 10);
  doc.setFont('helvetica', 'normal');
  const notesLines = doc.splitTextToSize(invoice.notes || 'N/A', 100);
  doc.text(notesLines, 14, finalY + 15);

  doc.setFont('helvetica', 'bold');
  doc.text('Terms & Conditions:', 14, finalY + 25 + notesLines.length * 5);
  doc.setFont('helvetica', 'normal');
  const termsLines = doc.splitTextToSize(invoice.terms || 'N/A', 100);
  doc.text(termsLines, 14, finalY + 30 + notesLines.length * 5);

  return doc;
};
