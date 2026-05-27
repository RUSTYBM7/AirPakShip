import React, { useEffect, useState } from 'react';
import { DocumentGenerator } from './DocumentGenerator';
import { brandColors } from '../../lib/brand';

// Common Types
export interface DocumentData {
  trackingNumber?: string;
  sender?: {
    name: string;
    company: string;
    address: string;
    phone: string;
  };
  recipient?: {
    name: string;
    company: string;
    address: string;
    phone: string;
  };
  weight?: string;
  dimensions?: string;
  serviceLevel?: string;
  date?: string;
  items?: Array<{ description: string; quantity: number; weight: string; value: string }>;
  totalValue?: string;
  currency?: string;
  instructions?: string;
  [key: string]: any;
}

// Helpers
const QRCodeImage = ({ text }: { text: string }) => {
  const [src, setSrc] = useState<string>('');
  useEffect(() => {
    if (text) DocumentGenerator.generateQRCode(text).then(setSrc);
  }, [text]);
  return src ? <img src={src} alt="QR Code" className="w-24 h-24" /> : <div className="w-24 h-24 bg-gray-100 animate-pulse rounded" />;
};

const BarcodeImage = ({ text }: { text: string }) => {
  const [src, setSrc] = useState<string>('');
  useEffect(() => {
    if (text) setSrc(DocumentGenerator.generateBarcode(text));
  }, [text]);
  return src ? <img src={src} alt="Barcode" className="h-16 object-contain" /> : <div className="h-16 w-48 bg-gray-100 animate-pulse rounded" />;
};

const BrandHeader = ({ title }: { title: string }) => (
  <div className="flex justify-between items-start mb-6 border-b-4 pb-4" style={{ borderColor: brandColors.primary[600] }}>
    <div>
      <h1 className="text-3xl font-bold tracking-tighter" style={{ color: brandColors.primary[600] }}>AIRPAK EXPRESS</h1>
      <p className="text-xs text-gray-500 font-medium">Global Logistics & Supply Chain Solutions</p>
    </div>
    <div className="text-right">
      <h2 className="text-2xl font-bold text-gray-800 uppercase">{title}</h2>
    </div>
  </div>
);

// Templates

export const ShippingLabel = ({ data }: { data: DocumentData }) => {
  return (
    <div id="pdf-content" className="w-[105mm] h-[148mm] bg-white text-black p-4 mx-auto shadow-lg relative border border-gray-200 overflow-hidden box-border">
      {/* AirPak Header */}
      <div className="border-b-4 border-black pb-2 mb-2 flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tighter" style={{ color: brandColors.primary[600] }}>AIRPAK</h1>
        <div className="font-bold text-xl">{data.serviceLevel?.[0] || 'E'}</div>
      </div>

      {/* Service Info */}
      <div className="flex justify-between font-bold text-sm border-b-2 border-black pb-1 mb-2">
        <span>{data.serviceLevel || 'EXPRESS WORLDWIDE'}</span>
        <span>{data.date || new Date().toISOString().split('T')[0]}</span>
      </div>

      {/* From / To */}
      <div className="flex flex-col gap-2 mb-4 text-xs">
        <div className="flex">
          <div className="w-12 font-bold">FROM:</div>
          <div>
            <div className="font-bold">{data.sender?.name}</div>
            <div>{data.sender?.company}</div>
            <div className="whitespace-pre-wrap">{data.sender?.address}</div>
            <div>Ph: {data.sender?.phone}</div>
          </div>
        </div>

        <div className="flex pt-2 border-t border-gray-300">
          <div className="w-12 font-bold">TO:</div>
          <div>
            <div className="font-bold text-base">{data.recipient?.name}</div>
            <div className="font-semibold">{data.recipient?.company}</div>
            <div className="whitespace-pre-wrap text-sm leading-tight">{data.recipient?.address}</div>
            <div>Ph: {data.recipient?.phone}</div>
          </div>
        </div>
      </div>

      {/* Shipment Details */}
      <div className="flex justify-between border-t-4 border-b-4 border-black py-2 mb-2">
        <div className="text-xs">
          <div><strong>Weight:</strong> {data.weight || '1.0 kg'}</div>
          <div><strong>Dims:</strong> {data.dimensions || 'Standard'}</div>
        </div>
        <QRCodeImage text={data.trackingNumber || 'APX00000000'} />
      </div>

      {/* Instructions */}
      {data.instructions && (
        <div className="text-xs border-b-2 border-black pb-2 mb-2">
          <strong>Instructions:</strong> {data.instructions}
        </div>
      )}

      {/* Barcode */}
      <div className="flex flex-col items-center justify-end flex-grow absolute bottom-4 left-0 right-0">
        <BarcodeImage text={data.trackingNumber || 'APX00000000'} />
        <div className="text-xs font-bold mt-1 tracking-widest">{data.trackingNumber || 'APX00000000'}</div>
      </div>
    </div>
  );
};

export const BillOfLading = ({ data }: { data: DocumentData }) => {
  return (
    <div id="pdf-content" className="w-[210mm] min-h-[297mm] bg-white text-black p-8 mx-auto shadow-lg relative border border-gray-200">
      <BrandHeader title="Bill of Lading" />

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="border border-gray-300 p-3 rounded">
          <h3 className="font-bold text-xs uppercase text-gray-500 mb-1">Shipper / Exporter</h3>
          <div className="font-semibold">{data.sender?.name}</div>
          <div>{data.sender?.company}</div>
          <div className="whitespace-pre-wrap text-sm">{data.sender?.address}</div>
        </div>
        <div className="border border-gray-300 p-3 rounded">
          <h3 className="font-bold text-xs uppercase text-gray-500 mb-1">Consignee</h3>
          <div className="font-semibold">{data.recipient?.name}</div>
          <div>{data.recipient?.company}</div>
          <div className="whitespace-pre-wrap text-sm">{data.recipient?.address}</div>
        </div>
      </div>

      <div className="flex justify-between items-center bg-gray-100 p-3 rounded mb-6 border border-gray-300">
        <div>
          <span className="font-bold text-xs text-gray-500 uppercase block">Tracking / B/L Number</span>
          <span className="font-bold text-lg">{data.trackingNumber || 'APX-BOL-0000'}</span>
        </div>
        <BarcodeImage text={data.trackingNumber || 'APX-BOL-0000'} />
      </div>

      <table className="w-full text-sm border-collapse mb-8">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-2 text-left">Qty</th>
            <th className="border border-gray-300 p-2 text-left">Description of Goods</th>
            <th className="border border-gray-300 p-2 text-right">Weight</th>
            <th className="border border-gray-300 p-2 text-right">Value</th>
          </tr>
        </thead>
        <tbody>
          {(data.items || [{ description: 'General Cargo', quantity: 1, weight: data.weight || '10 kg', value: data.totalValue || 'N/A' }]).map((item, i) => (
            <tr key={i}>
              <td className="border border-gray-300 p-2">{item.quantity}</td>
              <td className="border border-gray-300 p-2">{item.description}</td>
              <td className="border border-gray-300 p-2 text-right">{item.weight}</td>
              <td className="border border-gray-300 p-2 text-right">{item.value}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-auto border-t-2 border-gray-300 pt-6 grid grid-cols-2 gap-8 text-sm">
        <div>
          <div className="mb-8"><strong>Carrier Signature:</strong></div>
          <div className="border-b border-black w-full"></div>
          <div className="mt-1 text-gray-500">Date & Time</div>
        </div>
        <div>
          <div className="mb-8"><strong>Receiver Signature:</strong></div>
          <div className="border-b border-black w-full"></div>
          <div className="mt-1 text-gray-500">Date & Time</div>
        </div>
      </div>
    </div>
  );
};

export const CustomsForm = ({ data }: { data: DocumentData }) => {
  return (
    <div id="pdf-content" className="w-[210mm] min-h-[297mm] bg-white text-black p-8 mx-auto shadow-lg relative border border-gray-200">
      <BrandHeader title="Customs Declaration" />

      <div className="text-center mb-6 text-sm font-bold border-y border-black py-1">
        CN23 - CUSTOMS DECLARATION / DISPATCH NOTE
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="border border-gray-400 p-2 text-sm">
          <div className="font-bold text-xs">From:</div>
          <div>{data.sender?.name}</div>
          <div>{data.sender?.address}</div>
        </div>
        <div className="border border-gray-400 p-2 text-sm">
          <div className="font-bold text-xs">To:</div>
          <div>{data.recipient?.name}</div>
          <div>{data.recipient?.address}</div>
        </div>
      </div>

      <table className="w-full text-xs border-collapse border border-gray-400 mb-4">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-400 p-2">Detailed description of contents</th>
            <th className="border border-gray-400 p-2">Qty</th>
            <th className="border border-gray-400 p-2">Net Weight</th>
            <th className="border border-gray-400 p-2">Value</th>
          </tr>
        </thead>
        <tbody>
          {(data.items || [{ description: 'Commercial Samples', quantity: 1, weight: '1 kg', value: '10.00 USD' }]).map((item, i) => (
            <tr key={i}>
              <td className="border border-gray-400 p-2">{item.description}</td>
              <td className="border border-gray-400 p-2 text-center">{item.quantity}</td>
              <td className="border border-gray-400 p-2 text-right">{item.weight}</td>
              <td className="border border-gray-400 p-2 text-right">{item.value}</td>
            </tr>
          ))}
          <tr className="font-bold">
            <td colSpan={2} className="border border-gray-400 p-2 text-right">TOTAL</td>
            <td className="border border-gray-400 p-2 text-right">{data.weight || '1 kg'}</td>
            <td className="border border-gray-400 p-2 text-right">{data.totalValue || '10.00 USD'}</td>
          </tr>
        </tbody>
      </table>

      <div className="border border-gray-400 p-4 text-xs mt-8">
        <p className="mb-6">I, the undersigned, whose name and address are given on the item, certify that the particulars given in this declaration are correct and that this item does not contain any dangerous article or articles prohibited by legislation or by postal or customs regulations.</p>
        <div className="flex justify-between items-end">
          <div>
            Date: {data.date || new Date().toISOString().split('T')[0]}
          </div>
          <div className="w-64 text-center">
            <div className="border-b border-black mb-1"></div>
            Signature
          </div>
        </div>
      </div>
    </div>
  );
};

export const PackingList = ({ data }: { data: DocumentData }) => {
  return (
    <div id="pdf-content" className="w-[210mm] min-h-[297mm] bg-white text-black p-8 mx-auto shadow-lg relative border border-gray-200">
      <BrandHeader title="Packing List" />

      <div className="flex justify-between mb-8 text-sm">
        <div>
          <div className="font-bold text-gray-500 uppercase">Order / Tracking</div>
          <div className="text-xl font-bold">{data.trackingNumber || 'ORD-000000'}</div>
        </div>
        <div className="text-right">
          <div className="font-bold text-gray-500 uppercase">Date</div>
          <div className="text-lg">{data.date || new Date().toLocaleDateString()}</div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="font-bold border-b-2 border-gray-200 pb-1 mb-2">Ship To</h3>
        <div className="text-sm">
          <div className="font-bold">{data.recipient?.name}</div>
          <div>{data.recipient?.company}</div>
          <div className="whitespace-pre-wrap">{data.recipient?.address}</div>
        </div>
      </div>

      <table className="w-full text-sm mb-8">
        <thead>
          <tr className="border-b-2 border-gray-800">
            <th className="py-2 text-left">Item Description</th>
            <th className="py-2 text-center">Quantity</th>
            <th className="py-2 text-right">Checked</th>
          </tr>
        </thead>
        <tbody>
          {(data.items || [{ description: 'Standard Package', quantity: 1, weight: '', value: '' }]).map((item, i) => (
            <tr key={i} className="border-b border-gray-200">
              <td className="py-3">{item.description}</td>
              <td className="py-3 text-center font-bold">{item.quantity}</td>
              <td className="py-3 text-right">
                <div className="inline-block w-6 h-6 border-2 border-gray-400 rounded"></div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="text-center text-sm text-gray-500 mt-12 italic">
        Please check all items upon receipt. Contact AirPak Express immediately if any items are missing or damaged.
      </div>
    </div>
  );
};
