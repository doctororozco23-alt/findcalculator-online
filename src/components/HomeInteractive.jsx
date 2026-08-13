import React, { useState } from 'react';
import taxonomy from '../data/taxonomy.json';
import { ChevronDown, ChevronUp, Calculator, ArrowRight, Layers } from 'lucide-react';
import { i18n } from '../data/i18n';

export default function HomeInteractive({ lang = 'en', calculators, onSelectCalculator, searchQuery }) {
  const t = i18n[lang] || i18n.en;
  const [expandedCategory, setExpandedCategory] = useState(null);

  const toggleCategory = (catId) => {
    setExpandedCategory(expandedCategory === catId ? null : catId);
  };

  const isEn = lang === 'en';

  const filteredCalculators = calculators.filter((calc) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      calc.meta.title.toLowerCase().includes(q) ||
      calc.meta.slug.toLowerCase().includes(q) ||
      calc.content.shortDescription.toLowerCase().includes(q) ||
      calc.meta.tags.some((tag) => tag.toLowerCase().includes(q))
    );
  });

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 16px' }}>
      {/* Hero Interactive Header */}
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <span className="badge badge-neutral" style={{ marginBottom: '12px', fontSize: '0.75rem', letterSpacing: '0.05em' }}>
          {t.home.badge}
        </span>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '12px' }}>
          {t.home.title}
        </h1>
        <p style={{ fontSize: '1.125rem', color: 'var(--text-secondary)', maxWidth: '720px', margin: '0 auto' }}>
          {t.home.subtitle}
        </p>
      </div>

      {searchQuery ? (
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '16px' }}>
            Results for "{searchQuery}" ({filteredCalculators.length})
          </h2>
          {filteredCalculators.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
              {filteredCalculators.map((calc) => (
                <div key={calc.meta.id} className="card" onClick={() => onSelectCalculator(calc)} style={{ cursor: 'pointer' }}>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                    <span className="badge badge-neutral">{calc.meta.category}</span>
                    <span className="badge">{calc.meta.priority}</span>
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '6px' }}>{calc.meta.title}</h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{calc.content.shortDescription}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
              <p style={{ fontWeight: 600 }}>{t.home.noResultsTitle} "{searchQuery}"</p>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{t.home.noResultsSub}</p>
            </div>
          )}
        </div>
      ) : (
        /* Árbol Jerárquico Bilingüe de Categorías y Subcategorías */
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Layers size={22} color="var(--primary)" />
              <span>{t.home.categoriesHeading}</span>
            </h2>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              16 Categories · 300+ Tools
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
            {taxonomy.categories.map((cat) => {
              const isExpanded = expandedCategory === cat.id;
              const catName = isEn ? cat.name_en || cat.name : cat.name;
              const catDesc = isEn ? cat.description_en || cat.description : cat.description;
              const catCalculators = calculators.filter((c) => c.meta.category === cat.id);

              return (
                <div
                  key={cat.id}
                  className="card"
                  style={{
                    borderColor: isExpanded ? 'var(--primary)' : 'var(--border)',
                    transition: 'border-color 0.2s ease, box-shadow 0.2s ease'
                  }}
                >
                  <div onClick={() => toggleCategory(cat.id)} style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span className="badge badge-neutral">{cat.subcategories.length} {t.home.expandSubcategories}</span>
                        {catCalculators.length > 0 && (
                          <span className="badge" style={{ backgroundColor: 'var(--success-soft)', color: 'var(--success)' }}>
                            {catCalculators.length} Live
                          </span>
                        )}
                      </div>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                        {catName}
                      </h3>
                      <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.4 }}>
                        {catDesc}
                      </p>
                    </div>

                    <button type="button" className="btn-secondary" style={{ width: '36px', height: '36px', padding: 0, borderRadius: '50%', flexShrink: 0 }}>
                      {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                  </div>

                  {isExpanded && (
                    <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {cat.subcategories.map((sub) => {
                          const subName = isEn ? sub.name_en || sub.name : sub.name;
                          const subDesc = isEn ? sub.description_en || sub.description : sub.description;
                          const subCalcs = calculators.filter(
                            (c) => c.meta.category === cat.id && c.meta.subcategory === sub.id
                          );

                          return (
                            <div key={sub.id} className="card-alt">
                              <div style={{ fontWeight: 700, fontSize: '0.875rem', marginBottom: '2px' }}>
                                📂 {subName}
                              </div>
                              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '10px' }}>
                                {subDesc}
                              </p>

                              {subCalcs.length > 0 ? (
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                  {subCalcs.map((calc) => (
                                    <button
                                      key={calc.meta.id}
                                      onClick={() => onSelectCalculator(calc)}
                                      className="btn-primary"
                                      style={{ height: '32px', padding: '0 12px', fontSize: '0.8125rem', gap: '6px' }}
                                    >
                                      <Calculator size={14} />
                                      <span>{calc.meta.title}</span>
                                      <ArrowRight size={12} />
                                    </button>
                                  ))}
                                </div>
                              ) : (
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-disabled)' }}>
                                  Tools planned for roadmap in this subcategory
                                </span>
                              )}
                            </div>
                          );
                        })}

                        {/* Mostrar calculadoras que pertenezcan a la categoría principal pero no coincidan con la subcategoría id exacta */}
                        {(() => {
                          const subIds = cat.subcategories.map((s) => s.id);
                          const remainingCalcs = catCalculators.filter((c) => !subIds.includes(c.meta.subcategory));
                          if (remainingCalcs.length === 0) return null;
                          return (
                            <div className="card-alt" style={{ borderLeft: '3px solid var(--primary)' }}>
                              <div style={{ fontWeight: 700, fontSize: '0.875rem', marginBottom: '4px' }}>
                                📂 {isEn ? 'Other Category Tools' : 'Otras Calculadoras de la Categoría'}
                              </div>
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
                                {remainingCalcs.map((calc) => (
                                  <button
                                    key={calc.meta.id}
                                    onClick={() => onSelectCalculator(calc)}
                                    className="btn-primary"
                                    style={{ height: '32px', padding: '0 12px', fontSize: '0.8125rem', gap: '6px' }}
                                  >
                                    <Calculator size={14} />
                                    <span>{calc.meta.title}</span>
                                    <ArrowRight size={12} />
                                  </button>
                                ))}
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Catálogo Directo de Todas las Calculadoras Activas en Producción */}
          <div style={{ marginTop: '56px', paddingTop: '32px', borderTop: '2px dashed var(--border)' }}>
            <div style={{ marginBottom: '24px' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '6px' }}>
                🚀 {isEn ? `All ${calculators.length} Live Calculators` : `Todas las ${calculators.length} Calculadoras Activas`}
              </h2>
              <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)' }}>
                {isEn
                  ? 'Browse the full interactive collection of fast, precise calculators with Smart AI insights.'
                  : 'Explora el catálogo completo interactivo con análisis de Inteligencia Artificial.'}
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
              {calculators.map((calc) => (
                <div
                  key={calc.meta.id}
                  className="card"
                  onClick={() => onSelectCalculator(calc)}
                  style={{ cursor: 'pointer', padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '110px' }}
                >
                  <div>
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginBottom: '6px' }}>
                      <span className="badge badge-neutral" style={{ fontSize: '0.6875rem' }}>{calc.meta.category}</span>
                      <span className="badge" style={{ backgroundColor: 'var(--primary-soft)', color: 'var(--primary)', fontSize: '0.6875rem' }}>Live</span>
                    </div>
                    <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, lineHeight: 1.3, color: 'var(--text-primary)' }}>
                      {calc.meta.title}
                    </h3>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '12px', fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600 }}>
                    <span>{isEn ? 'Open Tool' : 'Abrir Calculadora'}</span>
                    <ArrowRight size={14} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
