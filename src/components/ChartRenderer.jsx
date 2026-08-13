import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { formatValue } from '../engine/formulaEngine';

export default function ChartRenderer({ chartDef, rows, results, activeCurrency = 'EUR' }) {
  if (!chartDef) return null;

  if (chartDef.type === 'gauge') {
    const bmiVal = results['bmi'] || 0;
    const zones = chartDef.zones || [];

    const minBmi = 10;
    const maxBmi = 45;
    const clampedBmi = Math.max(minBmi, Math.min(maxBmi, bmiVal));
    const percent = ((clampedBmi - minBmi) / (maxBmi - minBmi)) * 100;

    return (
      <div className="card" style={{ marginTop: '24px' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '16px', color: 'var(--text-secondary)' }}>
          {chartDef.title}
        </h3>

        <div style={{ position: 'relative', height: '36px', borderRadius: '18px', display: 'flex', overflow: 'hidden', border: '1px solid var(--border)' }}>
          {zones.map((zone, i) => (
            <div
              key={i}
              style={{
                flex: zone.to - zone.from,
                backgroundColor: zone.role === 'success' ? '#10B981' : zone.role === 'warning' ? '#F59E0B' : zone.role === 'error' ? '#EF4444' : '#3B82F6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                fontSize: '0.75rem',
                fontWeight: 600
              }}
            >
              {zone.label}
            </div>
          ))}

          {bmiVal > 0 && (
            <div
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: `${percent}%`,
                width: '4px',
                backgroundColor: '#0F172A',
                boxShadow: '0 0 4px rgba(255,255,255,0.9)',
                transform: 'translateX(-50%)',
                transition: 'left 0.4s ease'
              }}
            />
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
          <span>10 (Underweight)</span>
          <span>18.5</span>
          <span>25.0</span>
          <span>30.0</span>
          <span>45 (Obesity)</span>
        </div>
      </div>
    );
  }

  if ((chartDef.type === 'area' || chartDef.type === 'line') && rows && rows.length > 0) {
    return (
      <div className="card" style={{ marginTop: '24px' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '16px', color: 'var(--text-secondary)' }}>
          {chartDef.title}
        </h3>

        <div style={{ width: '100%', height: chartDef.responsive?.mobileHeight || 220 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={rows} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey={chartDef.xAxis.from} stroke="var(--chart-axis-text)" style={{ fontSize: '12px' }} />
              <YAxis
                stroke="var(--chart-axis-text)"
                style={{ fontSize: '12px' }}
                tickFormatter={(val) => formatValue(val, 'currency', 0, null, activeCurrency)}
              />
              <Tooltip
                contentStyle={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', borderRadius: '8px', fontSize: '12px' }}
                formatter={(value) => [formatValue(value, 'currency', 0, null, activeCurrency), chartDef.series[0]?.label || 'Balance']}
                labelFormatter={(label) => `Year ${label}`}
              />
              <Area type="monotone" dataKey={chartDef.series[0].column} stroke="var(--primary)" fill="var(--primary-soft)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }

  return null;
}
