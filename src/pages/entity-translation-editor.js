import React from 'react';
import Layout from '@theme/Layout';
import TranslationEditor from '@site/src/components/TranslationEditor';

export default function TranslationEditorPage() {
  return (
    <Layout
      title="Entity Translation Editor"
      description="Edit the EMS-ESP entity translations (locale_translations.h)"
      noIndex>
      {/* full width: .main-wrapper is a flex column, so auto margins would
          otherwise shrink-wrap and center the content */}
      <main style={{width: '100%', padding: '0 1rem', boxSizing: 'border-box'}}>
        <h1 style={{margin: '0.75rem 0 0'}}>Entity Translation Editor</h1>
        <TranslationEditor />
      </main>
    </Layout>
  );
}
