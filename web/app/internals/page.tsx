'use client';

import { useMemo, useState } from 'react';

const data = [
  {
    id: 'core',
    title: 'Core',
    description: 'Kernel reusable del framework',
    items: [
      { name: 'EventBus', status: 'active' },
      { name: 'EventPublisher', status: 'active' },
      { name: 'Capability', status: 'active' },
      { name: 'TenantContext', status: 'active' },
    ],
    detail: 'La capa base que soporta eventos, capacidades, seguridad y contexto de tenant.',
  },
  {
    id: 'engines',
    title: 'Engines',
    description: 'Motores de ejecución y conversación',
    items: [
      { name: 'Agent Runtime', status: 'active' },
      { name: 'AI Engine', status: 'active' },
      { name: 'Conversation Engine', status: 'active' },
    ],
    detail: 'Motores de ejecución, conversación e IA que convierten los flujos en comportamiento operativo.',
  },
  {
    id: 'modules',
    title: 'Modules',
    description: 'Módulos de negocio del servidor',
    items: [
      { name: 'Empresa', status: 'active' },
      { name: 'Usuario', status: 'active' },
      { name: 'Human Intervention', status: 'active' },
      { name: 'WhatsApp Sender', status: 'active' },
    ],
    detail: 'Representan los casos de negocio del sistema: empresas, usuarios, conversaciones y entregas.',
  },
];

export default function InternalsPage() {
  const [selected, setSelected] = useState(data[0].id);
  const active = useMemo(() => data.find((item) => item.id === selected) ?? data[0], [selected]);

  return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #06121d 0%, #102137 100%)', color: '#f5f8ff', padding: 24 }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap', marginBottom: 20 }}>
          <div>
            <p style={{ margin: 0, color: '#4cc9f0', textTransform: 'uppercase', letterSpacing: '0.2em', fontSize: 12, fontWeight: 700 }}>Vista interna</p>
            <h1 style={{ margin: '6px 0 0', fontSize: '2rem' }}>Panel operativo del servidor</h1>
            <p style={{ margin: '8px 0 0', color: '#8da1b8', maxWidth: 720 }}>Explora los bloques principales del sistema y consulta más contexto al seleccionar cada componente.</p>
          </div>
          <a href="/" style={{ textDecoration: 'none', padding: '10px 14px', borderRadius: 999, background: 'linear-gradient(120deg, #39d98a, #4cc9f0)', color: '#04111b', fontWeight: 700 }}>Volver al inicio</a>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 16 }}>
          <div style={{ display: 'grid', gap: 12 }}>
            {data.map((section) => (
              <section key={section.id} style={{ background: 'rgba(10,24,38,0.92)', border: '1px solid rgba(108,139,171,0.22)', borderRadius: 20, padding: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <div>
                    <p style={{ margin: 0, color: '#39d98a', fontSize: 12, fontWeight: 700, textTransform: 'uppercase' }}>{section.title}</p>
                    <h2 style={{ margin: '4px 0 0', fontSize: 18 }}>{section.title}</h2>
                  </div>
                  <span style={{ padding: '6px 10px', borderRadius: 999, background: 'rgba(76,201,240,0.14)', color: '#4cc9f0', fontSize: 12, fontWeight: 700 }}>{section.items.length} items</span>
                </div>
                <p style={{ margin: '0 0 10px', color: '#8da1b8', fontSize: 14 }}>{section.description}</p>
                <div style={{ display: 'grid', gap: 8 }}>
                  {section.items.map((item) => (
                    <button key={item.name} onClick={() => setSelected(section.id)} style={{ border: selected === section.id ? '1px solid rgba(57,217,138,0.55)' : '1px solid transparent', background: selected === section.id ? 'rgba(57,217,138,0.12)' : 'rgba(20,36,54,0.96)', color: '#f5f8ff', padding: '10px 12px', borderRadius: 12, cursor: 'pointer', textAlign: 'left' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <strong>{item.name}</strong>
                        <span style={{ color: '#4cc9f0', fontSize: 12 }}>{item.status}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <aside style={{ background: 'rgba(10,24,38,0.92)', border: '1px solid rgba(108,139,171,0.22)', borderRadius: 20, padding: 18, alignSelf: 'start', position: 'sticky', top: 16 }}>
            <p style={{ margin: 0, color: '#4cc9f0', fontSize: 12, fontWeight: 700, textTransform: 'uppercase' }}>Detalle</p>
            <h3 style={{ margin: '8px 0 0', fontSize: 20 }}>{active.title}</h3>
            <p style={{ margin: '8px 0 0', color: '#8da1b8', lineHeight: 1.6 }}>{active.detail}</p>
            <div style={{ marginTop: 16, display: 'grid', gap: 8 }}>
              <div style={{ padding: 12, borderRadius: 12, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(108,139,171,0.22)' }}>
                <strong style={{ display: 'block', marginBottom: 4 }}>Rol</strong>
                <span style={{ color: '#8da1b8' }}>{active.description}</span>
              </div>
              <div style={{ padding: 12, borderRadius: 12, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(108,139,171,0.22)' }}>
                <strong style={{ display: 'block', marginBottom: 4 }}>Estado</strong>
                <span style={{ color: '#8da1b8' }}>Activo y disponible para inspección</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
