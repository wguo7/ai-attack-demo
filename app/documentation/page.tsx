export default function DocumentationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 py-8">
      <div className="container mx-auto px-6">
        <div className="glass-morphism rounded-2xl p-8 max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gradient mb-6">Documentation & Warning</h1>
          
          <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-red-400 mb-3">⚠️ Important Warning</h2>
            <p className="text-slate-300">
              This tool demonstrates adversarial attacks for educational and defensive purposes only. 
              Do not use these techniques for malicious activities.
            </p>
          </div>

          <div className="space-y-6 text-slate-300">
            <div>
              <h3 className="text-2xl font-semibold text-slate-200 mb-3">Usage Guidelines</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Use for AI security research and testing</li>
                <li>Test your own systems' robustness</li>
                <li>Educational demonstrations only</li>
                <li>Do not use for bypassing security measures</li>
                <li>Responsible disclosure of vulnerabilities</li>
              </ul>
            </div>

            <div>
              <h3 className="text-2xl font-semibold text-slate-200 mb-3">Attack Categories</h3>
              <div className="grid gap-4">
                <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
                  <h4 className="font-semibold text-emerald-400 mb-2">🔤 Homoglyph Attacks</h4>
                  <p className="text-sm">Replace characters with visually similar Unicode glyphs from different scripts (Latin → Cyrillic, Greek) to bypass text filters and AI detection systems.</p>
                  <div className="mt-2 text-xs text-slate-400">
                    <strong>Example:</strong> paypal.com → рaypal.com (Cyrillic р)
                  </div>
                </div>

                <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
                  <h4 className="font-semibold text-amber-400 mb-2">👻 Invisible Character Attacks</h4>
                  <p className="text-sm">Insert zero-width spaces, zero-width joiners, and bidirectional override characters that are invisible to humans but can break text processing pipelines.</p>
                  <div className="mt-2 text-xs text-slate-400">
                    <strong>Example:</strong> hello world → he​l​lo wo​rld
                  </div>
                </div>

                <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
                  <h4 className="font-semibold text-blue-400 mb-2">⌨️ Typo & Misspelling Attacks</h4>
                  <p className="text-sm">Generate keyboard distance-based typos and phonetic misspellings that mimic real-world typing errors to evade keyword-based filters.</p>
                  <div className="mt-2 text-xs text-slate-400">
                    <strong>Example:</strong> the → teh, you → yuo
                  </div>
                </div>

                <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
                  <h4 className="font-semibold text-purple-400 mb-2">🔄 Semantic Attacks</h4>
                  <p className="text-sm">Replace words with contextually similar synonyms to preserve meaning while evading keyword-based detection.</p>
                  <div className="mt-2 text-xs text-slate-400">
                    <strong>Example:</strong> good → excellent, important → crucial
                  </div>
                </div>

                <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
                  <h4 className="font-semibold text-red-400 mb-2">⚡ Multi-Vector Combined Attacks</h4>
                  <p className="text-sm">Chain multiple attack types sequentially for maximum evasion capabilities. Combines character, word, and sentence-level attacks.</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-semibold text-slate-200 mb-3">Intensity Levels</h3>
              <div className="space-y-3">
                <div className="p-3 bg-slate-800/30 rounded-lg">
                  <span className="font-semibold text-emerald-400">Low:</span>
                  <span className="ml-2">Minimal modifications, high readability (~20% replacement rate)</span>
                </div>
                <div className="p-3 bg-slate-800/30 rounded-lg">
                  <span className="font-semibold text-amber-400">Medium:</span>
                  <span className="ml-2">Balanced modifications (~50% replacement rate)</span>
                </div>
                <div className="p-3 bg-slate-800/30 rounded-lg">
                  <span className="font-semibold text-orange-400">High:</span>
                  <span className="ml-2">Aggressive modifications (~80% replacement rate)</span>
                </div>
                <div className="p-3 bg-slate-800/30 rounded-lg">
                  <span className="font-semibold text-red-400">Evasion:</span>
                  <span className="ml-2">Maximum evasion (~95% replacement rate, multiple techniques)</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-semibold text-slate-200 mb-3">Metrics Explained</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <strong className="text-emerald-400">Evasion Score (0-100):</strong> Likelihood that the attack will bypass detection systems. Higher = more effective.
                </div>
                <div>
                  <strong className="text-blue-400">Human Readability (0-100):</strong> How readable the attacked text remains to humans. Higher = more readable.
                </div>
                <div>
                  <strong className="text-amber-400">Detection Difficulty:</strong> Estimated difficulty for detection systems (low/medium/high/extreme).
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-semibold text-slate-200 mb-3">Defense Recommendations</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Use Unicode normalization (NFC/NFD) before text processing</li>
                <li>Implement script detection to identify mixed-script usage</li>
                <li>Strip zero-width and bidirectional characters</li>
                <li>Use semantic embeddings instead of keyword matching</li>
                <li>Implement fuzzy string matching for typo detection</li>
                <li>Validate character sets against expected scripts</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

