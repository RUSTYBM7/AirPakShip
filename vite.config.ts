import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import sourceIdentifierPlugin from 'vite-plugin-source-identifier'

const isProd = process.env.BUILD_MODE === 'prod'

// Manual chunk configuration for vendor optimization
const manualChunks = {
  'vendor-react': ['react', 'react-dom', 'react-router-dom'],
  'vendor-ui': ['@radix-ui/react-accordion', '@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-select', '@radix-ui/react-tabs', '@radix-ui/react-tooltip', 'vaul'],
  'vendor-charts': ['recharts'],
  'vendor-motion': ['framer-motion', 'embla-carousel-react', 'react-resizable-panels'],
  'vendor-forms': ['react-hook-form', '@hookform/resolvers', 'zod'],
  'vendor-ai': ['@monaco-editor/react'],
  'vendor-utils': ['date-fns', 'clsx', 'tailwind-merge', 'class-variance-authority', 'lucide-react'],
  'vendor-pdf': ['jspdf', 'jspdf-autotable', 'html2canvas', 'qrcode', 'jsbarcode'],
}

export default defineConfig({
  plugins: [
    react(),
    sourceIdentifierPlugin({
      enabled: !isProd,
      attributePrefix: 'data-matrix',
      includeProps: true,
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: isProd ? manualChunks : undefined,
        chunkFileNames: isProd ? 'assets/[name]-[hash].js' : undefined,
        entryFileNames: isProd ? 'assets/[name]-[hash].js' : undefined,
        assetFileNames: isProd ? 'assets/[name]-[hash].[ext]' : undefined,
      },
    },
    // Enable minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: isProd,
        drop_debugger: isProd,
      },
    },
    // Disable source maps in production for smaller bundles
    sourcemap: !isProd,
    // Chunk size warnings
    chunkSizeWarningLimit: 500,
  },
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'recharts',
      'framer-motion',
      'date-fns',
      'lucide-react',
    ],
  },
})
