import { create, all } from 'mathjs';
import { evaluateCondition } from './conditionEngine';

const math = create(all);

// Registrar funciones personalizadas de fechas e igualdad para mathjs
math.import({
  equal: function(a, b) {
    if (a === null || a === undefined || b === null || b === undefined) {
      return a === b;
    }
    if (typeof a === 'string' || typeof b === 'string') {
      return String(a) === String(b);
    }
    return Number(a) === Number(b);
  },
  daysBetween: function(d1, d2) {
    if (!d1 || !d2) return 0;
    const t1 = new Date(d1).getTime();
    const t2 = new Date(d2).getTime();
    if (isNaN(t1) || isNaN(t2)) return 0;
    return Math.round((t2 - t1) / (1000 * 60 * 60 * 24));
  },
  addDays: function(d1, days) {
    if (!d1) return '';
    const date = new Date(d1);
    if (isNaN(date.getTime())) return '';
    date.setDate(date.getDate() + Number(days || 0));
    return date.toISOString().split('T')[0];
  },
  todayDate: function() {
    return new Date().toISOString().split('T')[0];
  },
  isPrime: function(n) {
    const num = Math.floor(Math.abs(Number(n) || 0));
    if (num <= 1) return false;
    if (num <= 3) return true;
    if (num % 2 === 0 || num % 3 === 0) return false;
    for (let i = 5; i * i <= num; i += 6) {
      if (num % i === 0 || num % (i + 2) === 0) return false;
    }
    return true;
  },
  yearsBetween: function(d1, d2) {
    if (!d1 || !d2) return 0;
    const date1 = new Date(d1);
    const date2 = new Date(d2);
    if (isNaN(date1.getTime()) || isNaN(date2.getTime())) return 0;
    let years = date2.getFullYear() - date1.getFullYear();
    const m = date2.getMonth() - date1.getMonth();
    if (m < 0 || (m === 0 && date2.getDate() < date1.getDate())) {
      years--;
    }
    return Math.max(0, years);
  },
  monthsBetween: function(d1, d2) {
    if (!d1 || !d2) return 0;
    const date1 = new Date(d1);
    const date2 = new Date(d2);
    if (isNaN(date1.getTime()) || isNaN(date2.getTime())) return 0;
    let months = (date2.getFullYear() - date1.getFullYear()) * 12 + (date2.getMonth() - date1.getMonth());
    if (date2.getDate() < date1.getDate()) {
      months--;
    }
    return Math.max(0, months);
  },
  hoursBetweenTimes: function(t1Str, t2Str) {
    if (!t1Str || !t2Str) return 0;
    const [h1, m1] = String(t1Str).split(':').map(Number);
    const [h2, m2] = String(t2Str).split(':').map(Number);
    if (isNaN(h1) || isNaN(m1) || isNaN(h2) || isNaN(m2)) return 0;
    let mins1 = h1 * 60 + m1;
    let mins2 = h2 * 60 + m2;
    if (mins2 < mins1) mins2 += 24 * 60; // Pasa la medianoche
    return Math.round(((mins2 - mins1) / 60) * 100) / 100;
  },
  dayOfWeekIndex: function(dStr) {
    if (!dStr) return 0;
    const date = new Date(dStr);
    if (isNaN(date.getTime())) return 0;
    return date.getDay(); // 0 = Sunday, 1 = Monday, ...
  },
  loveMatchScore: function(n1, n2) {
    const str = (String(n1 || '') + String(n2 || '')).toLowerCase().replace(/[^a-z0-9]/g, '');
    if (!str) return 75;
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    return 60 + (Math.abs(hash) % 40); // 60% to 99%
  }
}, { override: true });

export function evaluateCalculations(schema, values) {
  const scope = { ...values };
  const results = {};
  const interpretations = {};

  if (!schema || !schema.calculations) {
    return { results, scope, interpretations };
  }

  for (const calc of schema.calculations) {
    if (calc.visibleWhen && !evaluateCondition(calc.visibleWhen, scope)) {
      results[calc.id] = null;
      scope[calc.id] = 0;
      continue;
    }

    try {
      const compiled = math.compile(calc.expression);
      const evaluated = compiled.evaluate(scope);

      let finalVal = evaluated;
      if (typeof evaluated === 'number') {
        if (!isFinite(evaluated) || isNaN(evaluated)) {
          finalVal = null;
        }
      }

      results[calc.id] = finalVal;
      scope[calc.id] = finalVal ?? 0;

      if (calc.interpretation && Array.isArray(calc.interpretation) && finalVal !== null) {
        const evalScope = { ...scope, [calc.id]: finalVal };
        const matchingInterp = calc.interpretation.find((interp) =>
          evaluateCondition(interp.when, evalScope)
        );
        if (matchingInterp) {
          interpretations[calc.id] = matchingInterp;
        }
      }
    } catch (err) {
      console.warn(`Error evaluando cálculo "${calc.id}":`, err);
      results[calc.id] = null;
      scope[calc.id] = 0;
    }
  }

  return { results, scope, interpretations };
}

/**
 * Genera tablas iterativas (ej. Amortizaciones)
 */
export function generateTable(tableDef, scope) {
  if (!tableDef || !tableDef.iterator) return [];

  const { iterator, initial, columns, maxRows = 600 } = tableDef;
  const fromVal = Number(iterator.from) || 1;

  let toVal = 1;
  if (typeof iterator.to === 'number') {
    toVal = iterator.to;
  } else if (typeof iterator.to === 'string' && iterator.to in scope) {
    toVal = Number(scope[iterator.to]) || 1;
  }

  toVal = Math.min(toVal, maxRows);

  const rows = [];
  let prevRow = { ...initial };
  Object.keys(prevRow).forEach((k) => {
    const val = prevRow[k];
    if (typeof val === 'string' && val in scope) {
      prevRow[k] = scope[val];
    } else {
      prevRow[k] = Number(val) || 0;
    }
  });

  for (let step = fromVal; step <= toVal; step++) {
    const rowScope = {
      ...scope,
      [iterator.id]: step,
      prev: { ...prevRow }
    };

    const currentRow = { [iterator.id]: step };

    for (const col of columns) {
      try {
        const compiled = math.compile(col.expression);
        const val = compiled.evaluate(rowScope);
        currentRow[col.id] = isFinite(val) ? val : 0;
        rowScope[col.id] = currentRow[col.id];
      } catch (e) {
        currentRow[col.id] = 0;
      }
    }

    rows.push(currentRow);
    prevRow = { ...currentRow };
  }

  return rows;
}

/**
 * Formateador universal a prueba de fallos para divisas, medidas y fechas
 */
export function formatValue(value, format = 'number', precision = 2, unit = null, currencyCode = 'EUR') {
  if (value === null || value === undefined) {
    return '—';
  }

  // Manejo de cadenas de fecha o formato date
  if (format === 'date' || (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value))) {
    try {
      const dateStr = String(value);
      const d = new Date(dateStr + (dateStr.length === 10 ? 'T00:00:00' : ''));
      if (!isNaN(d.getTime())) {
        return d.toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' });
      }
    } catch (e) {
      return String(value);
    }
    return String(value);
  }

  const num = Number(value);
  if (isNaN(num)) {
    return String(value);
  }

  const cleanUnit = (typeof unit === 'string' ? unit : null);
  const cleanCurrency = (typeof currencyCode === 'string' ? currencyCode : 'EUR');

  switch (format) {
    case 'currency': {
      const code = (cleanUnit || cleanCurrency).toUpperCase();
      const localeMap = {
        EUR: 'es-ES',
        USD: 'en-US',
        GBP: 'en-GB',
        MXN: 'es-MX',
        CAD: 'en-CA',
        AUD: 'en-AU',
        ARS: 'es-AR',
        BRL: 'pt-BR'
      };
      const loc = localeMap[code] || 'en-US';

      try {
        return new Intl.NumberFormat(loc, {
          style: 'currency',
          currency: code,
          maximumFractionDigits: precision
        }).format(num);
      } catch (e) {
        return `${code} ${num.toFixed(precision)}`;
      }
    }

    case 'percent':
      return `${num.toLocaleString('es-ES', {
        minimumFractionDigits: 0,
        maximumFractionDigits: precision
      })}${cleanUnit ? ' ' + cleanUnit : '%'}`;

    case 'number':
    default:
      return `${num.toLocaleString('es-ES', {
        minimumFractionDigits: 0,
        maximumFractionDigits: precision
      })}${cleanUnit ? ' ' + cleanUnit : ''}`;
  }
}
