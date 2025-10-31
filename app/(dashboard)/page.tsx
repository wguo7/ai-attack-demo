'use client';

import { useState } from 'react';
import AttackSelector from '@/components/attacks/AttackSelector';
import ControlBar from '@/components/attacks/ControlBar';
import ExplanationPanel from '@/components/attacks/ExplanationPanel';
import TextPanel from '@/components/attacks/TextPanel';

export default function DashboardPage() {
  const sampleText = 'Lorem ipsum is a pseudo-Latin text used in web design, typography, layout, and printing in place of English to emphasise design elements over content. It\'s also called placeholder (or filler) text. It\'s a convenient tool for mock-ups. It helps to outline the visual elements of a document or presentation, eg typography, font, or layout. Lorem ipsum is mostly a part of a Latin text by the classical author and philosopher Cicero. Its words and letters have been changed by addition or removal, so to deliberately render its content nonsensical; it\'s not genuine, correct, or comprehensible Latin anymore. While lorem ipsum\'s still resembles classical Latin, it actually has no meaning whatsoever. As Cicero\'s text doesn\'t contain the letters K, W, or Z, alien to latin, these, and others are often inserted randomly to mimic the typographic appearence of European languages, as are digraphs not to be found in the original.';
  
  const [inputText, setInputText] = useState(sampleText);
  const [outputText, setOutputText] = useState('');
  const [selectedAttack, setSelectedAttack] = useState<string>('');

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Description Section */}
      <div className="mb-6">
        <div className="glass-morphism rounded-2xl p-6 border border-slate-700/50">
          <h1 className="text-3xl font-bold text-gradient mb-3">AI Adversarial Attack Demonstration Platform</h1>
          <p className="text-slate-300 text-lg leading-relaxed">
            This platform demonstrates various adversarial text attack techniques used in security research and AI robustness testing. 
            Select an attack type from the sidebar, adjust the intensity using the slider, and execute to see how different attacks 
            transform your text. Use the eye icons in the output panel to visualize invisible Unicode characters, whitespace, and differences.
          </p>
          <p className="text-slate-400 text-sm mt-3">
            <span className="font-semibold text-amber-400">Warning:</span> These attacks are for educational and security testing purposes only. 
            Do not use them to bypass security systems or violate terms of service.
          </p>
        </div>
      </div>
      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6" style={{ minHeight: 'calc(100vh - 320px)' }}>
        
        {/* Left Sidebar - Attack Selection */}
        <div className="lg:col-span-1">
          <div className="glass-morphism rounded-2xl p-6 h-full">
            <AttackSelector 
              selectedAttack={selectedAttack}
              onAttackSelect={setSelectedAttack}
            />
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-3 flex flex-col space-y-6">
          
          {/* Control Bar */}
          <div className="glass-morphism rounded-2xl p-4">
            <ControlBar 
              inputText={inputText}
              selectedAttack={selectedAttack}
              onOutputChange={setOutputText}
              outputText={outputText}
            />
          </div>

          {/* Text Panels Row */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 flex-1 min-h-0">
            {/* Input Panel */}
            <div className="flex flex-col">
              <TextPanel
                title="Original Text"
                value={inputText}
                onValueChange={setInputText}
                metrics={{ characters: inputText.length, words: inputText.split(/\s+/).filter(Boolean).length }}
              />
            </div>

            {/* Output Panel */}
            <div className="flex flex-col">
              <TextPanel
                title="Attacked Text"
                value={outputText}
                readOnly
                originalText={inputText}
                metrics={{ characters: outputText.length, words: outputText.split(/\s+/).filter(Boolean).length }}
                isLoading={false}
              />
            </div>
          </div>

          {/* Explanation Panel */}
          <div className="glass-morphism rounded-2xl">
            <ExplanationPanel attackType={selectedAttack} />
          </div>

        </div>
      </div>
    </div>
  );
}

