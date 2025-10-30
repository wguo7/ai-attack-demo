'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { attackDefinitions, type AttackDefinition } from '@/lib/attacks/engine';
import { cn } from '@/lib/utils';

interface AttackSelectorProps {
  selectedAttack: string;
  onAttackSelect: (attackId: string) => void;
}

// Risk level config removed - intensity is now adjustable in ControlBar

const categoryLabels: { [key: string]: string } = {
  character: 'Character',
  word: 'Word',
  sentence: 'Sentence',
  semantic: 'Semantic',
};

export default function AttackSelector({ selectedAttack, onAttackSelect }: AttackSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = Array.from(new Set(attackDefinitions.map(a => a.category)));

  const filteredAttacks = attackDefinitions.filter(attack => {
    const matchesSearch = attack.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         attack.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || attack.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

// Risk badge removed - intensity is now adjustable

  return (
    <div className="h-full flex flex-col">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-slate-200 mb-4">Attack Types</h2>
        
        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            type="text"
            placeholder="Search attacks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-slate-800/50 border-slate-700 text-slate-200 placeholder:text-slate-500"
          />
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mb-3">
          <button
            onClick={() => setSelectedCategory(null)}
            className={cn(
              "px-3 py-1 rounded-md text-xs font-medium transition-colors",
              !selectedCategory
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                : "bg-slate-800/50 text-slate-400 border border-slate-700 hover:border-slate-600"
            )}
          >
            All
          </button>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={cn(
                "px-3 py-1 rounded-md text-xs font-medium transition-colors",
                selectedCategory === category
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  : "bg-slate-800/50 text-slate-400 border border-slate-700 hover:border-slate-600"
              )}
            >
              {categoryLabels[category]}
            </button>
          ))}
        </div>
      </div>

      {/* Attack List */}
      <ScrollArea className="flex-1">
        <div className="space-y-2 pr-2">
          {filteredAttacks.map((attack) => (
            <button
              key={attack.id}
              onClick={() => onAttackSelect(attack.id)}
              className={cn(
                "w-full text-left p-3 rounded-lg border transition-all",
                selectedAttack === attack.id
                  ? "bg-emerald-500/10 border-emerald-500/50 shadow-lg shadow-emerald-500/10"
                  : "bg-slate-800/30 border-slate-700/50 hover:border-slate-600 hover:bg-slate-800/50"
              )}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{attack.icon}</span>
                </div>
              </div>
              <h3 className="font-semibold text-slate-200 mb-1">{attack.name}</h3>
              <p className="text-xs text-slate-400">{attack.description}</p>
              <div className="mt-2">
                <Badge variant="outline" className="text-xs bg-slate-900/50 text-slate-400 border-slate-700">
                  {categoryLabels[attack.category]}
                </Badge>
              </div>
            </button>
          ))}
        </div>
      </ScrollArea>

      {filteredAttacks.length === 0 && (
        <div className="text-center py-8 text-slate-400 text-sm">
          No attacks found matching your search.
        </div>
      )}
    </div>
  );
}

