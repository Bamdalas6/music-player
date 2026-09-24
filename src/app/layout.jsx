import './globals.css';

export const metadata = {
  title: 'Audio Player — Voice Interactive Music Experience',
  description: 'Minimal, modern audio player with voice search, immersive playback, and circular tactile controls.',
  referrer: 'no-referrer-when-downgrade',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
  themeColor: '#161719',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-[#0D0E10] text-white antialiased">
        {children}
      </body>
    </html>
  );
}
