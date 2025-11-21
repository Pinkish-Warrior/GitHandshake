import './globals.css';

export const metadata = {
  title: 'GitHandShake - GitHub Issue Finder',
  description: 'Find and contribute to open-source projects',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
