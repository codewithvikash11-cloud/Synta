import { Header } from '@/components/Header';
import { ErrorInput } from '@/components/ErrorInput';
import { Terminal, ShieldCheck, HelpCircle } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-blue-500/30">
      <Header />

      <main className="flex-1 flex flex-col items-center pt-16 sm:pt-24 pb-12 px-4 sm:px-6">

        {/* Global Container for Homepage Content */}
        <div className="w-full max-w-[1200px] mx-auto flex flex-col items-center">

          {/* Hero + Input Container - Strictly 800px */}
          <div className="w-full max-w-[800px] mx-auto flex flex-col items-center text-center">

            <div className="mb-10 sm:mb-14">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6 text-white leading-[1.1]">
                Paste your programming error. <br />
                <span className="text-blue-500">Get the fix.</span>
              </h1>
              <p className="text-lg sm:text-xl text-slate-400 leading-relaxed">
                AI-powered debugging for real stack traces and runtime errors.
              </p>
            </div>

            {/* Interaction Component - Will contain the TextArea */}
            <div className="w-full">
              <ErrorInput />
            </div>

            {/* Secondary Action - No dividers */}
            <div className="w-full max-w-xs mx-auto my-10 flex items-center justify-center gap-4 text-slate-700">
              <span className="text-xs uppercase tracking-wider font-semibold">or</span>
            </div>

            <div className="w-full sm:w-auto mb-24">
              <button className="w-full sm:w-auto px-6 py-2.5 rounded-md border border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 transition-colors text-sm font-medium">
                Search already solved errors
              </button>
            </div>

          </div>

          {/* Rules Section (Grid) - Floating Cards */}
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-[1200px] mx-auto">
            <div className="flex flex-col items-start text-left p-6 rounded-lg border border-slate-800 bg-slate-900/40 hover:bg-slate-900/60 transition-colors">
              <div className="p-2 mb-4 bg-blue-500/10 rounded-lg text-blue-400">
                <Terminal className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-100 mb-1">Stack Traces & Logs</h3>
              <p className="text-sm text-slate-400 leading-relaxed">Paste raw output directly from your terminal or console.</p>
            </div>

            <div className="flex flex-col items-start text-left p-6 rounded-lg border border-slate-800 bg-slate-900/40 hover:bg-slate-900/60 transition-colors">
              <div className="p-2 mb-4 bg-blue-500/10 rounded-lg text-blue-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-100 mb-1">Runtime Exceptions</h3>
              <p className="text-sm text-slate-400 leading-relaxed">Logic errors, crashes, and undefined behaviors.</p>
            </div>

            <div className="flex flex-col items-start text-left p-6 rounded-lg border border-slate-800 bg-slate-900/40 hover:bg-slate-900/60 transition-colors">
              <div className="p-2 mb-4 bg-red-500/10 rounded-lg text-red-400">
                <HelpCircle className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-100 mb-1">No Questions</h3>
              <p className="text-sm text-slate-400 leading-relaxed">General "how-to" questions or prompt engineering are rejected.</p>
            </div>
          </div>

        </div>
      </main>

      {/* Trust Footer */}
      <footer className="w-full border-t border-slate-900 py-8 text-center bg-slate-950">
        <p className="text-slate-600 text-xs mb-4">
          Errors are verified automatically. Solutions are reviewed before publishing.
        </p>
        <div className="flex justify-center gap-6 text-sm text-slate-500">
          <a href="#" className="hover:text-slate-300">About</a>
          <a href="#" className="hover:text-slate-300">Privacy Policy</a>
          <a href="#" className="hover:text-slate-300">Disclaimer</a>
        </div>
      </footer>
    </div>
  );
}
