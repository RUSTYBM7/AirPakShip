import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import QRCode from 'qrcode';
import JsBarcode from 'jsbarcode';

export type DocumentType = 'shipping_label' | 'bill_of_lading' | 'customs_form' | 'packing_list' | 'delivery_report';

export interface GeneratePDFOptions {
  elementId: string;
  filename: string;
  format?: 'a4' | 'letter' | [number, number]; // [width, height] in mm for custom like shipping label
  orientation?: 'portrait' | 'landscape';
}

export const DocumentGenerator = {
  /**
   * Generates a PDF from an HTML element using html2canvas and jsPDF.
   */
  async generatePDF({ elementId, filename, format = 'a4', orientation = 'portrait' }: GeneratePDFOptions): Promise<jsPDF> {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`Element with id ${elementId} not found`);
    }

    // Capture the element
    const canvas = await html2canvas(element, {
      scale: 2, // Higher resolution
      useCORS: true,
      logging: false,
    });

    const imgData = canvas.toDataURL('image/png');

    // Create PDF
    const pdf = new jsPDF({
      orientation,
      unit: 'mm',
      format,
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    // Calculate aspect ratio to fit the image on the PDF
    const imgProps = pdf.getImageProperties(imgData);
    const ratio = imgProps.width / imgProps.height;

    let renderWidth = pdfWidth;
    let renderHeight = pdfWidth / ratio;

    // If the image is taller than the page, scale it down to fit height instead
    if (renderHeight > pdfHeight) {
      renderHeight = pdfHeight;
      renderWidth = renderHeight * ratio;
    }

    pdf.addImage(imgData, 'PNG', 0, 0, renderWidth, renderHeight);

    return pdf;
  },

  /**
   * Downloads the generated PDF.
   */
  async downloadPDF(options: GeneratePDFOptions): Promise<void> {
    const pdf = await this.generatePDF(options);
    pdf.save(options.filename);
  },

  /**
   * Returns a base64 Data URL of the generated PDF (useful for previewing in iframe).
   */
  async getPdfDataUrl(options: GeneratePDFOptions): Promise<string> {
    const pdf = await this.generatePDF(options);
    return pdf.output('datauristring');
  },

  /**
   * Generates a QR Code as a Data URL.
   */
  async generateQRCode(text: string): Promise<string> {
    try {
      return await QRCode.toDataURL(text, {
        width: 150,
        margin: 1,
        color: {
          dark: '#0F172A',
          light: '#FFFFFF',
        },
      });
    } catch (err) {
      console.error(err);
      return '';
    }
  },

  /**
   * Generates a Barcode as a Data URL.
   */
  generateBarcode(text: string): string {
    try {
      const canvas = document.createElement('canvas');
      JsBarcode(canvas, text, {
        format: 'CODE128',
        displayValue: true,
        fontSize: 14,
        margin: 5,
        width: 2,
        height: 50,
        lineColor: '#0F172A'
      });
      return canvas.toDataURL('image/png');
    } catch (err) {
      console.error(err);
      return '';
    }
  }
};
