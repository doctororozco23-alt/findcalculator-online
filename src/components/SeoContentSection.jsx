import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Calculator, FileText, CheckCircle2 } from 'lucide-react';

export default function SeoContentSection({ schema, lang = 'en' }) {
  if (!schema) return null;

  const isEn = lang === 'en';
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  const title = isEn ? schema.meta.title_en || schema.meta.title : schema.meta.title;
  const longDesc = isEn ? schema.content.longDescription_en || schema.content.longDescription : schema.content.longDescription;
  const methodology = isEn ? schema.content.methodology_en || schema.content.methodology : schema.content.methodology;
  const howToUseList = isEn ? schema.content.howToUse_en || schema.content.howToUse : schema.content.howToUse;

  // Construir ejemplo práctico numérico basado en los primeros 2 o 3 inputs
  const sampleInputs = schema.inputs ? schema.inputs.slice(0, 3) : [];
  const sampleParamsText = sampleInputs
    .map((inp) => `${isEn ? inp.label_en || inp.label : inp.label}: ${inp.default} ${inp.unit || ''}`)
    .join(', ');

  const primaryCalc = schema.calculations ? schema.calculations.find((c) => c.type === 'primary') : null;
  const sampleCalcLabel = primaryCalc ? (isEn ? primaryCalc.label_en || primaryCalc.label : primaryCalc.label) : '';

  // Faqs dinámicas
  const faqs = [
    {
      q: isEn ? `How does the ${title} work?` : `¿Cómo funciona la ${title}?`,
      a: `${longDesc} ${isEn ? 'It calculates results instantly as you modify input parameters.' : 'Calcula los resultados instantáneamente a medida que modificas los valores.'}`,
    },
    {
      q: isEn ? `What mathematical formula is used in this calculator?` : `¿Qué fórmula matemática utiliza esta calculadora?`,
      a: `${methodology}`,
    },
    {
      q: isEn ? `Is this tool free and accurate?` : `¿Esta herramienta es gratuita y precisa?`,
      a: isEn
        ? `Yes, FindCalculator provides 100% free, precise, and instant mathematical evaluation for all users.`
        : `Sí, FindCalculator ofrece evaluación matemática 100% gratuita, precisa e instantánea para todos los usuarios.`,
    },
  ];

  return (
    <div style={{ marginTop: '48px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Sección H2: ¿Cómo funciona? */}
      <div className="card" style={{ padding: '32px 28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              backgroundColor: 'var(--primary-soft)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <FileText size={22} />
          </div>
          <h2 style={{ fontSize: '1.375rem', fontWeight: 800, letterSpacing: '-0.01em' }}>
            {isEn ? `How does the ${title} work?` : `¿Cómo funciona la ${title}?`}
          </h2>
        </div>

        <p style={{ fontSize: '1rem', lineHeight: 1.7, color: 'var(--text-secondary)', marginBottom: '24px' }}>
          {longDesc}
        </p>

        {howToUseList && howToUseList.length > 0 && (
          <div style={{ backgroundColor: 'var(--background)', borderRadius: 'var(--radius-card)', padding: '20px', border: '1px solid var(--border)' }}>
            <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, marginBottom: '12px', color: 'var(--text-primary)' }}>
              {isEn ? 'Step-by-Step Instructions:' : 'Pasos para Realizar el Cálculo:'}
            </h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingLeft: '0', listStyle: 'none' }}>
              {howToUseList.map((step, idx) => (
                <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  <CheckCircle2 size={16} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Sección H3: Fórmula Matemática y Ejemplo Práctico */}
      <div className="card" style={{ padding: '32px 28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              backgroundColor: 'var(--primary-soft)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Calculator size={22} />
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
            {isEn ? 'Applied Mathematical Formula & Example' : 'Fórmula Matemática Aplicada y Ejemplo Práctico'}
          </h3>
        </div>

        {/* Bloque LaTeX KaTeX */}
        <div style={{ marginBottom: '24px' }}>
          <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
            {isEn ? 'Formulas & Equations:' : 'Ecuación Matemática:'}
          </h4>
          <div
            style={{
              backgroundColor: 'var(--surface-hover)',
              borderLeft: '4px solid var(--primary)',
              padding: '16px 20px',
              borderRadius: '6px',
              fontFamily: 'monospace',
              fontSize: '1rem',
              color: 'var(--text-primary)',
            }}
          >
            {primaryCalc && primaryCalc.expression ? (
              <div>
                <p style={{ fontWeight: 700, marginBottom: '6px' }}>
                  $${primaryCalc.id} = {primaryCalc.expression}$$
                </p>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', fontFamily: 'sans-serif' }}>
                  {methodology}
                </p>
              </div>
            ) : (
              <p>$${methodology}$$</p>
            )}
          </div>
        </div>

        {/* Ejemplo Práctico Numérico */}
        <div>
          <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '8px', color: 'var(--text-primary)' }}>
            {isEn ? 'Practical Numerical Example:' : 'Ejemplo Práctico de Uso:'}
          </h4>
          <p style={{ fontSize: '0.9375rem', lineHeight: 1.6, color: 'var(--text-secondary)' }}>
            {isEn
              ? `For instance, if you input ${sampleParamsText || 'default values'}, the engine applies the mathematical relationship to compute ${sampleCalcLabel || 'the output'} automatically in real-time.`
              : `Por ejemplo, si ingresas los parámetros (${sampleParamsText || 'valores predeterminados'}), el motor aplica la relación matemática para determinar ${sampleCalcLabel || 'el resultado'} de forma automática en tiempo real.`}
          </p>
        </div>
      </div>

      {/* Sección H2: Preguntas Frecuentes (FAQ Accordion) */}
      <div className="card" style={{ padding: '32px 28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              backgroundColor: 'var(--primary-soft)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <HelpCircle size={22} />
          </div>
          <h2 style={{ fontSize: '1.375rem', fontWeight: 800, letterSpacing: '-0.01em' }}>
            {isEn ? 'Frequently Asked Questions (FAQ)' : 'Preguntas Frecuentes (FAQ)'}
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                style={{
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-control)',
                  overflow: 'hidden',
                  transition: 'all 0.2s ease',
                }}
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? -1 : idx)}
                  style={{
                    width: '100%',
                    padding: '16px 20px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: isOpen ? 'var(--primary-soft)' : 'var(--background)',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontWeight: 700,
                    fontSize: '0.9375rem',
                    color: isOpen ? 'var(--primary)' : 'var(--text-primary)',
                  }}
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>

                {isOpen && (
                  <div style={{ padding: '16px 20px', backgroundColor: 'var(--card-bg)', fontSize: '0.875rem', lineHeight: 1.6, color: 'var(--text-secondary)' }}>
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
