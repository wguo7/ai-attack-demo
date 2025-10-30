import { create } from 'zustand';

interface AttackState {
  inputText: string;
  outputText: string;
  selectedAttack: string;
  attackHistory: Array<{
    id: string;
    attackType: string;
    input: string;
    output: string;
    timestamp: Date;
  }>;
  setInputText: (text: string) => void;
  setOutputText: (text: string) => void;
  setSelectedAttack: (attackId: string) => void;
  addToHistory: (attackType: string, input: string, output: string) => void;
  clearHistory: () => void;
}

export const useAttackStore = create<AttackState>((set) => ({
  inputText: 'Enter your text to see how different AI attacks work...',
  outputText: '',
  selectedAttack: '',
  attackHistory: [],
  
  setInputText: (text) => set({ inputText: text }),
  setOutputText: (text) => set({ outputText: text }),
  setSelectedAttack: (attackId) => set({ selectedAttack: attackId }),
  
  addToHistory: (attackType, input, output) => 
    set((state) => ({
      attackHistory: [
        {
          id: `${Date.now()}-${Math.random()}`,
          attackType,
          input,
          output,
          timestamp: new Date(),
        },
        ...state.attackHistory,
      ].slice(0, 50), // Keep last 50 attacks
    })),
  
  clearHistory: () => set({ attackHistory: [] }),
}));

