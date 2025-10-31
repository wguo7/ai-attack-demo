'use client';

import { Code2, Info, Shield } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { attackDefinitions, AttackEngine } from '@/lib/attacks/engine';

// Remove unused imports and types
interface ExplanationPanelProps {
  attackType: string;
}

interface AttackExplanation {
  description: string;
  detectionTips: string[];
  examples: string[];
}

const riskLevelConfig: Record<string, {
  color: string;
  bg: string;
  border: string;
  label: string;
}> = {
  low: { color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', label: 'Low Risk' },
  medium: { color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30', label: 'Medium Risk' },
  high: { color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30', label: 'High Risk' },
  critical: { color: 'text-red-500', bg: 'bg-red-600/10', border: 'border-red-600/30', label: 'Critical Risk' },
};

export default function ExplanationPanel({ attackType }: ExplanationPanelProps) {
  const attack = attackDefinitions.find(a => a.id === attackType);
  const [explanation, setExplanation] = useState<AttackExplanation | null>(null);

  useEffect(() => {
    if (attackType && attack) {
      // Get explanation from attack engine by executing a mock attack
      AttackEngine.executeAttack('sample text', attackType).then(result => {
        setExplanation(result.explanation);
      });
    } else {
      setExplanation(null);
    }
  }, [attackType, attack]);
  
  if (!attackType || !attack) {
    return (
      <div className="p-6 text-center text-slate-400">
        <Info className="w-12 h-12 mx-auto mb-4 text-slate-600" />
        <p>Select an attack type to see detailed explanations and detection methods.</p>
      </div>
    );
  }

 const riskConfig = (riskLevelConfig[attack.riskLevel] ?? riskLevelConfig.medium)!;
  
  if (!explanation) {
    return (
      <div className="p-6 text-center text-slate-400">
        <div className="animate-pulse">Loading explanation...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{attack.icon}</span>
          <div>
            <h3 className="text-xl font-bold text-slate-200">{attack.name}</h3>
            <Badge className={`mt-1 ${riskConfig.bg} ${riskConfig.color} ${riskConfig.border} border`}>
              {riskConfig.label}
            </Badge>
          </div>
        </div>
      </div>

      <Tabs defaultValue="how" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-slate-800/50 border-slate-700">
          <TabsTrigger value="how" className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400">
            How It Works
          </TabsTrigger>
          <TabsTrigger value="detection" className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400">
            Detection
          </TabsTrigger>
          <TabsTrigger value="examples" className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400">
            Examples
          </TabsTrigger>
        </TabsList>

        <TabsContent value="how" className="mt-4">
          <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700/50">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-slate-200 mb-2">Attack Mechanism</h4>
                <p className="text-slate-300 text-sm leading-relaxed">
                  {explanation.description}
                </p>
                <p className="text-slate-400 text-sm mt-3">
                  This attack targets the <span className="font-mono text-emerald-400">{attack.category}</span> level of text processing, 
                  making it particularly effective against systems that don't properly handle Unicode variations.
                </p>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="detection" className="mt-4">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h4 className="font-semibold text-slate-200 mb-3">Detection Strategies</h4>
                <ul className="space-y-2">
                  {explanation.detectionTips.map((tip, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-slate-300">
                      <span className="text-emerald-400 mt-1">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="examples" className="mt-4">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Code2 className="w-5 h-5 text-teal-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h4 className="font-semibold text-slate-200 mb-3">Real-World Examples</h4>
                <div className="space-y-3">
                  {explanation.examples.map((example, index) => (
                    <div key={index} className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50">
                      <code className="text-sm text-slate-300 font-mono whitespace-pre-wrap break-all">{example}</code>
                      {/* Show hex representation for invisible chars */}
                      {example.includes('zero-width') || example.includes('bidirectional') ? (
                        <div className="mt-2 text-xs text-slate-500 font-mono">
                          Hex: {Array.from(example.split('→')[1]?.trim() || '').map((c, _i) => {
                            const code = c.charCodeAt(0);
                            return code < 32 || code > 126 ? `[${code.toString(16).toUpperCase()}]` : c;
                          }).join('')}
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

