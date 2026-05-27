import React, { useState, useRef } from 'react';
import Editor, { useMonaco, EditorProps } from '@monaco-editor/react';

interface CodeEditorProps {
  language: string;
  code: string;
  onChange: (value: string | undefined) => void;
  readOnly?: boolean;
}

export function CodeEditor({ language, code, onChange, readOnly = false }: CodeEditorProps) {
  const monaco = useMonaco();

  React.useEffect(() => {
    if (monaco) {
      monaco.editor.defineTheme('airpak-dark', {
        base: 'vs-dark',
        inherit: true,
        rules: [
          { token: 'comment', foreground: '6b7280', fontStyle: 'italic' },
          { token: 'keyword', foreground: 'c678dd' },
          { token: 'string', foreground: '98c379' },
          { token: 'number', foreground: 'd19a66' },
        ],
        colors: {
          'editor.background': '#111827',
          'editor.foreground': '#f3f4f6',
          'editor.lineHighlightBackground': '#1f2937',
          'editorLineNumber.foreground': '#4b5563',
          'editorIndentGuide.background': '#374151',
          'editor.selectionBackground': '#374151',
        }
      });
      monaco.editor.setTheme('airpak-dark');
    }
  }, [monaco]);

  const handleEditorDidMount = (editor: any, monaco: any) => {
    // Basic formatting configuration
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      editor.getAction('editor.action.formatDocument').run();
    });
  };

  return (
    <div className="h-full w-full rounded-lg overflow-hidden border border-gray-800">
      <Editor
        height="100%"
        language={language.toLowerCase()}
        theme="airpak-dark"
        value={code}
        onChange={onChange}
        options={{
          readOnly,
          minimap: { enabled: false },
          fontSize: 14,
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
          lineHeight: 24,
          padding: { top: 16, bottom: 16 },
          scrollBeyondLastLine: false,
          smoothScrolling: true,
          cursorBlinking: 'smooth',
          cursorSmoothCaretAnimation: 'on',
          formatOnPaste: true,
          formatOnType: true,
        }}
        onMount={handleEditorDidMount}
        loading={
          <div className="h-full w-full flex items-center justify-center bg-gray-900 text-gray-400">
            Loading Editor...
          </div>
        }
      />
    </div>
  );
}
