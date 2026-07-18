import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Abiel Core Internal Dashboard',
  description: 'Panel interno moderno para inspeccionar la arquitectura de Abiel Core',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body style={{ margin: 0, fontFamily: 'Inter, Arial, sans-serif' }}>{children}</body>
    </html>
  );
}
