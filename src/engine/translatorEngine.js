/**
 * Motor de Traducción Bilingüe Directo y Recursivo de 360° para CalculadoraHub.
 * Selecciona propiedades _en nativas de primer nivel del JSON schema y taxonomía,
 * procesando metadatos, inputs, resultados, tablas, gráficos y guideSections educativas.
 */

export function translateSchema(schema, targetLang = 'en') {
  if (!schema) return schema;

  if (targetLang === 'es') {
    return schema;
  }

  const clone = JSON.parse(JSON.stringify(schema));

  const pick = (obj, field) => {
    if (!obj) return '';
    return obj[`${field}_en`] || obj[field] || '';
  };

  // 1. Meta
  if (clone.meta) {
    clone.meta.title = pick(clone.meta, 'title');
    if (Array.isArray(clone.meta.tags_en)) {
      clone.meta.tags = clone.meta.tags_en;
    }
  }

  // 2. Content
  if (clone.content) {
    clone.content.shortDescription = pick(clone.content, 'shortDescription');
    clone.content.longDescription = pick(clone.content, 'longDescription');
    if (Array.isArray(clone.content.howToUse_en)) {
      clone.content.howToUse = clone.content.howToUse_en;
    }
    if (clone.content.methodology_en) {
      clone.content.methodology = clone.content.methodology_en;
    }
    if (Array.isArray(clone.content.warnings)) {
      clone.content.warnings.forEach((w) => {
        if (w.text_en) w.text = w.text_en;
      });
    }
    if (Array.isArray(clone.content.faq)) {
      clone.content.faq.forEach((item) => {
        if (item.question_en) item.question = item.question_en;
        if (item.answer_en) item.answer = item.answer_en;
      });
    }
  }

  // 2.1 Guide Sections (Sección Educativa Dinámica por Calculadora)
  if (Array.isArray(clone.guideSections)) {
    clone.guideSections.forEach((sec) => {
      sec.title = pick(sec, 'title');
      if (sec.content_html_en) {
        sec.content_html = sec.content_html_en;
      }
      if (sec.content_en) {
        sec.content = sec.content_en;
      }
    });
  }

  // 3. Inputs
  if (Array.isArray(clone.inputs)) {
    clone.inputs.forEach((input) => {
      input.label = pick(input, 'label');
      if (input.help_en) input.help = input.help_en;
      if (input.tooltip_en) input.tooltip = input.tooltip_en;
      if (Array.isArray(input.options)) {
        input.options.forEach((opt) => {
          opt.label = pick(opt, 'label');
        });
      }
      if (Array.isArray(input.units)) {
        input.units.forEach((u) => {
          u.label = pick(u, 'label');
        });
      }
      if (Array.isArray(input.validation)) {
        input.validation.forEach((v) => {
          if (v.message_en) v.message = v.message_en;
        });
      }
    });
  }

  // 4. Calculations & Interpretations
  if (Array.isArray(clone.calculations)) {
    clone.calculations.forEach((calc) => {
      calc.label = pick(calc, 'label');
      if (calc.unit_en) calc.unit = calc.unit_en;

      if (Array.isArray(calc.interpretation)) {
        calc.interpretation.forEach((interp) => {
          interp.label = pick(interp, 'label');
          if (interp.text_en) interp.text = interp.text_en;
        });
      }
    });
  }

  // 5. Tables
  if (Array.isArray(clone.tables)) {
    clone.tables.forEach((tbl) => {
      tbl.title = pick(tbl, 'title');
      if (Array.isArray(tbl.columns)) {
        tbl.columns.forEach((col) => {
          col.label = pick(col, 'label');
        });
      }
    });
  }

  // 6. Charts
  if (Array.isArray(clone.charts)) {
    clone.charts.forEach((chart) => {
      chart.title = pick(chart, 'title');
      if (chart.xAxis) chart.xAxis.label = pick(chart.xAxis, 'label');
      if (chart.yAxis) chart.yAxis.label = pick(chart.yAxis, 'label');
      if (Array.isArray(chart.series)) {
        chart.series.forEach((s) => {
          s.label = pick(s, 'label');
        });
      }
      if (Array.isArray(chart.zones)) {
        chart.zones.forEach((z) => {
          if (z.label) z.label = pick(z, 'label');
        });
      }
    });
  }

  // 7. AI Config
  if (clone.ai) {
    if (clone.ai.role_en) clone.ai.role = clone.ai.role_en;
    if (Array.isArray(clone.ai.instructions_en)) {
      clone.ai.instructions = clone.ai.instructions_en;
    }
  }

  return clone;
}
