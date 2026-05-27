import React, { useState } from 'react';
import {
  FileText,
  Download,
  Mail,
  Loader2,
  Sparkles,
  Check,
  Globe,
  Palette,
  Shield,
  AlertCircle,
  Eye,
  Zap,
  Package,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { createAuditLog } from '../../services/audit';

// Document types
const documentTypes = [
  { id: 'waybill', name: 'Air Waybill', icon: FileText, description: 'Shipping air waybill document' },
  { id: 'invoice', name: 'Commercial Invoice', icon: FileText, description: 'Invoice for customs clearance' },
  { id: 'packing_list', name: 'Packing List', icon: FileText, description: 'Detailed package contents' },
  { id: 'customs_declaration', name: 'Customs Declaration', icon: Shield, description: 'Import/export declaration' },
  { id: 'certificate_of_origin', name: 'Certificate of Origin', icon: Globe, description: 'Origin certification' },
];

// Languages
const languages = [
  { code: 'en', name: 'English' },
  { code: 'zh', name: 'Chinese (中文)' },
  { code: 'es', name: 'Spanish (Español)' },
  { code: 'fr', name: 'French (Français)' },
  { code: 'de', name: 'German (Deutsch)' },
  { code: 'ja', name: 'Japanese (日本語)' },
];

// Template styles
const templateStyles = [
  { id: 'modern', name: 'Modern', description: 'Clean, professional design' },
  { id: 'classic', name: 'Classic', description: 'Traditional business style' },
  { id: 'minimal', name: 'Minimal', description: 'Simple, understated elegance' },
];

// Mock shipments for selection
const mockShipments = [
  { id: 'APK001234', tracking: 'APK20240525001234', customer: 'John Smith', origin: 'Singapore', destination: 'London, UK', status: 'in_transit' },
  { id: 'APK001233', tracking: 'APK20240524001233', customer: 'Sarah Lee', origin: 'Kuala Lumpur', destination: 'Sydney, AU', status: 'delivered' },
  { id: 'APK001232', tracking: 'APK20240524001232', customer: 'Mike Chen', origin: 'London, UK', destination: 'New York, US', status: 'pending' },
  { id: 'APK001231', tracking: 'APK20240523001231', customer: 'Emma Wilson', origin: 'Singapore', destination: 'Tokyo, JP', status: 'out_for_delivery' },
  { id: 'APK001230', tracking: 'APK20240523001230', customer: 'David Brown', origin: 'Hong Kong', destination: 'Berlin, DE', status: 'in_transit' },
];

const AIDocumentsPage: React.FC = () => {
  const { user, canAccess } = useAuth();
  const [selectedType, setSelectedType] = useState<string>('waybill');
  const [selectedShipments, setSelectedShipments] = useState<string[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('en');
  const [templateStyle, setTemplateStyle] = useState<string>('modern');
  const [includeBranding, setIncludeBranding] = useState(true);
  const [aiEnhancements, setAiEnhancements] = useState({
    smart_descriptions: true,
    compliance_check: true,
    auto_translate: false,
    risk_assessment: true,
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDoc, setGeneratedDoc] = useState<any>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);

  // Check permissions
  if (user && !canAccess('ai-documents', 'read')) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-slate-400">You don't have permission to access AI Documents.</p>
        </div>
      </div>
    );
  }

  const toggleShipment = (id: string) => {
    setSelectedShipments((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleGenerate = async () => {
    if (selectedShipments.length === 0) {
      alert('Please select at least one shipment');
      return;
    }

    setIsGenerating(true);
    setGenerationProgress(0);

    try {
      // Simulate generation progress
      const progressSteps = [10, 30, 50, 70, 90, 100];
      for (const step of progressSteps) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        setGenerationProgress(step);
      }

      // Generate mock document
      const doc = {
        id: `DOC-${Date.now()}`,
        type: selectedType,
        language: selectedLanguage,
        style: templateStyle,
        shipments: selectedShipments,
        generatedAt: new Date().toISOString(),
        previewUrl: '/preview.pdf',
      };

      setGeneratedDoc(doc);

      // Audit log
      if (user) {
        await createAuditLog({
          user_id: user.id,
          user_email: user.email,
          action: 'AI_DOCUMENT_GENERATED',
          resource_type: 'ai-documents',
          resource_id: doc.id,
          details: {
            type: selectedType,
            shipment_count: selectedShipments.length,
            ai_features: aiEnhancements,
          },
          ai_tokens_used: 1500,
          ai_cost_usd: 0.03,
        });
      }
    } catch (error) {
      console.error('Document generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const DocumentTypeIcon = documentTypes.find((d) => d.id === selectedType)?.icon || FileText;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-red-600 to-red-700 rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/30">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">AI Document Generator</h1>
            <p className="text-slate-400 mt-1">Generate professional logistics documents with AI</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 bg-red-500/10 text-red-400 text-sm font-medium rounded-full flex items-center gap-1">
            <Zap className="w-4 h-4" />
            AI Powered
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Configuration */}
        <div className="lg:col-span-2 space-y-6">
          {/* Document Type Selection */}
          <div className="bg-slate-900/50 rounded-2xl border border-slate-800/50 p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-red-400" />
              Document Type
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {documentTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.id}
                    onClick={() => setSelectedType(type.id)}
                    className={`p-4 rounded-xl border transition-all text-left ${
                      selectedType === type.id
                        ? 'bg-red-500/10 border-red-500/50 text-white'
                        : 'bg-slate-800/50 border-slate-700/50 text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    <Icon className={`w-6 h-6 mb-2 ${selectedType === type.id ? 'text-red-400' : 'text-slate-500'}`} />
                    <p className="font-medium">{type.name}</p>
                    <p className="text-xs text-slate-500 mt-1">{type.description}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Shipment Selection */}
          <div className="bg-slate-900/50 rounded-2xl border border-slate-800/50 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Package className="w-5 h-5 text-red-400" />
                Select Shipments
              </h3>
              <span className="text-sm text-slate-400">{selectedShipments.length} selected</span>
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {mockShipments.map((shipment) => (
                <button
                  key={shipment.id}
                  onClick={() => toggleShipment(shipment.id)}
                  className={`w-full p-4 rounded-xl border transition-all flex items-center gap-4 ${
                    selectedShipments.includes(shipment.id)
                      ? 'bg-red-500/10 border-red-500/50'
                      : 'bg-slate-800/50 border-slate-700/50 hover:border-slate-600'
                  }`}
                >
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                    selectedShipments.includes(shipment.id)
                      ? 'bg-red-500 border-red-500'
                      : 'border-slate-600'
                  }`}>
                    {selectedShipments.includes(shipment.id) && (
                      <Check className="w-3 h-3 text-white" />
                    )}
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium text-white">{shipment.tracking}</p>
                    <p className="text-sm text-slate-400">{shipment.customer} • {shipment.origin} → {shipment.destination}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Options */}
          <div className="bg-slate-900/50 rounded-2xl border border-slate-800/50 p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Palette className="w-5 h-5 text-red-400" />
              Options
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Language */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Document Language</label>
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  {languages.map((lang) => (
                    <option key={lang.code} value={lang.code}>{lang.name}</option>
                  ))}
                </select>
              </div>

              {/* Template Style */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Template Style</label>
                <select
                  value={templateStyle}
                  onChange={(e) => setTemplateStyle(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  {templateStyles.map((style) => (
                    <option key={style.id} value={style.id}>{style.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Include Branding */}
            <div className="mt-6">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeBranding}
                  onChange={(e) => setIncludeBranding(e.target.checked)}
                  className="w-5 h-5 rounded border-slate-600 bg-slate-700 text-red-500 focus:ring-red-500 focus:ring-offset-slate-900"
                />
                <div>
                  <p className="font-medium text-white">Include AirPak Branding</p>
                  <p className="text-sm text-slate-400">Logo, colors, and company information</p>
                </div>
              </label>
            </div>
          </div>

          {/* AI Enhancements */}
          <div className="bg-slate-900/50 rounded-2xl border border-slate-800/50 p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-red-400" />
              AI Enhancements
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { key: 'smart_descriptions', title: 'Smart Descriptions', desc: 'AI writes professional item descriptions', icon: FileText },
                { key: 'compliance_check', title: 'Compliance Check', desc: 'Verify regulatory requirements', icon: Shield },
                { key: 'auto_translate', title: 'Auto Translate', desc: 'Translate to selected language', icon: Globe },
                { key: 'risk_assessment', title: 'Risk Assessment', desc: 'Flag potential customs issues', icon: AlertCircle },
              ].map((feature) => {
                const Icon = feature.icon;
                return (
                  <label
                    key={feature.key}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      aiEnhancements[feature.key as keyof typeof aiEnhancements]
                        ? 'bg-green-500/5 border-green-500/30'
                        : 'bg-slate-800/50 border-slate-700/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={aiEnhancements[feature.key as keyof typeof aiEnhancements]}
                        onChange={(e) => setAiEnhancements((prev) => ({
                          ...prev,
                          [feature.key]: e.target.checked,
                        }))}
                        className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-green-500 focus:ring-green-500"
                      />
                      <Icon className={`w-5 h-5 ${aiEnhancements[feature.key as keyof typeof aiEnhancements] ? 'text-green-400' : 'text-slate-500'}`} />
                      <div>
                        <p className="font-medium text-white text-sm">{feature.title}</p>
                        <p className="text-xs text-slate-400">{feature.desc}</p>
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column - Preview & Actions */}
        <div className="lg:col-span-1">
          <div className="bg-slate-900/50 rounded-2xl border border-slate-800/50 p-6 sticky top-24">
            {/* Preview */}
            <h3 className="text-lg font-semibold text-white mb-4">Preview</h3>
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-4 mb-6">
              <div className="aspect-[3/4] bg-slate-700/50 rounded-lg flex flex-col items-center justify-center overflow-hidden">
                {generatedDoc ? (
                  showPreview ? (
                    <div className="w-full h-full p-4 overflow-auto text-sm text-slate-300 bg-white/5 font-mono">
                      <h4 className="text-white font-bold mb-2">DOCUMENT PREVIEW</h4>
                      <p><strong>ID:</strong> {generatedDoc.id}</p>
                      <p><strong>Type:</strong> {generatedDoc.type}</p>
                      <p><strong>Language:</strong> {generatedDoc.language}</p>
                      <p><strong>Style:</strong> {generatedDoc.style}</p>
                      <p><strong>Shipments:</strong> {generatedDoc.shipments.join(', ')}</p>
                      <div className="mt-4 border-t border-slate-600 pt-4">
                        <p className="opacity-70">[Simulated Content based on AI generation]</p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center p-4">
                      <Check className="w-12 h-12 text-green-400 mx-auto mb-2" />
                      <p className="text-white font-medium">Document Ready!</p>
                      <p className="text-slate-400 text-sm mt-1">{generatedDoc.id}</p>
                    </div>
                  )
                ) : (
                  <div className="text-center p-4">
                    <Eye className="w-12 h-12 text-slate-500 mx-auto mb-2" />
                    <p className="text-slate-400 text-sm">Select options to preview</p>
                  </div>
                )}
              </div>
            </div>

            {/* Summary */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Document Type</span>
                <span className="text-white">{documentTypes.find((d) => d.id === selectedType)?.name}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Shipments</span>
                <span className="text-white">{selectedShipments.length}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Language</span>
                <span className="text-white">{languages.find((l) => l.code === selectedLanguage)?.name}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Style</span>
                <span className="text-white capitalize">{templateStyle}</span>
              </div>
            </div>

            {/* Progress */}
            {isGenerating && (
              <div className="mb-6">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-slate-400">Generating...</span>
                  <span className="text-red-400">{generationProgress}%</span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-red-600 to-red-500 transition-all duration-300"
                    style={{ width: `${generationProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-3">
              <button
                onClick={handleGenerate}
                disabled={selectedShipments.length === 0 || isGenerating}
                className="w-full py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold rounded-xl shadow-lg shadow-red-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Generate Document
                  </>
                )}
              </button>

              {generatedDoc && (
                <div className="space-y-2">
                  <button onClick={() => setShowPreview(!showPreview)} className="w-full py-3 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2">
                    <Eye className="w-5 h-5" />
                    Preview
                  </button>
                  <button onClick={() => alert('Downloading PDF...')} className="w-full py-3 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2">
                    <Download className="w-5 h-5" />
                    Download PDF
                  </button>
                  <button onClick={() => alert('Sending document to customer...')} className="w-full py-3 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2">
                    <Mail className="w-5 h-5" />
                    Send to Customer
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIDocumentsPage;