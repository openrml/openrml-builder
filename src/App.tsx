import { Toaster } from 'sonner'
import { AppProviders } from './presentation/contexts'
import { Dashboard } from './presentation/components/dashboard/Dashboard'
import { Constructor } from './presentation/components/constructor/Constructor'
import { useNavigation } from './presentation/contexts/navigation.context'
import { useLanguage } from './presentation/contexts/language.context'
import { ThemeToggle } from './presentation/components/ThemeToggle'
import './styles/globals.css'

function AppContent() {
  const { view, setView } = useNavigation()
  const { language, setLanguage } = useLanguage()

  return (
    <div className="min-h-screen bg-gradient-to-br from-[hsl(var(--gradient-from))] via-[hsl(var(--gradient-via))] to-[hsl(var(--gradient-to))]">
      {/* Header with glass effect */}
      <header className="sticky top-0 z-30 border-b border-[hsl(var(--color-border))]/50 bg-[hsl(var(--color-background))]/80 backdrop-blur-md supports-[backdrop-filter]:bg-[hsl(var(--color-background))]/60">
        <div className="container-responsive mx-auto py-3">
          <div className="flex items-center justify-between">
            {/* Logo and branding */}
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-primary flex items-center justify-center shadow-sm">
                <span className="text-base font-bold text-[hsl(var(--color-primary-foreground))]">🤖</span>
              </div>
              <div>
                <h1 className="text-lg font-semibold text-[hsl(var(--color-foreground))]">
                  OpenRML Builder
                </h1>
                <p className="text-xs text-[hsl(var(--color-muted-foreground))]">
                  v1.0
                </p>
              </div>
            </div>
            
            {/* Right side: Controls + Navigation */}
            <div className="flex items-center gap-3">
              {/* Theme Toggle */}
              <ThemeToggle />
              
              {/* Language Selector */}
              <div className="flex gap-1">
                {(['en', 'ua', 'ru'] as const).map(lang => (
                  <button
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                      language === lang
                        ? 'bg-[hsl(var(--color-primary))] text-[hsl(var(--color-primary-foreground))] shadow-sm'
                        : 'text-[hsl(var(--color-muted-foreground))] hover:bg-[hsl(var(--color-muted))]'
                    }`}
                    title={lang === 'en' ? 'English' : lang === 'ua' ? 'Українська' : 'Русский'}
                  >
                    {lang.toUpperCase()}
                  </button>
                ))}
              </div>
              
              {/* Navigation */}
              <nav className="flex gap-1">
                <button
                  onClick={() => setView('dashboard')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
                    view === 'dashboard'
                      ? 'bg-[hsl(var(--color-primary))]/10 text-[hsl(var(--color-primary-active))] shadow-sm'
                      : 'text-[hsl(var(--color-muted-foreground))] hover:bg-[hsl(var(--color-muted))] hover:text-[hsl(var(--color-foreground))]'
                  }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => setView('constructor')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
                    view === 'constructor'
                      ? 'bg-[hsl(var(--color-primary))]/10 text-[hsl(var(--color-primary-active))] shadow-sm'
                      : 'text-[hsl(var(--color-muted-foreground))] hover:bg-[hsl(var(--color-muted))] hover:text-[hsl(var(--color-foreground))]'
                  }`}
                >
                  Constructor
                </button>
              </nav>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container-responsive mx-auto py-4 sm:py-6 md:py-8 animate-fade-in">
        {view === 'dashboard' ? <Dashboard /> : <Constructor />}
      </main>

      {/* Toast notifications */}
      <Toaster 
        position="top-right"
        toastOptions={{
          className: 'font-sans',
          duration: 4000,
        }}
      />
    </div>
  )
}

function App() {
  return (
    <AppProviders>
      <AppContent />
    </AppProviders>
  )
}

export default App