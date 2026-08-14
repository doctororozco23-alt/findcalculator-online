import React, { useState, useEffect, useMemo } from 'react';
import InputRenderer from './InputRenderer';
import ResultPanel from './ResultPanel';
import TableRenderer from './TableRenderer';
import ChartRenderer from './ChartRenderer';
import AIPanel from './AIPanel';
import InDepthGuide from './InDepthGuide';
import SeoHead from './SeoHead';
import SeoContentSection from './SeoContentSection';
import AdBanner from './AdBanner';
import { evaluateCalculations, generateTable } from '../engine/formulaEngine';
import { saveState, loadState, clearState } from '../engine/persistenceService';
import { evaluateCondition } from '../engine/conditionEngine';
import { i18n } from '../data/i18n';
import { RotateCcw, Clock, X } from 'lucide-react';

export default function CalculatorRenderer({ schema, lang = 'en' }) {
  if (!schema) return null;
  const t = i18n[lang] || i18n.en;

  const [wasRestored, setWasRestored] = useState(false);

  const initialValues = useMemo(() => {
    const defaults = {};
    schema.inputs.forEach((input) => {
      defaults[input.id] = input.default;
    });

    if (schema.persistence?.enabled) {
      const restored = loadState(schema.meta.id);
      if (restored && restored.values) {
        setWasRestored(true);
        return { ...defaults, ...restored.values };
      }
    }

    setWasRestored(false);
    return defaults;
  }, [schema]);

  const initialUnits = useMemo(() => {
    const unitsMap = {};
    schema.inputs.forEach((input) => {
      if (input.units && input.units.length > 0) {
        unitsMap[input.id] = input.units[0].id;
      }
    });

    if (schema.persistence?.enabled) {
      const restored = loadState(schema.meta.id);
      if (restored && restored.units) {
        return { ...unitsMap, ...restored.units };
      }
    }

    return unitsMap;
  }, [schema]);

  const [values, setValues] = useState(initialValues);
  const [units, setUnits] = useState(initialUnits);
  const [errors, setErrors] = useState({});
  const [aiOpen, setAiOpen] = useState(false);

  useEffect(() => {
    setValues(initialValues);
    setUnits(initialUnits);
    setErrors({});
    setAiOpen(false);
  }, [schema]);

  useEffect(() => {
    if (schema.persistence?.enabled) {
      const timer = setTimeout(() => {
        saveState(schema.meta.id, values, units);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [schema, values, units]);

  const activeCurrency = useMemo(() => {
    const currencyInput = schema.inputs.find((i) => i.type === 'currency' && units[i.id]);
    if (currencyInput && units[currencyInput.id]) {
      return units[currencyInput.id];
    }
    return 'EUR';
  }, [schema, units]);

  const handleInputChange = (inputId, rawValue) => {
    const inputDef = schema.inputs.find((i) => i.id === inputId);

    if (inputDef && inputDef.validation) {
      let err = null;
      inputDef.validation.forEach((rule) => {
        if (rule.rule === 'required' && (rawValue === '' || rawValue === null)) {
          err = rule.message || 'Required field';
        } else if (rule.rule === 'between' && Array.isArray(rule.params)) {
          const num = Number(rawValue);
          if (num < rule.params[0] || num > rule.params[1]) {
            err = rule.message || `Enter a value between ${rule.params[0]} and ${rule.params[1]}`;
          }
        }
      });
      setErrors((prev) => ({ ...prev, [inputId]: err }));
    }

    let baseValue = rawValue;
    if (inputDef && inputDef.units && units[inputId]) {
      const activeUnitObj = inputDef.units.find((u) => u.id === units[inputId]);
      if (activeUnitObj && activeUnitObj.toBase) {
        baseValue = typeof rawValue === 'number' ? rawValue * activeUnitObj.toBase : rawValue;
      }
    }

    setValues((prev) => ({ ...prev, [inputId]: baseValue }));
  };

  const handleUnitChange = (inputId, newUnitId) => {
    setUnits((prev) => ({ ...prev, [inputId]: newUnitId }));
  };

  const handleReset = () => {
    clearState(schema.meta.id);
    setWasRestored(false);
    const defaults = {};
    schema.inputs.forEach((i) => (defaults[i.id] = i.default));
    setValues(defaults);
    setErrors({});
  };

  const { results, scope, interpretations } = useMemo(() => {
    return evaluateCalculations(schema, values);
  }, [schema, values]);

  const tableData = useMemo(() => {
    if (!schema.tables || schema.tables.length === 0) return null;
    return generateTable(schema.tables[0], scope);
  }, [schema, scope]);

  const primaryCalc = schema.calculations.find((c) => c.type === 'primary' && (!c.visibleWhen || evaluateCondition(c.visibleWhen, scope)));
  const secondaryCalcs = schema.calculations.filter((c) => c.type === 'secondary' && (!c.visibleWhen || evaluateCondition(c.visibleWhen, scope)));
  const visibleInputs = schema.inputs.filter((i) => !i.visibleWhen || evaluateCondition(i.visibleWhen, scope));

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 16px' }}>
      {/* Marcado de Datos Estructurados JSON-LD Dinámico en Head */}
      <SeoHead schema={schema} lang={lang} />

      {/* Aviso de restauración de sesión guardada */}
      {wasRestored && (
        <div
          style={{
            backgroundColor: 'var(--primary-soft)',
            border: '1px solid var(--primary)',
            borderRadius: 'var(--radius-control)',
            padding: '10px 16px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.8125rem',
            color: 'var(--primary)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock size={16} />
            <span>
              {lang === 'en'
                ? 'Restored saved inputs from your previous session (1h temporal privacy).'
                : 'Restaurados tus valores guardados de la sesión previa (1h de retención local).'}
            </span>
          </div>
          <button
            onClick={handleReset}
            style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            <span>{lang === 'en' ? 'Clear' : 'Limpiar'}</span>
            <X size={14} />
          </button>
        </div>
      )}

      {/* Encabezado */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
          <span className="badge badge-neutral">{schema.meta.category}</span>
          <span className="badge badge-neutral">{schema.meta.subcategory}</span>
          {schema.meta.tags.map((t) => (
            <span key={t} className="badge">
              #{t}
            </span>
          ))}
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '8px' }}>
          {schema.meta.title}
        </h1>
        <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', maxWidth: '720px' }}>
          {schema.content.shortDescription}
        </p>

        {/* Anuncio Superior AdSense (Horizontal) */}
        <AdBanner adSlot="9916108334" format="autorelaxed" />
      </div>

      {/* Grid de Cálculo */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', alignItems: 'start' }}>
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600 }}>{t.calculator.inputParameters}</h3>
            <button
              onClick={handleReset}
              className="btn-secondary"
              style={{ height: '32px', padding: '0 10px', fontSize: '0.75rem', gap: '4px' }}
            >
              <RotateCcw size={14} />
              <span>{t.calculator.reset}</span>
            </button>
          </div>

          {visibleInputs.map((inputDef) => (
            <InputRenderer
              key={inputDef.id}
              inputDef={inputDef}
              value={values[inputDef.id]}
              unit={units[inputDef.id]}
              onChange={handleInputChange}
              onUnitChange={handleUnitChange}
              error={errors[inputDef.id]}
            />
          ))}
        </div>

        <div>
          <ResultPanel
            lang={lang}
            primaryCalc={primaryCalc}
            secondaryCalcs={secondaryCalcs}
            results={results}
            interpretations={interpretations}
            aiEnabled={schema.ai?.enabled}
            aiOpen={aiOpen}
            onToggleAI={() => setAiOpen(!aiOpen)}
            activeCurrency={activeCurrency}
          />

          <AIPanel
            aiConfig={schema.ai}
            results={results}
            schema={schema}
            isOpen={aiOpen}
            lang={lang}
            activeCurrency={activeCurrency}
            units={units}
          />
        </div>
      </div>

      {/* Gráficos */}
      {schema.charts && schema.charts.length > 0 && (
        <ChartRenderer chartDef={schema.charts[0]} rows={tableData} results={results} activeCurrency={activeCurrency} />
      )}

      {/* Tablas */}
      {schema.tables && schema.tables.length > 0 && (
        <TableRenderer tableDef={schema.tables[0]} rows={tableData} activeCurrency={activeCurrency} />
      )}

      {/* Anuncio Intermedio AdSense (In-Article) */}
      <AdBanner adSlot="2364921374" format="fluid" layout="in-article" />

      {/* Guía Educativa Profunda Adaptable por Calculadora (Pestañas por Dominio) */}
      <InDepthGuide guideSections={schema.guideSections} lang={lang} />

      {/* Sección SEO Estandarizada On-Page (H2, H3 LaTeX/KaTeX, Ejemplos Prácticos y Accordion FAQ) */}
      <SeoContentSection schema={schema} lang={lang} />
    </div>
  );
}
