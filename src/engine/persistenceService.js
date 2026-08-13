/**
 * Servicio de Persistencia Temporal en LocalStorage para CalculadoraHub.
 * Cumple con la regla ética: máx 60 minutos de retención, sin servidor, borrado silencioso.
 */

const PREFIX = 'ch:calc:';

export function saveState(calculatorId, values, units) {
  if (!calculatorId) return;

  try {
    const key = `${PREFIX}${calculatorId}:v1`;
    const now = Date.now();
    const data = {
      values,
      units,
      savedAt: now,
      expiresAt: now + 60 * 60 * 1000 // 60 minutos
    };
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    // Si localStorage está deshabilitado o lleno, no falla
  }
}

export function loadState(calculatorId) {
  if (!calculatorId) return null;

  try {
    const key = `${PREFIX}${calculatorId}:v1`;
    const item = localStorage.getItem(key);
    if (!item) return null;

    const parsed = JSON.parse(item);
    const now = Date.now();

    if (now > parsed.expiresAt) {
      localStorage.removeItem(key);
      return null;
    }

    return parsed;
  } catch (err) {
    return null;
  }
}

export function clearState(calculatorId) {
  if (!calculatorId) return;
  try {
    const key = `${PREFIX}${calculatorId}:v1`;
    localStorage.removeItem(key);
  } catch (err) {}
}
