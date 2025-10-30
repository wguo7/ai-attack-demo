import Link from 'next/link';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen relative">
      {/* Premium Header */}
      <header className="glass-morphism border-b border-slate-700/50 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link href="/" className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">AI</span>
                </div>
                <h1 className="text-2xl font-bold text-gradient">AI Attack Demo</h1>
              </Link>
            </div>
            <nav className="flex items-center space-x-6 text-slate-300">
              <Link href="/" className="hover:text-emerald-400 transition-colors">Dashboard</Link>
              <Link href="/documentation" className="hover:text-emerald-400 transition-colors">Documentation</Link>
            </nav>
          </div>
        </div>
      </header>
      {children}
    </div>
  );
}

