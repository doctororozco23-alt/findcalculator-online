import React, { useEffect } from 'react';

/**
 * Componente Modular de Anuncios para Google AdSense
 * Soporta modo vista previa (desarrollo) y producción real cuando introduzcas tu Client ID y Slot ID.
 */
export default function AdBanner({
  adClient = 'ca-pub-1369999948195621',
  adSlot = '9916108334',
  format = 'auto',
  layout = '',
  responsive = 'true',
  style = { display: 'block', margin: '24px 0', textAlign: 'center' }
}) {
  const isDev = !adSlot || adClient.includes('XXXXXXXXXXXXXXXX');

  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error('AdSense Error:', e);
    }
  }, [adSlot]);

  if (isDev) {
    // Vista previa visual limpia durante desarrollo antes de la aprobación de AdSense
    return (
      <div
        style={{
          margin: '24px 0',
          padding: '16px',
          backgroundColor: 'var(--surface-hover)',
          border: '1px dashed var(--border)',
          borderRadius: 'var(--radius-card)',
          textAlign: 'center',
          color: 'var(--text-secondary)',
          fontSize: '0.8125rem'
        }}
      >
        <div style={{ fontWeight: 700, marginBottom: '4px', color: 'var(--primary)' }}>
          📢 Espacio Publicitario Reservado (Google AdSense)
        </div>
        <div>
          Este bloque mostrará anuncios automáticos una vez aprobado <strong style={{ color: 'var(--text-primary)' }}>findcalculator.online</strong> en AdSense.
        </div>
      </div>
    );
  }

  const insProps = {
    className: 'adsbygoogle',
    style: { display: 'block', textAlign: 'center' },
    'data-ad-client': adClient,
    'data-ad-slot': adSlot,
    'data-ad-format': format,
    'data-full-width-responsive': responsive
  };

  if (layout) {
    insProps['data-ad-layout'] = layout;
  }

  return (
    <div style={style}>
      <ins {...insProps} />
    </div>
  );
}
