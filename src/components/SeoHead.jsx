import React, { useEffect } from 'react';

export default function SeoHead({ schema, lang = 'en' }) {
  if (!schema) return null;

  const isEn = lang === 'en';
  const domain = 'https://findcalculator.online';
  const categorySlug = schema.meta.category || 'herramientas';
  const calcSlug = schema.meta.slug;
  const canonicalUrl = `${domain}/${categorySlug}/${calcSlug}`;

  const titleText = isEn
    ? `${schema.meta.title_en || schema.meta.title} — Free Online Calculator | FindCalculator`
    : `${schema.meta.title} — Calculadora Gratis y en Tiempo Real | FindCalculator`;

  const descriptionText = isEn
    ? schema.content.shortDescription_en || schema.content.shortDescription
    : schema.content.shortDescription;

  useEffect(() => {
    // 1. Actualizar título de pestaña
    document.title = titleText;

    // 2. Actualizar o crear Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = descriptionText;

    // 3. Actualizar Canónica
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = canonicalUrl;

    // 4. Actualizar Open Graph & Twitter Cards para Redes Sociales
    const updateMetaProperty = (property, content) => {
      let el = document.querySelector(`meta[property="${property}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute('property', property);
        document.head.appendChild(el);
      }
      el.content = content;
    };

    const updateMetaName = (name, content) => {
      let el = document.querySelector(`meta[name="${name}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.name = name;
        document.head.appendChild(el);
      }
      el.content = content;
    };

    updateMetaProperty('og:title', titleText);
    updateMetaProperty('og:description', descriptionText);
    updateMetaProperty('og:url', canonicalUrl);
    updateMetaProperty('og:type', 'website');
    updateMetaProperty('og:site_name', 'FindCalculator');

    updateMetaName('twitter:card', 'summary_large_image');
    updateMetaName('twitter:title', titleText);
    updateMetaName('twitter:description', descriptionText);

    // 5. Inyectar Datos Estructurados JSON-LD (WebApplication + FAQPage + BreadcrumbList)
    const jsonLdId = 'calculator-jsonld-schema';
    let scriptTag = document.getElementById(jsonLdId);
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = jsonLdId;
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }

    const faqItems = [];

    if (schema.content.howToUse && Array.isArray(schema.content.howToUse)) {
      faqItems.push({
        '@type': 'Question',
        name: isEn
          ? `How do I use the ${schema.meta.title_en || schema.meta.title}?`
          : `¿Cómo se usa la ${schema.meta.title}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: schema.content.howToUse.join(' '),
        },
      });
    }

    if (schema.content.methodology) {
      faqItems.push({
        '@type': 'Question',
        name: isEn
          ? `What formula is applied in the ${schema.meta.title_en || schema.meta.title}?`
          : `¿Qué fórmula matemática aplica la ${schema.meta.title}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: isEn ? schema.content.methodology_en || schema.content.methodology : schema.content.methodology,
        },
      });
    }

    const jsonLdData = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebApplication',
          name: isEn ? schema.meta.title_en || schema.meta.title : schema.meta.title,
          url: canonicalUrl,
          applicationCategory: 'EducationalApplication',
          operatingSystem: 'All',
          browserRequirements: 'Requires JavaScript. Requires HTML5.',
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
          },
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'FindCalculator',
              item: domain,
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: categorySlug,
              item: `${domain}/${categorySlug}`,
            },
            {
              '@type': 'ListItem',
              position: 3,
              name: isEn ? schema.meta.title_en || schema.meta.title : schema.meta.title,
              item: canonicalUrl,
            },
          ],
        },
        ...(faqItems.length > 0
          ? [
              {
                '@type': 'FAQPage',
                mainEntity: faqItems,
              },
            ]
          : []),
      ],
    };

    scriptTag.textContent = JSON.stringify(jsonLdData);
  }, [schema, lang, titleText, descriptionText, canonicalUrl, categorySlug]);

  return null;
}
