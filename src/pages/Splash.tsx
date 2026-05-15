import { LanguageSelector, SplashButtons, SplashHeader, SplashLogo } from "@/components/splash";
import { useTheme } from "@/hooks/useTheme";
import { useNavigate } from "react-router-dom";

const Splash: React.FC = () => {

  const navigate = useNavigate();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  // Dynamic Theme Styling
  const bgColor = isDark ? "bg-slate-950" : "bg-slate-50";
  const overlayClass = isDark
    ? "bg-black/60 lg:bg-black/40"
    : "bg-white/40 lg:bg-white/20";
  const skipButtonClass = isDark
    ? "text-white/60 hover:text-white"
    : "text-slate-600 hover:text-black";

  return (
    <div
      className={`relative min-h-screen w-full flex flex-col overflow-hidden ${bgColor}`}
    >
      {/* 1. Background Layer (Video/Image) */}
      <div className="absolute inset-0 z-0">
        <div
          className="h-full w-full bg-cover bg-center transition-transform duration-1000 scale-105"
          style={{
            backgroundImage: `url("https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&q=80")`,
          }}
        />
        <div
          className={`absolute inset-0 z-10 backdrop-blur-[2px] ${overlayClass}`}
        />
      </div>

      {/* 2. Top Navigation */}
      <header className="relative z-30 mx-auto w-full max-w-7xl">
        <SplashHeader onSkip={() => {}} className={skipButtonClass} />
      </header>

      {/* 3. Main Content Container */}
      <main className="relative z-20 flex flex-1 items-center px-6 lg:px-12">
        <div className="mx-auto grid w-full max-w-7xl items-center gap-12 lg:grid-cols-2 lg:gap-24">
          {/* Left Column: Branding */}
          <section className="flex flex-col items-center lg:items-start">
            <SplashLogo />
          </section>

          {/* Right Column: Interactive Card */}
          <section className="flex w-full flex-col items-center lg:items-end">
            <div className="w-full max-w-md rounded-[2.5rem] p-2 transition-all lg:bg-white/10 lg:p-10 lg:backdrop-blur-2xl lg:ring-1 lg:ring-white/20 lg:shadow-2xl">
              <h2 className="hidden lg:block mb-8 text-3xl font-bold text-white">
                Welcome back.
              </h2>

              <SplashButtons
                onSignUp={() => {
                   navigate("/signup")
                }}
                onLogin={() => {
                  navigate("/login")
                }}
                theme={resolvedTheme}
              />

              <div className="mt-8 flex flex-col items-center gap-4">
                <LanguageSelector
                  onLanguageChange={() => {}}
                  className={
                    isDark
                      ? "text-slate-400 hover:text-white"
                      : "text-slate-600 hover:text-black"
                  }
                  theme={resolvedTheme}
                />

                {/* Secondary Desktop Link */}
                <p className="hidden lg:block text-sm text-white/50">
                  By joining, you agree to our Terms of Service.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* 4. Mobile Bottom Indicator */}
      <div className="relative z-30 flex h-8 items-center justify-center lg:hidden">
        <div
          className={`h-1.5 w-32 rounded-full ${isDark ? "bg-white/20" : "bg-black/10"}`}
        />
      </div>
    </div>
  );
};

export default Splash;
