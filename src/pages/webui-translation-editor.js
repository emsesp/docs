import React from 'react';
import Layout from '@theme/Layout';
import WebUITranslationEditor from '@site/src/components/WebUITranslationEditor';

export default function WebUITranslationEditorPage() {
  return (
    <Layout
      title="WebUI Translation Editor"
      description="Edit the EMS-ESP WebUI translations (interface/src/i18n)"
      noIndex>
      {/* full width: .main-wrapper is a flex column, so auto margins would
          otherwise shrink-wrap and center the content */}
      <main style={{width: '100%', padding: '0 1rem', boxSizing: 'border-box'}}>
        <h1 style={{margin: '0.75rem 0 0'}}>WebUI Translation Editor</h1>
        <WebUITranslationEditor />
      </main>
    </Layout>
  );
}
