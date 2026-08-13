import React from 'react';
import { ShieldCheck, FileText, Info, Mail, X } from 'lucide-react';

export default function LegalPages({ type, onClose, lang = 'en' }) {
  const isEn = lang === 'en';

  if (!type) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(4px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
    >
      <div
        className="card"
        style={{
          maxWidth: '850px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '32px 28px',
          position: 'relative',
          backgroundColor: 'var(--card-bg)',
          color: 'var(--text-primary)'
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--text-secondary)'
          }}
          aria-label="Close"
        >
          <X size={24} />
        </button>

        {/* POLÍTICA DE PRIVACIDAD */}
        {type === 'privacy' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <div style={{ padding: '10px', backgroundColor: 'var(--primary-soft)', color: 'var(--primary)', borderRadius: '10px' }}>
                <ShieldCheck size={28} />
              </div>
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>
                  {isEn ? 'Privacy Policy' : 'Política de Privacidad'}
                </h2>
                <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                  {isEn ? 'Last updated: August 2026' : 'Última actualización: Agosto de 2026'} — findcalculator.online
                </span>
              </div>
            </div>

            <div style={{ fontSize: '0.9375rem', lineHeight: 1.7, color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <p>
                {isEn
                  ? 'At FindCalculator (https://findcalculator.online), accessible from our website, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by FindCalculator and how we use it.'
                  : 'En FindCalculator (https://findcalculator.online), la privacidad de nuestros visitantes es de máxima prioridad. Este documento de Política de Privacidad detalla la información recopilada y cómo es utilizada.'}
              </p>

              <h3 style={{ color: 'var(--text-primary)', fontSize: '1.125rem', fontWeight: 700, marginTop: '8px' }}>
                {isEn ? '1. Log Files & Analytics' : '1. Archivos de Registro y Analítica'}
              </h3>
              <p>
                {isEn
                  ? 'FindCalculator follows a standard procedure of using log files. These files log visitors when they visit websites. The information collected by log files includes internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable.'
                  : 'FindCalculator utiliza archivos de registro estándar para auditar visitas. La información recopilada incluye direcciones IP, tipo de navegador, proveedor de servicios de internet (ISP), marca de fecha y hora, y páginas de referencia/salida. Ninguno de estos datos está vinculado a información de identificación personal.'}
              </p>

              <h3 style={{ color: 'var(--text-primary)', fontSize: '1.125rem', fontWeight: 700, marginTop: '8px' }}>
                {isEn ? '2. Cookies & Google AdSense / DoubleClick DART Cookie' : '2. Cookies y Anunciantes de Terceros (Google AdSense)'}
              </h3>
              <p>
                {isEn
                  ? 'Google is one of a third-party vendor on our site. It also uses cookies, known as DART cookies, to serve ads to our site visitors based upon their visit to www.website.com and other sites on the internet. However, visitors may choose to decline the use of DART cookies by visiting the Google ad and content network Privacy Policy at the following URL – https://policies.google.com/technologies/ads'
                  : 'Google es un proveedor de terceros en nuestro sitio web. Utiliza cookies, como la cookie de DART, para publicar anuncios a los visitantes en función de sus visitas a findcalculator.online y otros sitios web en internet. Los usuarios pueden declinar el uso de la cookie de DART visitando la Política de Privacidad de anuncios y la red de contenido de Google en: https://policies.google.com/technologies/ads'}
              </p>

              <h3 style={{ color: 'var(--text-primary)', fontSize: '1.125rem', fontWeight: 700, marginTop: '8px' }}>
                {isEn ? '3. Local Storage Privacy' : '3. Privacidad y Almacenamiento Local (LocalStorage)'}
              </h3>
              <p>
                {isEn
                  ? 'All mathematical inputs provided by users during calculation sessions are stored exclusively inside the user local browser LocalStorage for 1 hour for convenience. No user calculation data or personal data is transmitted or stored on external database servers.'
                  : 'Todos los datos matemáticos ingresados en las calculadoras se conservan temporalmente únicamente en el navegador local del usuario (LocalStorage) por 1 hora por comodidad. Ningún dato de cálculo ni información personal es transmitido o almacenado en servidores externos.'}
              </p>

              <h3 style={{ color: 'var(--text-primary)', fontSize: '1.125rem', fontWeight: 700, marginTop: '8px' }}>
                {isEn ? '4. GDPR & CCPA Rights' : '4. Derechos RGPD y CCPA'}
              </h3>
              <p>
                {isEn
                  ? 'Under GDPR and CCPA, users have the right to request access, rectification, erasure, or restriction of processing of their data. Since FindCalculator does not require user registration or process personal data, users can clear their stored inputs anytime using the "Clear" button on any calculator.'
                  : 'Bajo las normativas RGPD y CCPA, los usuarios tienen derecho a acceder, rectificar o eliminar sus datos. Al no requerir registro ni recopilar datos personales, los usuarios pueden borrar sus valores locales en cualquier momento presionando el botón "Limpiar".'}
              </p>

              <h3 style={{ color: 'var(--text-primary)', fontSize: '1.125rem', fontWeight: 700, marginTop: '8px' }}>
                {isEn ? '5. Contact Information' : '5. Información de Contacto'}
              </h3>
              <p>
                {isEn
                  ? 'If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us at contact@findcalculator.online.'
                  : 'Si tienes preguntas adicionales o necesitas más información sobre nuestra Política de Privacidad, contáctanos en contact@findcalculator.online.'}
              </p>
            </div>
          </div>
        )}

        {/* TÉRMINOS DE USO */}
        {type === 'terms' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <div style={{ padding: '10px', backgroundColor: 'var(--primary-soft)', color: 'var(--primary)', borderRadius: '10px' }}>
                <FileText size={28} />
              </div>
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>
                  {isEn ? 'Terms of Use' : 'Términos de Uso'}
                </h2>
                <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                  {isEn ? 'Effective date: August 2026' : 'Fecha de vigencia: Agosto de 2026'} — findcalculator.online
                </span>
              </div>
            </div>

            <div style={{ fontSize: '0.9375rem', lineHeight: 1.7, color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <p>
                {isEn
                  ? 'Welcome to FindCalculator (https://findcalculator.online). By accessing or using our website and 330+ interactive calculators, you agree to comply with and be bound by the following terms and conditions.'
                  : 'Bienvenido a FindCalculator (https://findcalculator.online). Al acceder o utilizar nuestro sitio web y sus 330+ calculadoras interactivas, aceptas cumplir con los siguientes términos y condiciones de uso.'}
              </p>

              <h3 style={{ color: 'var(--text-primary)', fontSize: '1.125rem', fontWeight: 700, marginTop: '8px' }}>
                {isEn ? '1. Educational & Informational Disclaimer' : '1. Descargo de Responsabilidad Educativo y Metodológico'}
              </h3>
              <p>
                {isEn
                  ? 'All calculations, estimations, formulas, and financial/medical/scientific tools provided on FindCalculator are intended solely for educational, informational, and reference purposes. Results do not constitute legal, medical, accounting, or certified financial advice.'
                  : 'Todos los cálculos, estimaciones, fórmulas y herramientas financieras, médicas y científicas en FindCalculator se ofrecen exclusivamente con fines educativos e informativos. Los resultados no constituyen asesoramiento profesional financiero, médico o legal certificado.'}
              </p>

              <h3 style={{ color: 'var(--text-primary)', fontSize: '1.125rem', fontWeight: 700, marginTop: '8px' }}>
                {isEn ? '2. Limitation of Liability' : '2. Limitación de Responsabilidad'}
              </h3>
              <p>
                {isEn
                  ? 'FindCalculator and its developers shall not be liable for any loss, damage, or financial decisions made based on the results generated by our online tools. Users are encouraged to verify critical calculations with certified professionals.'
                  : 'FindCalculator y sus desarrolladores no serán responsables de pérdidas, daños o decisiones tomadas basadas en los resultados generados por las herramientas. Se recomienda verificar los cálculos críticos con profesionales certificados.'}
              </p>

              <h3 style={{ color: 'var(--text-primary)', fontSize: '1.125rem', fontWeight: 700, marginTop: '8px' }}>
                {isEn ? '3. Intellectual Property' : '3. Propiedad Intelectual'}
              </h3>
              <p>
                {isEn
                  ? 'All interactive calculator schemas, content, guides, formulas, and visual branding on findcalculator.online are protected by intellectual property laws. Redistribution without prior written permission is prohibited.'
                  : 'Todos los esquemas de calculadoras, contenido, guías, fórmulas y elementos visuales de findcalculator.online están protegidos por las leyes de propiedad intelectual. Queda prohibida la redistribución no autorizada.'}
              </p>
            </div>
          </div>
        )}

        {/* SOBRE NOSOTROS Y CONTACTO */}
        {type === 'about' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <div style={{ padding: '10px', backgroundColor: 'var(--primary-soft)', color: 'var(--primary)', borderRadius: '10px' }}>
                <Info size={28} />
              </div>
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>
                  {isEn ? 'About Us & Mission' : 'Sobre Nosotros y Misión'}
                </h2>
                <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>findcalculator.online</span>
              </div>
            </div>

            <div style={{ fontSize: '0.9375rem', lineHeight: 1.7, color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <p>
                {isEn
                  ? 'FindCalculator is a world-class digital calculation platform providing over 330 free, instant, and registration-free interactive tools across 15 major scientific and everyday domains including Finance, Health, Physics, Geometry, Construction, Technology, and Statistics.'
                  : 'FindCalculator es una plataforma de cálculo digital de nivel mundial que ofrece más de 330 herramientas interactivas gratuitas, instantáneas y sin registro en 15 dominios científicos y cotidianos, incluyendo Finanzas, Salud, Física, Geometría, Construcción, Tecnología y Estadística.'}
              </p>

              <div style={{ backgroundColor: 'var(--background)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  <Mail size={18} color="var(--primary)" />
                  <span>{isEn ? 'Official Support & Contact:' : 'Contacto Oficial y Soporte:'}</span>
                </div>
                <div style={{ fontSize: '0.875rem' }}>
                  <strong>Email:</strong> contact@findcalculator.online / support@findcalculator.online<br />
                  <strong>Website:</strong> https://findcalculator.online<br />
                  <strong>Domain Status:</strong> Active SSL (HTTPS) Verified
                </div>
              </div>
            </div>
          </div>
        )}

        <div style={{ marginTop: '32px', textAlign: 'right' }}>
          <button onClick={onClose} className="btn-primary" style={{ padding: '10px 24px', fontSize: '0.875rem' }}>
            {isEn ? 'Close Window' : 'Cerrar Ventana'}
          </button>
        </div>
      </div>
    </div>
  );
}
