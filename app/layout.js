import './globals.css';

export const metadata = {
  title: 'FIFA 2026 · Immersive World Cup Experience',
  description: 'The most cinematic FIFA World Cup experience ever built. 3D football universe with real-time data, immersive animations and premium UI.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased bg-[#04040a] text-white overflow-x-hidden selection:bg-emerald-500/30 selection:text-white">
        {children}
      </body>
    </html>
  );
}
