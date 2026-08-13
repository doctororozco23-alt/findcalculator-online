import React from 'react';
import { ShieldCheck, Cpu, Clock } from 'lucide-react';
import { i18n } from '../data/i18n';

export default function Footer({ lang }) {
  const t = i18n[lang] || i18n.en;

  return (
    <footer
      style={{
        backgroundColor: 'var(--surface)',
        borderTop: '1px solid var(--border)',
        padding: '40px 16px 24px',
        marginTop: '64px'
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Franja de confianza ética */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '20px',
            paddingBottom: '32px',
            borderBottom: '1px solid var(--border)',
            marginBottom: '32px'
          }}
        >
          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <ShieldCheck size={24} color="var(--primary)" />
            <div>
              <h4 style={{ fontSize: '0.875rem', fontWeight: 600 }}>{t.footer.noRegTitle}</h4>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{t.footer.noRegSub}</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <Clock size={24} color="var(--success)" />
            <div>
              <h4 style={{ fontSize: '0.875rem', fontWeight: 600 }}>{t.footer.privacyTitle}</h4>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{t.footer.privacySub}</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <Cpu size={24} color="var(--ai)" />
            <div>
              <h4 style={{ fontSize: '0.875rem', fontWeight: 600 }}>{t.footer.aiTitle}</h4>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{t.footer.aiSub}</p>
            </div>
          </div>
        </div>

        {/* Footer bottom */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
            fontSize: '0.8125rem',
            color: 'var(--text-secondary)'
          }}
        >
          <div>
            © {new Date().getFullYear()} <strong>CalculadoraHub v1.0</strong>. {t.footer.rights}
          </div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <span style={{ cursor: 'pointer' }}>{t.footer.privacy}</span>
            <span style={{ cursor: 'pointer' }}>{t.footer.terms}</span>
            <span style={{ cursor: 'pointer' }}>{t.footer.about}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
