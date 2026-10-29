import React from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';

// same flag files as the EMS-ESP WebUI (interface/src/i18n/*.svg)
// the language code is the file name, except for English which uses the GB flag
const FLAG_FILES = {
  en: 'GB',
  de: 'DE',
  nl: 'NL',
  sv: 'SV',
  pl: 'PL',
  no: 'NO',
  fr: 'FR',
  tr: 'TR',
  it: 'IT',
  sk: 'SK',
  cs: 'CS',
  hu: 'HU',
};

/** flag image followed by the upper-case language code (or `label` when given) */
export default function LanguageFlag({code, label}) {
  const file = FLAG_FILES[code.toLowerCase()];
  const src = useBaseUrl(file ? `/img/flags/${file}.svg` : '/');
  return (
    <span style={{display: 'inline-flex', alignItems: 'center', gap: '0.4rem'}}>
      {file && (
        <img
          src={src}
          alt=""
          width={20}
          height={14}
          style={{
            width: 20,
            height: 14,
            objectFit: 'cover',
            borderRadius: 2,
            boxShadow: '0 0 0 1px rgba(128,128,128,0.4)',
          }}
        />
      )}
      {label ?? code.toUpperCase()}
    </span>
  );
}
