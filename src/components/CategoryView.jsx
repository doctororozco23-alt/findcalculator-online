import React from 'react';
import taxonomy from '../data/taxonomy.json';
import { i18n } from '../data/i18n';
import { Calculator, ArrowLeft, Layers, ArrowRight } from 'lucide-react';

export default function CategoryView({ categoryId, lang = 'en', calculators, onSelectCalculator, onBackHome }) {
  const t = i18n[lang] || i18n.en;
  const category = taxonomy.categories.find((c) => c.id === categoryId);

  if (!category) return null;

  const isEn = lang === 'en';
  const catName = isEn ? category.name_en || category.name : category.name;
  const catDesc = isEn ? category.description_en || category.description : category.description;
  const catCalculators = calculators.filter((c) => c.meta.category === category.id);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 16px' }}>
      {/* Botón de regreso */}
      <button
        onClick={onBackHome}
        className="btn-secondary"
        style={{ marginBottom: '24px', height: '36px', fontSize: '0.8125rem', gap: '6px' }}
      >
        <ArrowLeft size={16} />
        <span>{t.nav.backToCatalog}</span>
      </button>

      {/* Banner Principal de la Categoría */}
      <div
        className="card"
        style={{
          backgroundColor: 'var(--surface-alt)',
          borderLeft: '4px solid var(--primary)',
          marginBottom: '32px',
          padding: '32px 24px'
        }}
      >
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '8px' }}>
          <span className="badge badge-neutral">{category.subcategories.length} Subcategories</span>
          <span className="badge" style={{ backgroundColor: 'var(--success-soft)', color: 'var(--success)' }}>
            {catCalculators.length} Live Calculators
          </span>
        </div>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '8px' }}>
          {catName}
        </h1>
        <p style={{ fontSize: '1.0625rem', color: 'var(--text-secondary)', maxWidth: '800px', lineHeight: 1.5 }}>
          {catDesc}
        </p>
      </div>

      {/* Secciones por Subcategoría */}
      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Layers size={22} color="var(--primary)" />
        <span>Subcategories & Tools in {catName}</span>
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
        {category.subcategories.map((sub) => {
          const subName = isEn ? sub.name_en || sub.name : sub.name;
          const subDesc = isEn ? sub.description_en || sub.description : sub.description;
          const subCalcs = catCalculators.filter((c) => c.meta.subcategory === sub.id);

          return (
            <div key={sub.id} className="card">
              <div style={{ fontWeight: 700, fontSize: '1.125rem', marginBottom: '4px' }}>
                📂 {subName}
              </div>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: 1.4 }}>
                {subDesc}
              </p>

              {subCalcs.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {subCalcs.map((calc) => (
                    <div
                      key={calc.meta.id}
                      onClick={() => onSelectCalculator(calc)}
                      style={{
                        padding: '10px 14px',
                        borderRadius: 'var(--radius-control)',
                        backgroundColor: 'var(--surface-alt)',
                        border: '1px solid var(--border)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        transition: 'border-color 0.15s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Calculator size={16} color="var(--primary)" />
                        <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{calc.meta.title}</span>
                      </div>
                      <ArrowRight size={14} color="var(--text-secondary)" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="card-alt" style={{ padding: '12px', fontSize: '0.75rem', color: 'var(--text-disabled)' }}>
                  Tools planned for roadmap in this subcategory.
                </div>
              )}
            </div>
          );
        })}

        {/* Fallback de calculadoras pertenecientes a la categoría */}
        {(() => {
          const subIds = category.subcategories.map((s) => s.id);
          const remainingCalcs = catCalculators.filter((c) => !subIds.includes(c.meta.subcategory));
          if (remainingCalcs.length === 0) return null;
          return (
            <div className="card" style={{ borderLeft: '4px solid var(--primary)' }}>
              <div style={{ fontWeight: 700, fontSize: '1.125rem', marginBottom: '4px' }}>
                📂 {isEn ? 'Other Category Tools' : 'Otras Calculadoras de la Categoría'}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
                {remainingCalcs.map((calc) => (
                  <div
                    key={calc.meta.id}
                    onClick={() => onSelectCalculator(calc)}
                    style={{
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-control)',
                      backgroundColor: 'var(--surface-alt)',
                      border: '1px solid var(--border)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Calculator size={16} color="var(--primary)" />
                      <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{calc.meta.title}</span>
                    </div>
                    <ArrowRight size={14} color="var(--text-secondary)" />
                  </div>
                ))}
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}
