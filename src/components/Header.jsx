import React, { useState, useRef, useEffect } from 'react';
import { Calculator, Search, Moon, Sun, ChevronDown, Home, Globe, Menu, X, ArrowRight } from 'lucide-react';
import taxonomy from '../data/taxonomy.json';
import { i18n } from '../data/i18n';

export default function Header({
  lang,
  onToggleLang,
  activeCategory,
  onSelectCategory,
  searchQuery,
  setSearchQuery,
  isDark,
  toggleTheme,
  onGoHome,
  calculators = [],
  onSelectCalculator
}) {
  const t = i18n[lang] || i18n.en;
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const searchContainerRef = useRef(null);

  // Cerrar buscador flotante al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setSearchFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Calculadoras filtradas para el buscador flotante
  const searchResults = calculators.filter((calc) => {
    if (!searchQuery.trim()) return false;
    const q = searchQuery.toLowerCase().trim();
    return (
      calc.meta.title.toLowerCase().includes(q) ||
      calc.meta.slug.toLowerCase().includes(q) ||
      calc.content.shortDescription.toLowerCase().includes(q) ||
      calc.meta.tags.some((tag) => tag.toLowerCase().includes(q))
    );
  });

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backgroundColor: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        transition: 'background-color 0.2s ease'
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 16px',
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px'
        }}
      >
        {/* Logo e Identidad */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            onClick={onGoHome}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
          >
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                backgroundColor: 'var(--primary)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700
              }}
            >
              <Calculator size={22} />
            </div>
            <div>
              <span style={{ fontWeight: 700, fontSize: '1.25rem', letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
                Calculadora<span style={{ color: 'var(--primary)' }}>Hub</span>
              </span>
              <span style={{ display: 'block', fontSize: '0.65rem', fontWeight: 600, color: 'var(--text-secondary)', marginTop: '-4px' }}>
                {t.nav.subtitle}
              </span>
            </div>
          </div>

          {/* Botón de Inicio (Home) */}
          <button
            onClick={onGoHome}
            className="btn-secondary desktop-only"
            style={{ gap: '6px', height: '36px', fontSize: '0.8125rem' }}
          >
            <Home size={16} />
            <span>{t.nav.home}</span>
          </button>

          {/* MegaMenu Dropdown */}
          <div style={{ position: 'relative' }} className="desktop-only">
            <button
              onClick={() => setMegaMenuOpen(!megaMenuOpen)}
              className="btn-secondary"
              style={{ gap: '6px', height: '36px', fontSize: '0.8125rem' }}
            >
              <span>{t.nav.categories}</span>
              <ChevronDown size={16} style={{ transform: megaMenuOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
            </button>

            {megaMenuOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: '120%',
                  left: 0,
                  width: '680px',
                  backgroundColor: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-card)',
                  boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
                  padding: '20px',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '12px',
                  zIndex: 100
                }}
              >
                {taxonomy.categories.map((cat) => {
                  const isEn = lang === 'en';
                  const catName = isEn ? cat.name_en || cat.name : cat.name;
                  return (
                    <div
                      key={cat.id}
                      onClick={() => {
                        onSelectCategory(cat.id);
                        setMegaMenuOpen(false);
                      }}
                      style={{
                        padding: '10px 12px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        backgroundColor: activeCategory === cat.id ? 'var(--primary-soft)' : 'transparent',
                        transition: 'background-color 0.15s ease'
                      }}
                    >
                      <div style={{ fontWeight: 600, fontSize: '0.875rem', color: activeCategory === cat.id ? 'var(--primary)' : 'var(--text-primary)' }}>
                        {catName}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        {cat.subcategories.length} subcategories
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Buscador Instantáneo Flotante Global */}
        <div ref={searchContainerRef} style={{ flex: 1, maxWidth: '380px', position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-disabled)' }} />
          <input
            type="text"
            value={searchQuery}
            onFocus={() => setSearchFocused(true)}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSearchFocused(true);
            }}
            placeholder={t.nav.searchPlaceholder}
            className="input-field"
            style={{ paddingLeft: '38px', height: '36px', fontSize: '0.8125rem' }}
          />

          {/* Dropdown flotante con resultados instantáneos */}
          {searchFocused && searchQuery.trim() && (
            <div
              style={{
                position: 'absolute',
                top: '110%',
                left: 0,
                right: 0,
                backgroundColor: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-card)',
                boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                padding: '8px',
                zIndex: 110,
                maxHeight: '320px',
                overflowY: 'auto'
              }}
            >
              {searchResults.length > 0 ? (
                searchResults.map((calc) => (
                  <div
                    key={calc.meta.id}
                    onClick={() => {
                      onSelectCalculator(calc);
                      setSearchFocused(false);
                    }}
                    style={{
                      padding: '10px 12px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'background-color 0.15s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--surface-alt)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{calc.meta.title}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{calc.meta.category} · {calc.meta.subcategory}</div>
                    </div>
                    <ArrowRight size={14} color="var(--primary)" />
                  </div>
                ))
              ) : (
                <div style={{ padding: '12px', textAlign: 'center', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                  No tools found for "{searchQuery}"
                </div>
              )}
            </div>
          )}
        </div>

        {/* Acciones de Cabecera: Idioma + Tema + Hamburguesa Móvil */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Toggle de Idioma EN / ES */}
          <button
            onClick={onToggleLang}
            className="btn-secondary"
            title="Switch Language / Cambiar Idioma"
            style={{ height: '36px', padding: '0 10px', fontSize: '0.8125rem', gap: '6px', fontWeight: 700 }}
          >
            <Globe size={16} color="var(--primary)" />
            <span>{lang.toUpperCase()}</span>
          </button>

          {/* Toggle de Tema Claro / Oscuro */}
          <button
            onClick={toggleTheme}
            className="btn-secondary"
            title="Toggle Dark/Light Mode"
            style={{ width: '36px', height: '36px', padding: 0 }}
          >
            {isDark ? <Sun size={18} color="#FBBF24" /> : <Moon size={18} />}
          </button>

          {/* Hamburguesa Móvil */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="btn-secondary mobile-only"
            style={{ width: '36px', height: '36px', padding: 0 }}
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Menú Drawer Móvil Completo */}
      {mobileMenuOpen && (
        <div
          style={{
            position: 'fixed',
            top: '64px',
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'var(--surface)',
            zIndex: 99,
            padding: '20px',
            overflowY: 'auto',
            borderTop: '1px solid var(--border)'
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <button
              onClick={() => {
                onGoHome();
                setMobileMenuOpen(false);
              }}
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center', gap: '8px' }}
            >
              <Home size={18} />
              <span>{t.nav.home}</span>
            </button>

            <h4 style={{ fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)', marginTop: '12px' }}>
              {t.nav.categories}
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '8px' }}>
              {taxonomy.categories.map((cat) => {
                const isEn = lang === 'en';
                const catName = isEn ? cat.name_en || cat.name : cat.name;
                return (
                  <div
                    key={cat.id}
                    onClick={() => {
                      onSelectCategory(cat.id);
                      setMobileMenuOpen(false);
                    }}
                    style={{
                      padding: '12px 14px',
                      borderRadius: '8px',
                      backgroundColor: 'var(--surface-alt)',
                      fontWeight: 600,
                      fontSize: '0.9375rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <span>{catName}</span>
                    <ArrowRight size={14} color="var(--primary)" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
