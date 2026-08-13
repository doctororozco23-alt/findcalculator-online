/**
 * Evaluador de condiciones estructuradas para CalculadoraHub.
 * Soporta operaciones atómicas (==, !=, >, <, >=, <=, between, in) y compuestas (and, or).
 */

export function evaluateCondition(condition, scope) {
  if (!condition) return true;

  // Condiciones compuestas: AND
  if (condition.and && Array.isArray(condition.and)) {
    return condition.and.every(c => evaluateCondition(c, scope));
  }

  // Condiciones compuestas: OR
  if (condition.or && Array.isArray(condition.or)) {
    return condition.or.some(c => evaluateCondition(c, scope));
  }

  // Condición atómica
  const { field, op, value } = condition;
  if (!field || !(field in scope)) return false;

  const fieldValue = scope[field];

  switch (op) {
    case '==':
    case '=':
      return fieldValue == value;
    case '!=':
      return fieldValue != value;
    case '>':
      return Number(fieldValue) > Number(value);
    case '<':
      return Number(fieldValue) < Number(value);
    case '>=':
      return Number(fieldValue) >= Number(value);
    case '<=':
      return Number(fieldValue) <= Number(value);
    case 'between':
      if (Array.isArray(value) && value.length === 2) {
        const num = Number(fieldValue);
        return num >= Number(value[0]) && num <= Number(value[1]);
      }
      return false;
    case 'in':
      if (Array.isArray(value)) {
        return value.includes(fieldValue);
      }
      return false;
    default:
      return false;
  }
}
