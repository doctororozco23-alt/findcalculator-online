import React, { useState } from 'react';
import { formatValue } from '../engine/formulaEngine';

export default function TableRenderer({ tableDef, rows, activeCurrency = 'EUR' }) {
  const [expanded, setExpanded] = useState(false);

  if (!tableDef || !rows || rows.length === 0) return null;

  const displayRows = expanded ? rows : rows.slice(0, 5);

  return (
    <div className="card" style={{ marginTop: '24px' }}>
      <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '16px' }}>
        {tableDef.title}
      </h3>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--border)', textAlign: 'left' }}>
              {tableDef.columns.map((col) => (
                <th key={col.id} style={{ padding: '10px 12px', color: 'var(--text-secondary)', fontWeight: 600 }}>
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {displayRows.map((row, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid var(--border)', backgroundColor: idx % 2 === 1 ? 'var(--surface-alt)' : 'transparent' }}>
                {tableDef.columns.map((col) => (
                  <td key={col.id} className="tabular-nums" style={{ padding: '10px 12px', fontWeight: col.id === 'balance' ? 600 : 400 }}>
                    {formatValue(row[col.id], col.format || 'currency', 2, null, activeCurrency)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {rows.length > 5 && (
        <div style={{ marginTop: '16px', textAlign: 'center' }}>
          <button
            onClick={() => setExpanded(!expanded)}
            className="btn-secondary"
          >
            {expanded ? 'Mostrar Menos Filas' : `Ver Tabla Completa (${rows.length} filas)`}
          </button>
        </div>
      )}
    </div>
  );
}
