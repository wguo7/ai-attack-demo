'use client';

import { useState } from 'react';
import * as React from 'react';
import { Copy, Check, Eye, EyeOff, Search, Diff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

interface TextPanelProps {
  title: string;
  value: string;
  onValueChange?: (value: string) => void;
  readOnly?: boolean;
  metrics?: { characters: number; words: number };
  isLoading?: boolean;
  originalText?: string; // For difference highlighting
  placeholder?: string;
}

// Function to highlight differences between two texts (simplified character-by-character)
function highlightDifferences(original: string, modified: string): React.ReactNode[] {
  const result: React.ReactNode[] = [];
  const maxLen = Math.max(original.length, modified.length);
  
  for (let i = 0; i < maxLen; i++) {
    const origChar = i < original.length ? original[i] : null;
    const modChar = i < modified.length ? modified[i] : null;
    
    // Normalize (remove invisible chars for comparison)
    const origNorm = origChar ? origChar.replace(/[\u200B-\u200D\uFEFF]/g, '') : '';
    const modNorm = modChar ? modChar.replace(/[\u200B-\u200D\uFEFF]/g, '') : '';
    
    if (!origChar && modChar) {
      // Added character
      const display = modChar.match(/[\u200B-\u200D\uFEFF]/) 
        ? (modChar === '\u200B' ? '■' : modChar === '\u200C' ? '▯' : modChar === '\u200D' ? '▮' : modChar)
        : modChar;
      result.push(
        <span key={i} className="bg-emerald-500/30 text-emerald-300 px-0.5 rounded">
          {display}
        </span>
      );
    } else if (origChar && !modChar) {
      // Deleted character
      result.push(
        <span key={i} className="bg-red-500/30 text-red-300 line-through px-0.5 rounded">
          {origChar}
        </span>
      );
    } else if (origNorm !== modNorm) {
      // Changed character
      if (modNorm === '' && modChar) {
        // Invisible char added
        const display = modChar === '\u200B' ? '■' : modChar === '\u200C' ? '▯' : modChar === '\u200D' ? '▮' : modChar;
        result.push(
          <span key={i} className="bg-blue-500/30 text-blue-300 px-0.5 rounded">
            {display}
          </span>
        );
      } else if (origNorm !== modNorm && origNorm && modNorm) {
        // Character replaced
        result.push(
          <span key={i} className="bg-yellow-500/30 text-yellow-300 px-0.5 rounded">
            {modChar}
          </span>
        );
      } else {
        result.push(<span key={i}>{modChar || origChar}</span>);
      }
    } else {
      // Characters match
      result.push(<span key={i}>{modChar || origChar}</span>);
    }
  }
  
  return result;
}

// Unicode character database for common invisible/special characters
const unicodeChars: { [key: string]: { name: string; code: string } } = {
  '\u200B': { name: 'Zero Width Space', code: 'U+200B' },
  '\u200C': { name: 'Zero Width Non-Joiner', code: 'U+200C' },
  '\u200D': { name: 'Zero Width Joiner', code: 'U+200D' },
  '\uFEFF': { name: 'Zero Width No-Break Space', code: 'U+FEFF' },
  '\u202E': { name: 'Right-to-Left Override', code: 'U+202E' },
  '\u202D': { name: 'Left-to-Right Override', code: 'U+202D' },
  '\u202C': { name: 'Pop Directional Formatting', code: 'U+202C' },
  '\u200F': { name: 'Right-to-Left Mark', code: 'U+200F' },
  '\u200E': { name: 'Left-to-Right Mark', code: 'U+200E' },
  '\u00A0': { name: 'Non-Breaking Space', code: 'U+00A0' },
  '\u2000': { name: 'En Quad', code: 'U+2000' },
  '\u2001': { name: 'Em Quad', code: 'U+2001' },
  '\u2002': { name: 'En Space', code: 'U+2002' },
  '\u2003': { name: 'Em Space', code: 'U+2003' },
  '\t': { name: 'Tab', code: 'U+0009' },
  '\n': { name: 'Line Feed', code: 'U+000A' },
  '\r': { name: 'Carriage Return', code: 'U+000D' },
  ' ': { name: 'Space', code: 'U+0020' },
};

// Function to get Unicode info for a character
function getUnicodeInfo(char: string): { name: string; code: string; display: string } | null {
  if (unicodeChars[char]) {
    const info = unicodeChars[char];
    let display = char;
    
    // Special display characters
    if (char === '\u200B') display = '■';
    else if (char === '\u200C') display = '▯';
    else if (char === '\u200D') display = '▮';
    else if (char === '\uFEFF') display = '□';
    else if (char === '\u202E') display = '→';
    else if (char === '\u202D') display = '←';
    else if (char === '\u202C') display = '↔';
    else if (char === '\u200F') display = 'R';
    else if (char === '\u200E') display = 'L';
    else if (char === '\u00A0') display = '·';
    else if (char === '\u2000') display = ' ';
    else if (char === '\u2001') display = ' ';
    else if (char === '\u2002') display = ' ';
    else if (char === '\u2003') display = ' ';
    else if (char === '\t') display = '→';
    else if (char === '\n') display = '↵';
    else if (char === '\r') display = '⏎';
    else if (char === ' ') display = '·';
    
    return { ...info, display };
  }
  
  // Get Unicode for any character
  const code = char.charCodeAt(0);
  if (code < 32 || code > 126 || code === 160) {
    return {
      name: `U+${code.toString(16).toUpperCase().padStart(4, '0')}`,
      code: `U+${code.toString(16).toUpperCase().padStart(4, '0')}`,
      display: char.charCodeAt(0).toString(16).toUpperCase().padStart(4, '0')
    };
  }
  
  return null;
}

// Function to render text showing Unicode only for homoglyph changes
function renderWithUnicodeInfo(text: string, originalText?: string): React.ReactNode[] {
  const result: React.ReactNode[] = [];
  
  if (!originalText) {
    // If no original text provided, fall back to showing unusual characters
    return renderUnusualUnicode(text);
  }
  
  // Compare original and attacked text to find homoglyph changes
  const maxLen = Math.max(text.length, originalText.length);
  
  for (let i = 0; i < maxLen; i++) {
    const originalChar = i < originalText.length ? originalText[i] : null;
    const attackedChar = i < text.length ? text[i] : null;
    
    // Check if character changed (homoglyph replacement)
    const isChanged = originalChar !== null && attackedChar !== null && originalChar !== attackedChar;
    
    if (isChanged && attackedChar) {
      // Character was changed - show Unicode info for homoglyph
      const code = attackedChar.charCodeAt(0);
      const hexCode = code.toString(16).toUpperCase().padStart(4, '0');
      const info = getUnicodeInfo(attackedChar);
      
      if (info) {
        // Known special character
        result.push(
          <span
            key={i}
            className="bg-blue-500/30 text-blue-300 px-1 rounded font-mono text-xs border border-blue-500/50"
            title={`${info.name} (${info.code}) - Replaced: ${originalChar}`}
          >
            {info.display} <span className="text-blue-400/70 text-[10px]">[{info.code}]</span>
          </span>
        );
      } else {
        // Changed to homoglyph - show with Unicode code
        result.push(
          <span
            key={i}
            className="bg-yellow-500/30 text-yellow-300 px-0.5 rounded border border-yellow-500/50"
            title={`Homoglyph: U+${hexCode} (was: ${originalChar})`}
          >
            {attackedChar} <span className="text-yellow-400/70 text-[10px] font-mono">[U+{hexCode}]</span>
          </span>
        );
      }
    } else if (attackedChar) {
      // Character unchanged - show normally
      result.push(
        <span key={i}>
          {attackedChar}
        </span>
      );
    }
  }
  
  return result;
}

// Fallback function for when no original text is available
function renderUnusualUnicode(text: string): React.ReactNode[] {
  const result: React.ReactNode[] = [];
  
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const code = char.charCodeAt(0);
    const hexCode = code.toString(16).toUpperCase().padStart(4, '0');
    const info = getUnicodeInfo(char);
    
    // Check if character is unusual (not regular ASCII printable)
    const isUnusual = 
      info !== null || // Known invisible/special character
      code > 127 || // Non-ASCII
      code < 32 || // Control character
      (code >= 0x0300 && code <= 0x036F) || // Combining diacritical marks
      (code >= 0x0400 && code <= 0x04FF) || // Cyrillic (homoglyphs)
      (code >= 0x0370 && code <= 0x03FF) || // Greek (homoglyphs)
      (code >= 0x2000 && code <= 0x206F) || // General Punctuation (invisible spaces)
      (code >= 0xFE00 && code <= 0xFE0F); // Variation selectors
    
    if (info) {
      // Known special/invisible character - show with tooltip and code
      result.push(
        <span
          key={i}
          className="bg-blue-500/30 text-blue-300 px-1 rounded font-mono text-xs border border-blue-500/50"
          title={`${info.name} (${info.code})`}
        >
          {info.display} <span className="text-blue-400/70 text-[10px]">[{info.code}]</span>
        </span>
      );
    } else if (isUnusual) {
      // Unusual character - show with Unicode code
      result.push(
        <span
          key={i}
          className="bg-purple-500/20 text-purple-300 px-0.5 rounded border border-purple-500/30"
          title={`Unicode: U+${hexCode} - Character: ${char}`}
        >
          {char} <span className="text-purple-400/70 text-[10px] font-mono">[U+{hexCode}]</span>
        </span>
      );
    } else {
      // Regular ASCII printable - show normally without Unicode code
      result.push(
        <span key={i}>
          {char}
        </span>
      );
    }
  }
  
  return result;
}

export default function TextPanel({ 
  title, value, onValueChange, readOnly = false, metrics, isLoading = false, originalText, placeholder
}: TextPanelProps) {
  const [copied, setCopied] = useState(false);
  const [showInvisible, setShowInvisible] = useState(false);
  const [highlightDiff, setHighlightDiff] = useState(false);
  const [showUnicodeDetails, setShowUnicodeDetails] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const displayText = showInvisible 
    ? value.replace(/[\u200B-\u200D\uFEFF]/g, '■')
    : value;

  // Generate highlighted differences if enabled
  const highlightedContent = highlightDiff && originalText && readOnly
    ? highlightDifferences(originalText, value)
    : null;

  // Generate Unicode-detailed view if enabled (only show changes for homoglyphs)
  const unicodeContent = showUnicodeDetails && readOnly
    ? renderWithUnicodeInfo(value, originalText)
    : null;

  return (
    <div className="gradient-border rounded-xl h-full flex flex-col">
      <div className="bg-slate-900 rounded-xl p-1 flex-1 flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
          <div className="flex items-center space-x-3">
            <h3 className="text-lg font-semibold text-slate-200">{title}</h3>
            {metrics && (
              <div className="flex space-x-2">
                <Badge variant="secondary" className="font-mono text-xs bg-slate-800/50 text-slate-300 border-slate-700">
                  {metrics.characters} chars
                </Badge>
                <Badge variant="secondary" className="font-mono text-xs bg-slate-800/50 text-slate-300 border-slate-700">
                  {metrics.words} words
                </Badge>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            {readOnly && (
              <>
                {originalText && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setHighlightDiff(!highlightDiff);
                      setShowUnicodeDetails(false);
                      setShowInvisible(false);
                    }}
                    className={highlightDiff ? "text-emerald-400 hover:text-emerald-300" : "text-slate-400 hover:text-slate-200"}
                    title={highlightDiff ? "Hide difference highlighting" : "Highlight differences from original text"}
                  >
                    <Diff className="w-4 h-4" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowUnicodeDetails(!showUnicodeDetails);
                    setHighlightDiff(false);
                    setShowInvisible(false);
                  }}
                  className={showUnicodeDetails ? "text-purple-400 hover:text-purple-300" : "text-slate-400 hover:text-slate-200"}
                  title={showUnicodeDetails ? "Hide Unicode details" : "Show all Unicode characters with codes (invisible chars, whitespace, special chars)"}
                >
                  <Search className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowInvisible(!showInvisible);
                    setHighlightDiff(false);
                    setShowUnicodeDetails(false);
                  }}
                  className={showInvisible ? "text-blue-400 hover:text-blue-300" : "text-slate-400 hover:text-slate-200"}
                  title={showInvisible ? "Hide invisible characters" : "Show invisible characters as symbols"}
                >
                  {showInvisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="text-slate-400 hover:text-slate-200"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Text Area */}
        <div className="flex-1 p-4 overflow-hidden">
          {isLoading ? (
            <div className="space-y-2 h-full">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-4 bg-slate-700/50 rounded animate-pulse" />
              ))}
            </div>
          ) : highlightedContent ? (
            <div className="w-full h-full min-h-[300px] font-mono text-sm bg-slate-800/50 border border-slate-700 rounded-md p-3 text-slate-200 overflow-auto whitespace-pre-wrap break-words">
              {highlightedContent}
            </div>
          ) : unicodeContent ? (
            <div className="w-full h-full min-h-[300px] font-mono text-sm bg-slate-800/50 border border-slate-700 rounded-md p-3 text-slate-200 overflow-auto whitespace-pre-wrap break-words leading-relaxed">
              {unicodeContent}
            </div>
          ) : (
            <Textarea
              value={displayText}
              onChange={(e) => onValueChange?.(e.target.value)}
              readOnly={readOnly}
              className="w-full h-full min-h-[300px] font-mono text-sm bg-slate-800/50 border-slate-700 text-slate-200 resize-none focus-visible:ring-emerald-500/20"
              placeholder={readOnly ? "Attack results will appear here..." : placeholder || "Enter text to attack..."}
            />
          )}
        </div>
      </div>
    </div>
  );
}

