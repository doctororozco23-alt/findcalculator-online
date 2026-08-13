import React, { useState } from 'react';
import { BookOpen, ChevronDown, ChevronUp } from 'lucide-react';
import { i18n } from '../data/i18n';

export default function InDepthGuide({ guideSections, lang = 'en' }) {
  if (!guideSections || !Array.isArray(guideSections) || guideSections.length === 0) {
    return null;
  }

  const isEn = lang === 'en';
  const t = i18n[lang] || i18n.en;
  const [activeTabId, setActiveTabId] = useState(guideSections[0]?.id || '');
  const [isMainOpen, setIsMainOpen] = useState(true);

  const activeSection = guideSections.find((s) => s.id === activeTabId) || guideSections[0];

  return (
    <div className="card" style={{ marginTop: '40px', padding: '28px 24px' }}>
      {/* Header Principal del Acordeón Educativo */}
      <div
        onClick={() => setIsMainOpen(!isMainOpen)}
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            backgroundColor: 'var(--primary-soft)',
            color: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <BookOpen size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.01em' }}>
              {isEn ? 'In-Depth Guide & Methodological Science' : 'Guía Profunda y Base Metodológica'}
            </h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
              {isEn ? 'Comprehensive reference, formulas, tables, and domain considerations.' : 'Explicación detallada, tablas de referencia, fórmulas y consideraciones.'}
            </p>
          </div>
        </div>
        {isMainOpen ? <ChevronUp size={22} color="var(--text-secondary)" /> : <ChevronDown size={22} color="var(--text-secondary)" />}
      </div>

      {isMainOpen && (
        <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid var(--border)' }}>
          {/* Bar de Pestañas / Categorías Dinámicas Adaptadas */}
          <div
            style={{
              display: 'flex',
              gap: '8px',
              overflowX: 'auto',
              paddingBottom: '12px',
              borderBottom: '1px solid var(--border)',
              marginBottom: '24px'
            }}
          >
            {guideSections.map((sec) => {
              const secTitle = isEn ? sec.title || sec.title_es : sec.title_es || sec.title;
              const isActive = sec.id === activeTabId;

              return (
                <button
                  key={sec.id}
                  type="button"
                  onClick={() => setActiveTabId(sec.id)}
                  className={`chip ${isActive ? 'active' : ''}`}
                  style={{
                    padding: '10px 18px',
                    borderRadius: 'var(--radius-control)',
                    whiteSpace: 'nowrap',
                    fontWeight: isActive ? 700 : 500,
                    fontSize: '0.875rem'
                  }}
                >
                  {sec.icon ? `${sec.icon} ` : ''}
                  {secTitle}
                </button>
              );
            })}
          </div>

          {/* Contenido Extenso de la Pestaña Seleccionada */}
          {activeSection && (
            <div style={{ fontSize: '0.9375rem', lineHeight: 1.7, color: 'var(--text-primary)' }}>
              <h4 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '16px', color: 'var(--text-primary)', borderBottom: '2px solid var(--primary-soft)', paddingBottom: '6px' }}>
                {isEn ? activeSection.title || activeSection.title_es : activeSection.title_es || activeSection.title}
              </h4>

              {/* Renderizado de HTML Rico */}
              <div
                className="guide-content-body"
                style={{ color: 'var(--text-secondary)' }}
                dangerouslySetInnerHTML={{
                  __html: isEn
                    ? activeSection.content_html_en || activeSection.content_html || activeSection.content
                    : activeSection.content_html || activeSection.content
                }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
