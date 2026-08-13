import React, { useState } from 'react';
import { Copy, Check, Sparkles } from 'lucide-react';
import { formatValue } from '../engine/formulaEngine';
import { i18n } from '../data/i18n';

export default function ResultPanel({
  lang = 'en',
  primaryCalc,
  secondaryCalcs,
  results,
  interpretations,
  onToggleAI,
  aiOpen,
  aiEnabled,
  activeCurrency = 'EUR'
}) {
  const [copied, setCopied] = useState(false);
  const t = i18n[lang] || i18n.en;

  if (!primaryCalc) return null;

  const primaryValue = results[primaryCalc.id];
  const primaryUnit = typeof primaryCalc.unit === 'object' && primaryCalc.unit.follows ? activeCurrency : primaryCalc.unit;
  const primaryFormatted = formatValue(primaryValue, primaryCalc.format, primaryCalc.precision, primaryUnit, activeCurrency);
  const primaryInterp = interpretations[primaryCalc.id];

  const handleCopy = () => {
    if (primaryFormatted && primaryFormatted !== '—') {
      navigator.clipboard.writeText(`${primaryCalc.label}: ${primaryFormatted}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      className="card"
      style={{
        borderColor: 'var(--primary)',
        backgroundColor: 'var(--surface)',
        position: 'sticky',
        top: '80px'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
        <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {primaryCalc.label}
        </span>

        <button
          onClick={handleCopy}
          className="btn-secondary"
          style={{ height: '32px', padding: '0 10px', fontSize: '0.75rem', gap: '4px' }}
        >
          {copied ? <Check size={14} color="var(--success)" /> : <Copy size={14} />}
          <span>{copied ? t.calculator.copied : t.calculator.copy}</span>
        </button>
      </div>

      {/* Valor XL Principal Héroe */}
      <div
        className="tabular-nums result-pulse"
        style={{
          fontSize: '2.5rem',
          fontWeight: 700,
          color: 'var(--text-primary)',
          lineHeight: 1.1,
          marginBottom: '12px'
        }}
      >
        {primaryFormatted}
      </div>

      {/* Interpretación o Badge */}
      {primaryInterp && (
        <div style={{ marginBottom: '16px' }}>
          <span className={`badge badge-${primaryInterp.tone || 'neutral'}`}>
            {primaryInterp.label}
          </span>
          {primaryInterp.text && (
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '6px' }}>
              {primaryInterp.text}
            </p>
          )}
        </div>
      )}

      {/* Resultados Secundarios */}
      {secondaryCalcs && secondaryCalcs.length > 0 && (
        <div
          style={{
            borderTop: '1px solid var(--border)',
            paddingTop: '16px',
            marginTop: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}
        >
          {secondaryCalcs.map((calc) => {
            const val = results[calc.id];
            const secUnit = typeof calc.unit === 'object' && calc.unit.follows ? activeCurrency : calc.unit;
            const formatted = formatValue(val, calc.format, calc.precision, secUnit, activeCurrency);
            return (
              <div key={calc.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>{calc.label}:</span>
                <span className="tabular-nums" style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{formatted}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* Disparador de Análisis de IA */}
      {aiEnabled && (
        <div style={{ marginTop: '20px', borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
          <button
            onClick={onToggleAI}
            className="btn-ai"
            style={{ width: '100%' }}
          >
            <Sparkles size={18} />
            <span>{aiOpen ? t.calculator.hideAI : t.calculator.analyzeAI}</span>
          </button>
        </div>
      )}
    </div>
  );
}
