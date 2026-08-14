import React, { useState, useMemo, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import CalculatorRenderer from './components/CalculatorRenderer';
import HomeInteractive from './components/HomeInteractive';
import CategoryView from './components/CategoryView';
import ErrorBoundary from './components/ErrorBoundary';
import LegalPages from './components/LegalPages';
import LegalView from './components/LegalView';
import { translateSchema } from './engine/translatorEngine';
import { i18n } from './data/i18n';

// Importación dinámica limpia y automática de los 331 esquemas JSON de calculadoras
const calculatorModules = import.meta.glob('./data/calculators/*.json', { eager: true });
const RAW_CALCULATORS = Object.values(calculatorModules).map((mod) => mod.default || mod);

export default function App() {
  const [lang, setLang] = useState('en'); // INGLÉS POR DEFECTO
  const [isDark, setIsDark] = useState(false);
  const [viewMode, setViewMode] = useState('home'); // 'home' | 'category' | 'calculator'
  const [activeCategory, setActiveCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCalculatorRaw, setActiveCalculatorRaw] = useState(null);
  const [legalModal, setLegalModal] = useState(null); // 'privacy' | 'terms' | 'about'

  const t = i18n[lang] || i18n.en;

  // Traducir todas las calculadoras activas automáticamente en el cliente
  const translatedCalculators = useMemo(() => {
    return RAW_CALCULATORS.map((calc) => translateSchema(calc, lang));
  }, [lang]);

  const activeCalculator = useMemo(() => {
    if (!activeCalculatorRaw) return null;
    return translateSchema(activeCalculatorRaw, lang);
  }, [activeCalculatorRaw, lang]);

  // Sincronizar estado de la App con la URL del navegador y soporte de Botón Atrás (popstate)
  const syncRouteFromUrl = () => {
    const path = window.location.pathname.replace(/\/$/, '') || '/';
    const parts = path.split('/').filter(Boolean);

    if (parts.length === 0) {
      setViewMode('home');
      setActiveCategory(null);
      setActiveCalculatorRaw(null);
      setLegalModal(null);
    } else if (['privacy', 'terms', 'about'].includes(parts[0])) {
      setLegalModal(parts[0]);
      setViewMode('legal');
      setActiveCategory(null);
      setActiveCalculatorRaw(null);
    } else if (parts.length === 1) {
      const catId = parts[0];
      setActiveCategory(catId);
      setViewMode('category');
      setActiveCalculatorRaw(null);
      setLegalModal(null);
    } else if (parts.length === 2) {
      const catId = parts[0];
      const calcSlug = parts[1];
      const found = RAW_CALCULATORS.find((c) => c.meta.slug === calcSlug || c.meta.id === calcSlug);
      if (found) {
        setActiveCategory(catId);
        setActiveCalculatorRaw(found);
        setViewMode('calculator');
        setLegalModal(null);
      } else {
        setActiveCategory(catId);
        setViewMode('category');
        setLegalModal(null);
      }
    }
  };

  useEffect(() => {
    syncRouteFromUrl();
    const handlePopState = () => {
      syncRouteFromUrl();
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Actualizar document.title y Meta SEO dinámicamente
  useEffect(() => {
    if (viewMode === 'calculator' && activeCalculator) {
      document.title = `${activeCalculator.meta.title} — FindCalculator`;
    } else if (viewMode === 'category' && activeCategory) {
      document.title = `${activeCategory.toUpperCase()} Calculators — FindCalculator`;
    } else if (legalModal) {
      document.title = `${legalModal.toUpperCase()} — FindCalculator`;
    } else {
      document.title = `FindCalculator — 330+ Calculadoras Gratis en Tiempo Real`;
    }
  }, [viewMode, activeCalculator, activeCategory, legalModal, lang]);

  // Toggle de Idioma EN <-> ES
  const toggleLang = () => {
    setLang((prev) => (prev === 'en' ? 'es' : 'en'));
  };

  // Toggle de Tema Claro / Oscuro
  const toggleTheme = () => {
    setIsDark(!isDark);
    if (!isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleGoHome = (pushUrl = true) => {
    if (pushUrl && window.location.pathname !== '/') {
      window.history.pushState({}, '', '/');
    }
    setViewMode('home');
    setActiveCategory(null);
    setActiveCalculatorRaw(null);
    setLegalModal(null);
    setSearchQuery('');
  };

  const handleSelectCategory = (catId, pushUrl = true) => {
    if (pushUrl && window.location.pathname !== `/${catId}`) {
      window.history.pushState({}, '', `/${catId}`);
    }
    setActiveCategory(catId);
    setViewMode('category');
    setActiveCalculatorRaw(null);
    setLegalModal(null);
  };

  const handleSelectCalculator = (calc, pushUrl = true) => {
    const original = RAW_CALCULATORS.find((c) => c.meta.id === calc.meta.id) || calc;
    const cat = original.meta.category || 'herramientas';
    const slug = original.meta.slug || original.meta.id;

    if (pushUrl && window.location.pathname !== `/${cat}/${slug}`) {
      window.history.pushState({}, '', `/${cat}/${slug}`);
    }
    setActiveCalculatorRaw(original);
    setViewMode('calculator');
    setLegalModal(null);
  };

  const handleOpenLegal = (type, pushUrl = true) => {
    if (pushUrl && window.location.pathname !== `/${type}`) {
      window.history.pushState({}, '', `/${type}`);
    }
    setLegalModal(type);
    setViewMode('legal');
    setActiveCategory(null);
    setActiveCalculatorRaw(null);
  };

  const handleCloseLegal = () => {
    setLegalModal(null);
    if (['/privacy', '/terms', '/about'].includes(window.location.pathname)) {
      window.history.back();
    }
  };

  // Función al presionar el botón de Atrás en la interfaz
  const handleBackToCategoryOrHome = () => {
    if (viewMode === 'calculator' && activeCategory) {
      handleSelectCategory(activeCategory);
    } else {
      handleGoHome();
    }
  };

  return (
    <ErrorBoundary onReset={handleGoHome}>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--background)' }}>
        {/* Header global con Buscador Flotante Instantáneo, Menú Móvil e i18n */}
        <Header
          lang={lang}
          onToggleLang={toggleLang}
          activeCategory={activeCategory}
          onSelectCategory={handleSelectCategory}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          isDark={isDark}
          toggleTheme={toggleTheme}
          onGoHome={handleGoHome}
          calculators={translatedCalculators}
          onSelectCalculator={handleSelectCalculator}
        />

        {/* Contenido Principal según el Modo de Vista */}
        <main style={{ flex: 1 }}>
          {legalModal ? (
            /* PÁGINAS LEÍBLES DEDICADAS (Privacy Policy, Terms of Use, About Us) */
            <LegalView type={legalModal} onBackHome={handleGoHome} lang={lang} />
          ) : viewMode === 'calculator' && activeCalculator ? (
            <div>
              <div style={{ maxWidth: '1200px', margin: '16px auto 0', padding: '0 16px' }}>
                <button onClick={handleBackToCategoryOrHome} className="btn-secondary" style={{ height: '32px', fontSize: '0.8125rem' }}>
                  ← {t.nav.backToCatalog}
                </button>
              </div>

              <CalculatorRenderer schema={activeCalculator} lang={lang} />
            </div>
          ) : viewMode === 'category' && activeCategory ? (
            /* PÁGINA DEDICADA ESPECÍFICA POR CATEGORÍA */
            <CategoryView
              categoryId={activeCategory}
              lang={lang}
              calculators={translatedCalculators}
              onSelectCalculator={handleSelectCalculator}
              onBackHome={handleGoHome}
            />
          ) : (
            /* PÁGINA DE INICIO INTERACTIVA POR DEFECTO */
            <HomeInteractive
              lang={lang}
              calculators={translatedCalculators}
              onSelectCalculator={handleSelectCalculator}
              searchQuery={searchQuery}
            />
          )}
        </main>

        {/* Footer global */}
        <Footer lang={lang} onOpenLegal={(type) => handleOpenLegal(type)} />

        {/* Modal/Páginas Legales Requeridas por Google AdSense */}
        <LegalPages type={legalModal} onClose={handleCloseLegal} lang={lang} />
      </div>
    </ErrorBoundary>
  );
}
