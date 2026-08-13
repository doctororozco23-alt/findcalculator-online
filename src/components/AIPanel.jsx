import React from 'react';
import { Sparkles, Info } from 'lucide-react';
import { formatValue } from '../engine/formulaEngine';
import { i18n } from '../data/i18n';

export default function AIPanel({
  aiConfig,
  results = {},
  schema,
  isOpen,
  lang = 'en',
  activeCurrency = 'EUR',
  units = {}
}) {
  if (!isOpen || !aiConfig || !aiConfig.enabled) return null;

  const isEn = lang === 'en';
  const t = i18n[lang] || i18n.en;

  const role = isEn ? aiConfig.role_en || aiConfig.role : aiConfig.role;
  const instructions = isEn ? aiConfig.instructions_en || aiConfig.instructions : aiConfig.instructions || [];

  // Generar síntesis técnica respetando 100% las divisas y unidades activas del usuario
  const includedVals = (aiConfig.includeData || [])
    .map((key) => {
      const calc = schema.calculations?.find((c) => c.id === key);
      const input = schema.inputs?.find((i) => i.id === key);
      const target = calc || input;
      if (!target) return null;

      const label = isEn ? target.label_en || target.label : target.label;
      const val = results[key] ?? target.default;
      if (val === null || val === undefined || isNaN(val)) return null;

      // Determinar la unidad/divisa activa real
      let activeUnit = typeof target.unit === 'string' ? target.unit : null;

      if (typeof target.unit === 'object' && target.unit.follows) {
        const followedInputId = target.unit.follows;
        activeUnit = units[followedInputId] || activeCurrency;
      } else if (units[key]) {
        activeUnit = units[key];
      } else if (target.type === 'currency' || target.format === 'currency') {
        activeUnit = activeCurrency;
      }

      const fmt = target.format || (target.type === 'currency' ? 'currency' : 'number');
      const prec = target.precision ?? 2;

      return `${label}: ${formatValue(val, fmt, prec, activeUnit, activeCurrency)}`;
    })
    .filter(Boolean);

  const introText = isEn
    ? `Based on your entered values${includedVals.length > 0 ? ` (${includedVals.join(' · ')})` : ''}, here is a smart technical synthesis:`
    : `Basado en tus valores ingresados${includedVals.length > 0 ? ` (${includedVals.join(' · ')})` : ''}, aquí tienes una síntesis técnica explicativa:`;

  const disclaimerText = isEn
    ? "This analysis is for informational purposes only and does not substitute professional advice."
    : "Este análisis es únicamente orientativo e informativo y no sustituye asesoramiento profesional.";

  return (
    <div
      style={{
        backgroundColor: 'var(--ai-soft)',
        border: '1px solid var(--ai-border)',
        borderRadius: 'var(--radius-card)',
        padding: '20px',
        marginTop: '20px',
        transition: 'all 0.3s ease'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--ai)', marginBottom: '12px' }}>
        <Sparkles size={20} />
        <h4 style={{ fontWeight: 700, fontSize: '0.9375rem' }}>
          {isEn ? 'Smart Local AI Analysis' : 'Análisis Inteligente Local'}
        </h4>
        {role && (
          <span style={{ fontSize: '0.6875rem', fontWeight: 600, backgroundColor: 'rgba(124, 58, 237, 0.1)', padding: '2px 8px', borderRadius: '12px' }}>
            {role}
          </span>
        )}
      </div>

      <div style={{ fontSize: '0.875rem', color: 'var(--text-primary)', lineHeight: 1.6, marginBottom: '16px' }}>
        <p style={{ marginBottom: '8px' }}>{introText}</p>
        {Array.isArray(instructions) && instructions.length > 0 && (
          <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {instructions.map((inst, idx) => (
              <li key={idx} style={{ color: 'var(--text-secondary)' }}>
                {inst}
              </li>
            ))}
          </ul>
        )}
      </div>

      {aiConfig.disclaimer && (
        <div
          style={{
            display: 'flex',
            gap: '6px',
            alignItems: 'center',
            fontSize: '0.75rem',
            color: 'var(--text-disabled)',
            borderTop: '1px solid var(--ai-border)',
            paddingTop: '10px'
          }}
        >
          <Info size={14} />
          <span>{disclaimerText}</span>
        </div>
      )}
    </div>
  );
}
