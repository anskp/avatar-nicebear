
import React, { useState, useEffect, useCallback } from 'react';
import { createAvatar } from '@dicebear/core';
import { adventurer } from '@dicebear/collection';
import type { Options } from '@dicebear/core';
import type { DiceBearOptions } from './types';
import {
  BACKGROUND_COLOR_OPTIONS,
  BACKGROUND_TYPE_OPTIONS,
  EARRINGS_OPTIONS,
  EYEBROWS_OPTIONS,
  EYES_OPTIONS,
  FEATURES_OPTIONS,
  GLASSES_OPTIONS,
  HAIR_COLOR_OPTIONS,
  HAIR_OPTIONS,
  MOUTH_OPTIONS,
  SKIN_COLOR_OPTIONS,
} from './constants';
import AvatarPreview from './components/AvatarPreview';
import TraitSelector from './components/TraitSelector';
import ColorPicker from './components/ColorPicker';
import IconButton from './components/IconButton';
import { DownloadIcon, RefreshCwIcon, ClipboardIcon } from './components/Icons';

const initialOptions: DiceBearOptions = {
  seed: 'Felix',
  flip: false,
  backgroundColor: ['b6e3f4'],
  backgroundType: ['gradientLinear'],
  earrings: ['variant01'],
  eyebrows: ['variant01'],
  eyes: ['variant01'],
  features: ['mustache'],
  glasses: ['variant01'],
  hair: ['short01'],
  hairColor: ['0e0e0e'],
  mouth: ['variant01'],
  skinColor: ['ecad80'],
};

const App: React.FC = () => {
  const [options, setOptions] = useState<DiceBearOptions>(initialOptions);
  const [svg, setSvg] = useState<string>('');
  const [base64, setBase64] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const avatar = createAvatar(adventurer, options as Options);
      const svgString = avatar.toString();
      setSvg(svgString);

      // FIX: Unicode-safe Base64 encoding
      // The `btoa` function fails on strings with characters outside of the Latin-1 range.
      // To fix this, we first encode the string to a UTF-8 compatible format.
      const base64String = btoa(unescape(encodeURIComponent(svgString)));
      setBase64(`data:image/svg+xml;base64,${base64String}`);
      setError(null);
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
        console.error("Failed to generate avatar:", errorMessage);
        setError(`Failed to generate avatar: ${errorMessage}`);
        setSvg(`<svg viewBox="0 0 200 100" xmlns="http://www.w3.org/2000/svg"><text y="45" x="50%" text-anchor="middle" fill="#EF4444" font-size="10" font-family="sans-serif">Error</text><text y="65" x="50%" text-anchor="middle" fill="#A0AEC0" font-size="6" font-family="sans-serif">${errorMessage}</text></svg>`);
        setBase64('');
    }
  }, [options]);

  const handleOptionChange = useCallback(<K extends keyof DiceBearOptions>(
    key: K,
    value: DiceBearOptions[K]
  ) => {
    setOptions((prev) => ({ ...prev, [key]: value }));
  }, []);

  const getRandomOption = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

  const handleRandomize = useCallback(() => {
    setOptions({
      seed: Math.random().toString(36).substring(7),
      flip: Math.random() < 0.5,
      backgroundColor: [getRandomOption(BACKGROUND_COLOR_OPTIONS)],
      backgroundType: [getRandomOption(BACKGROUND_TYPE_OPTIONS)],
      earrings: [getRandomOption(EARRINGS_OPTIONS.filter(o => o !== 'none'))],
      eyebrows: [getRandomOption(EYEBROWS_OPTIONS)],
      eyes: [getRandomOption(EYES_OPTIONS)],
      features: [getRandomOption(FEATURES_OPTIONS.filter(o => o !== 'none'))],
      glasses: [getRandomOption(GLASSES_OPTIONS.filter(o => o !== 'none'))],
      hair: [getRandomOption(HAIR_OPTIONS)],
      hairColor: [getRandomOption(HAIR_COLOR_OPTIONS)],
      mouth: [getRandomOption(MOUTH_OPTIONS)],
      skinColor: [getRandomOption(SKIN_COLOR_OPTIONS)],
    });
  }, []);

  const handleDownloadSVG = useCallback(() => {
    if (error) return;
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${options.seed || 'avatar'}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [svg, options.seed, error]);

  const handleCopyBase64 = useCallback(() => {
    if (error) return;
    navigator.clipboard.writeText(base64).then(() => {
      alert('Base64 data URI copied to clipboard!');
    }, (err) => {
      console.error('Could not copy text: ', err);
    });
  }, [base64, error]);

  return (
    <div className="min-h-screen bg-brand-primary text-brand-text p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto max-w-7xl">
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-brand-accent tracking-wider">
            SVG Character Customizer
          </h1>
          <p className="text-brand-subtle mt-2">
            Create your unique adventurer avatar with DiceBear.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <AvatarPreview svg={svg} />
            {error && <p className="text-center text-red-400 mt-4">{error}</p>}
            <div className="mt-6 flex items-center justify-center gap-4">
              <IconButton onClick={handleRandomize} label="Randomize">
                <RefreshCwIcon />
              </IconButton>
              <IconButton onClick={handleDownloadSVG} label="Download SVG" disabled={!!error}>
                <DownloadIcon />
              </IconButton>
              <IconButton onClick={handleCopyBase64} label="Copy Base64" disabled={!!error}>
                <ClipboardIcon />
              </IconButton>
            </div>
          </div>

          <aside className="bg-brand-secondary p-6 rounded-lg shadow-2xl h-[70vh] overflow-y-auto">
            <h2 className="text-2xl font-semibold mb-6 border-b-2 border-brand-accent/30 pb-3">Customize Traits</h2>
            <div className="space-y-6">
              <TraitSelector
                label="Eyes"
                value={options.eyes?.[0] || ''}
                options={EYES_OPTIONS}
                onChange={(v) => handleOptionChange('eyes', [v])}
              />
              <TraitSelector
                label="Hair"
                value={options.hair?.[0] || ''}
                options={HAIR_OPTIONS}
                onChange={(v) => handleOptionChange('hair', [v])}
              />
              <ColorPicker
                label="Hair Color"
                value={options.hairColor?.[0] || ''}
                colors={HAIR_COLOR_OPTIONS}
                onChange={(v) => handleOptionChange('hairColor', [v])}
              />
              <TraitSelector
                label="Mouth"
                value={options.mouth?.[0] || ''}
                options={MOUTH_OPTIONS}
                onChange={(v) => handleOptionChange('mouth', [v])}
              />
              <TraitSelector
                label="Eyebrows"
                value={options.eyebrows?.[0] || ''}
                options={EYEBROWS_OPTIONS}
                onChange={(v) => handleOptionChange('eyebrows', [v])}
              />
              <ColorPicker
                label="Skin Color"
                value={options.skinColor?.[0] || ''}
                colors={SKIN_COLOR_OPTIONS}
                onChange={(v) => handleOptionChange('skinColor', [v])}
              />
               <TraitSelector
                label="Features"
                value={options.features?.[0] || 'none'}
                options={FEATURES_OPTIONS}
                onChange={(v) => handleOptionChange('features', v === 'none' ? [] : [v])}
              />
               <TraitSelector
                label="Glasses"
                value={options.glasses?.[0] || 'none'}
                options={GLASSES_OPTIONS}
                onChange={(v) => handleOptionChange('glasses', v === 'none' ? [] : [v])}
              />
               <TraitSelector
                label="Earrings"
                value={options.earrings?.[0] || 'none'}
                options={EARRINGS_OPTIONS}
                onChange={(v) => handleOptionChange('earrings', v === 'none' ? [] : [v])}
              />
              <TraitSelector
                label="Background Type"
                value={options.backgroundType?.[0] || ''}
                options={BACKGROUND_TYPE_OPTIONS}
                onChange={(v) => handleOptionChange('backgroundType', [v])}
              />
              <ColorPicker
                label="Background Color"
                value={options.backgroundColor?.[0] || ''}
                colors={BACKGROUND_COLOR_OPTIONS}
                onChange={(v) => handleOptionChange('backgroundColor', [v])}
              />
              <div className="flex items-center justify-between bg-gray-800/20 p-3 rounded-md">
                <label className="font-medium text-brand-subtle">Flip Avatar</label>
                <button
                  onClick={() => handleOptionChange('flip', !options.flip)}
                  className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${
                    options.flip ? 'bg-brand-accent' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                      options.flip ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default App;
