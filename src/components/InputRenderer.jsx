import React from 'react';
import { HelpCircle } from 'lucide-react';

export default function InputRenderer({ inputDef, value, unit, onChange, onUnitChange, error }) {
  const { id, label, type, help, tooltip, options, units, min, max, step } = inputDef;

  return (
    <div style={{ marginBottom: '20px' }}>
      {/* Label e Icono de Ayuda */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
        <label htmlFor={id} className="input-label" style={{ marginBottom: 0 }}>
          {label}
        </label>
        {tooltip && (
          <span title={tooltip} style={{ cursor: 'help', color: 'var(--text-disabled)', display: 'flex', alignItems: 'center' }}>
            <HelpCircle size={14} />
          </span>
        )}
      </div>

      {/* Selectores y Controles */}
      {type === 'select' && (
        <select
          id={id}
          value={value ?? ''}
          onChange={(e) => {
            const raw = e.target.value;
            const num = Number(raw);
            const parsed = (raw !== '' && !isNaN(num)) ? num : raw;
            onChange(id, parsed);
          }}
          className={`select-field ${error ? 'input-error' : ''}`}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      )}

      {type === 'unit_selector' && (
        <div className="chip-group">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              className={`chip ${value === opt.value ? 'active' : ''}`}
              onClick={() => onChange(id, opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}

      {(type === 'number' || type === 'currency') && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              id={id}
              type="number"
              value={value ?? ''}
              min={min}
              max={max}
              step={step || 'any'}
              onChange={(e) => onChange(id, e.target.value === '' ? '' : Number(e.target.value))}
              className={`input-field tabular-nums ${error ? 'input-error' : ''}`}
              placeholder={`Ej. ${inputDef.default}`}
            />
          </div>

          {/* Chips selector de divisas / unidades */}
          {units && units.length > 0 && (
            <div className="chip-group" style={{ flexWrap: 'wrap' }}>
              {units.map((u) => (
                <button
                  key={u.id}
                  type="button"
                  className={`chip ${unit === u.id ? 'active' : ''}`}
                  onClick={() => onUnitChange && onUnitChange(id, u.id)}
                >
                  {u.label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {type === 'date' && (
        <input
          id={id}
          type="date"
          value={value ?? ''}
          onChange={(e) => onChange(id, e.target.value)}
          className={`input-field ${error ? 'input-error' : ''}`}
          style={{ height: '42px' }}
        />
      )}

      {type === 'slider' && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <input
              type="range"
              min={min || 0}
              max={max || 100}
              step={step || 1}
              value={value ?? min ?? 0}
              onChange={(e) => onChange(id, Number(e.target.value))}
              style={{ flex: 1, accentColor: 'var(--primary)', cursor: 'pointer', height: '6px' }}
            />
            <input
              type="number"
              value={value ?? ''}
              onChange={(e) => onChange(id, Number(e.target.value))}
              className="input-field tabular-nums"
              style={{ width: '90px', height: '36px', textAlign: 'center' }}
            />
          </div>
        </div>
      )}

      {/* Ayuda o Mensaje de Error */}
      {error ? (
        <p style={{ fontSize: '0.75rem', color: 'var(--error)', marginTop: '4px' }}>{error}</p>
      ) : help ? (
        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>{help}</p>
      ) : null}
    </div>
  );
}
