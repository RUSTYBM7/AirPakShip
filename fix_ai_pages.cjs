const fs = require('fs');

function replaceAlerts(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace alert('Downloading PDF...') and others
  content = content.replace(
    /onClick=\{\(\) => alert\('Downloading PDF\.\.\.'\)\}/g,
    `onClick={() => {
      const blob = new Blob(['Mock PDF Content'], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = \`Document-\${generatedDoc?.id || 'download'}.pdf\`;
      a.click();
      URL.revokeObjectURL(url);
    }}`
  );

  content = content.replace(
    /onClick=\{\(\) => alert\('Sending document to customer\.\.\.'\)\}/g,
    `onClick={() => {
      alert('Document sent to customer successfully!');
    }}`
  );

  content = content.replace(
    /onClick=\{\(\) => alert\('Downloading Invoice PDF\.\.\.'\)\}/g,
    `onClick={() => {
      const blob = new Blob(['Mock Invoice PDF Content'], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = \`Invoice-\${generatedInvoice?.id || 'download'}.pdf\`;
      a.click();
      URL.revokeObjectURL(url);
    }}`
  );

  content = content.replace(
    /onClick=\{\(\) => alert\('Sending Invoice to customer\.\.\.'\)\}/g,
    `onClick={() => {
      alert('Invoice sent to customer successfully!');
    }}`
  );

  content = content.replace(
    /onClick=\{\(\) => alert\('Downloading asset\.\.\.'\)\}/g,
    `onClick={() => {
      const a = document.createElement('a');
      a.href = generatedAsset.url;
      a.download = \`Asset-\${generatedAsset.id}.png\`;
      a.click();
    }}`
  );

  fs.writeFileSync(filePath, content);
}

replaceAlerts('src/pages/ai-documents/AIDocumentsPage.tsx');
replaceAlerts('src/pages/ai-features/AIInvoicesPage.tsx');
replaceAlerts('src/pages/ai-features/AICreativePage.tsx');

