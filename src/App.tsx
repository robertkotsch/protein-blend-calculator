import React, { useState } from 'react';
import {
  Activity,
  Box,
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  FlaskConical,
  Check,
  RotateCcw,
} from 'lucide-react';

interface Ingredient {
  name: string;
  ratio: number;
  color: string;
  recommended: string;
  benefit: string;
  category: string;
}

const App = () => {
  const [batchSize, setBatchSize] = useState(1200);
  const [dailyDose, setDailyDose] = useState(70);
  const [expandedIngredient, setExpandedIngredient] = useState<number | null>(null);
  const [checkedIngredients, setCheckedIngredients] = useState<Record<number, boolean>>({});

  const maxBatch = 2000;
  const maxDose = 150;

  // Logical Thresholds
  const optimalMin = 60;
  const optimalMax = 85;

  // Powder Density Constant (Approx 420g per Liter for plant protein blends)
  const POWDER_DENSITY = 420;

  // Exact Colors from User Images
  const colors = {
    below: '#E9E2D1', // Light Tan
    optimum: '#353432', // Deep Charcoal
    high: '#D1D9E0', // Light Blue/Grey
  };

  const p1 = (optimalMin / maxDose) * 100;
  const p2 = (optimalMax / maxDose) * 100;

  const trackGradient = `linear-gradient(to right, ${colors.below} 0%, ${colors.below} ${p1}%, ${colors.optimum} ${p1}%, ${colors.optimum} ${p2}%, ${colors.high} ${p2}%, ${colors.high} 100%)`;

  const thumbStyles = `
    appearance-none
    cursor-pointer
    bg-transparent
    z-20
    relative
    w-full
    [&::-webkit-slider-runnable-track]:h-2.5
    [&::-webkit-slider-runnable-track]:rounded-full
    [&::-webkit-slider-runnable-track]:bg-transparent
    [&::-webkit-slider-thumb]:appearance-none
    [&::-webkit-slider-thumb]:w-10
    [&::-webkit-slider-thumb]:h-10
    [&::-webkit-slider-thumb]:rounded-full
    [&::-webkit-slider-thumb]:bg-white
    [&::-webkit-slider-thumb]:shadow-[0_4px_12px_rgba(0,0,0,0.15)]
    [&::-webkit-slider-thumb]:-mt-[15px]
    [&::-webkit-slider-thumb]:border-none
    [&::-webkit-slider-thumb]:transition-transform
    [&::-webkit-slider-thumb]:active:scale-95
    [&::-moz-range-track]:h-2.5
    [&::-moz-range-track]:rounded-full
    [&::-moz-range-track]:bg-transparent
    [&::-moz-range-thumb]:w-10
    [&::-moz-range-thumb]:h-10
    [&::-moz-range-thumb]:rounded-full
    [&::-moz-range-thumb]:bg-white
    [&::-moz-range-thumb]:shadow-lg
    [&::-moz-range-thumb]:border-none
  `;

  const ingredients: Ingredient[] = [
    { name: 'Lupine protein (bio)', ratio: 18.03, color: '#E5D193', recommended: '35-45g', benefit: 'High in arginine for vascular health.', category: 'Protein' },
    { name: 'Rice protein 82% (bio)', ratio: 18.03, color: '#F6F4EF', recommended: '35-45g', benefit: 'Hypoallergenic; provides methionine.', category: 'Protein' },
    { name: 'Pea protein (bio)', ratio: 18.03, color: '#E3D6B0', recommended: '35-45g', benefit: 'Rich in Leucine for muscle synthesis.', category: 'Protein' },
    { name: 'Hemp protein (bio)', ratio: 18.03, color: '#919881', recommended: '35-45g', benefit: 'Omega fatty acids support heart health.', category: 'Protein' },
    { name: 'Fenugreek (sprouted)', ratio: 7.21, color: '#BCA27E', recommended: '3.0-5.0g', benefit: 'Supports testosterone and metabolism.', category: 'Performance' },
    { name: 'MSM', ratio: 4.51, color: '#FFFFFF', recommended: '2.5-4.5g', benefit: 'Sulfur for cartilage repair.', category: 'Joints' },
    { name: 'Ashwagandha (bio)', ratio: 4.51, color: '#D2C5B3', recommended: '3.0-6.0g', benefit: 'Cortisol management and recovery.', category: 'Recovery' },
    { name: 'Maca powder (bio)', ratio: 4.51, color: '#E0D1B8', recommended: '2.0-4.0g', benefit: 'Adaptogenic energy and stamina.', category: 'Performance' },
    { name: 'Rosehip powder (bio)', ratio: 4.51, color: '#C78F3B', recommended: '3.0-5.0g', benefit: 'High Vitamin C and joint protection.', category: 'Joints' },
    { name: 'Kelp powder (bio)', ratio: 0.9, color: '#5E5B37', recommended: '0.5-1.0g', benefit: 'Iodine for thyroid health.', category: 'Wellness' },
  ];

  const totalParts = ingredients.reduce((acc, curr) => acc + curr.ratio, 0);

  const toggleCheck = (e: React.MouseEvent, index: number) => {
    e.stopPropagation(); // Prevent row expansion when clicking checkmark
    setCheckedIngredients((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const resetChecks = () => {
    setCheckedIngredients({});
  };

  const getDoseStatus = () => {
    if (dailyDose < optimalMin)
      return { label: 'Below', textColor: 'text-stone-700', hex: colors.below, icon: <AlertTriangle className="w-4 h-4" /> };
    if (dailyDose > optimalMax)
      return { label: 'High', textColor: 'text-stone-700', hex: colors.high, icon: <AlertCircle className="w-4 h-4" /> };
    return { label: 'OPTIMUM', textColor: 'text-white', hex: colors.optimum, icon: <CheckCircle2 className="w-4 h-4" /> };
  };

  const status = getDoseStatus();
  const supplyDays = (batchSize / dailyDose).toFixed(1);
  const [daysInt, daysDec] = supplyDays.split('.');

  // Calculate Liter equivalent
  const batchLiters = (batchSize / POWDER_DENSITY).toFixed(1);

  return (
    <div className="min-h-screen bg-[#F4F2EE] p-3 md:p-8 font-sans text-stone-900 overflow-x-hidden">
      <div className="max-w-xl mx-auto space-y-4 pb-12">
        {/* Header */}
        <div className="bg-[#353432] rounded-2xl p-6 text-white shadow-xl">
          <div className="flex items-center gap-3 mb-1">
            <FlaskConical className="w-7 h-7 text-stone-400" />
            <h1 className="text-2xl font-black tracking-tight uppercase">Performance Blend</h1>
          </div>
          <p className="text-[10px] font-bold tracking-[0.2em] opacity-60">ACTIVE PROFILE • 50Y MALE</p>
        </div>

        {/* Batch Weight Section */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200">
          <div className="flex justify-between items-start mb-4">
            <div>
              <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1 block">Batch Weight</label>
              <div className="flex items-baseline gap-4">
                {/* Grams Display */}
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-black text-stone-900 leading-none">{batchSize}</span>
                  <span className="text-xl font-bold text-stone-300">g</span>
                </div>

                {/* Visual Separator */}
                <div className="h-8 w-[2px] bg-stone-100 mx-1"></div>

                {/* Liters Display */}
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl font-black text-stone-600 leading-none">{batchLiters}</span>
                  <span className="text-[11px] font-black text-stone-400 uppercase tracking-widest">Liters</span>
                </div>
              </div>
            </div>
            <Box className="w-6 h-6 text-stone-100" />
          </div>

          <div className="relative h-12 flex items-center mb-4">
            <div className="absolute top-1/2 left-1 right-1 h-2 bg-[#D8D3C4] -translate-y-1/2 rounded-full z-0 shadow-[inset_0_1px_3px_rgba(0,0,0,0.1)] border border-stone-200/50"></div>

            <input
              type="range"
              min="100"
              max={maxBatch}
              step="5"
              value={batchSize}
              onChange={(e) => setBatchSize(Number(e.target.value))}
              className={`w-full h-10 appearance-none outline-none relative z-10 ${thumbStyles}`}
              style={{ background: 'transparent' }}
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            {[500, 1000, 1200, 1600].map((val) => (
              <button
                key={val}
                onClick={() => setBatchSize(val)}
                className={`py-3 px-2 rounded-xl text-[10px] font-black transition-all border ${batchSize === val ? 'bg-stone-800 border-stone-800 text-white shadow-md' : 'bg-stone-50 border-stone-100 text-stone-400'}`}
              >
                {val === 1200 ? 'ORIGINAL RECIPE' : `${val}g BATCH`}
              </button>
            ))}
          </div>
        </div>

        {/* Daily Intake Dose Section */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-stone-200 overflow-visible">
          <div className="flex justify-between items-start mb-10">
            <div className="flex flex-col">
              <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2">Daily Intake Dose</label>
              <div className="flex items-baseline gap-1">
                <span className="text-6xl font-black text-stone-900 leading-none">{dailyDose}</span>
                <span className="text-xl font-bold text-stone-300">g</span>
              </div>
            </div>
            <div
              className={`flex items-center gap-2.5 px-5 py-2.5 rounded-full transition-all duration-300 shadow-lg ${status.textColor}`}
              style={{ backgroundColor: status.hex }}
            >
              <div className={`rounded-full p-1 ${dailyDose >= optimalMin && dailyDose <= optimalMax ? 'bg-[#1A1918]' : 'bg-white/30'}`}>
                {React.cloneElement(status.icon, { className: 'w-3.5 h-3.5' })}
              </div>
              <span className="text-[12px] font-black uppercase tracking-[0.1em]">{status.label}</span>
            </div>
          </div>

          <div className="space-y-10">
            <div className="relative h-4 flex items-center px-1">
              <div
                className="absolute left-1 right-1 h-2.5 rounded-full shadow-[inset_0_1px_2px_rgba(0,0,0,0.15)]"
                style={{ background: trackGradient }}
              />

              <input
                type="range"
                min="0"
                max={maxDose}
                step="1"
                value={dailyDose}
                onChange={(e) => setDailyDose(Number(e.target.value))}
                className={`w-full h-10 appearance-none outline-none relative z-10 ${thumbStyles}`}
                style={{ background: 'transparent' }}
              />
            </div>

            <div className="flex justify-between items-center text-[11px] font-black text-stone-300 uppercase px-1">
              <span>Minimum</span>
              <div className="bg-[#FAF9F6] px-5 py-2 rounded-full border border-stone-100 text-stone-900 tracking-tight shadow-sm">
                Anabolic Target Zone: {optimalMin}-{optimalMax}g
              </div>
              <span>Saturation</span>
            </div>
          </div>
        </div>

        {/* Matrix Section with Checkmarks */}
        <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
          <div className="px-6 py-4 bg-stone-50 border-b border-stone-100 flex justify-between items-center">
            <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Ingredient Matrix</span>
            <button
              onClick={resetChecks}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md hover:bg-stone-200 transition-colors group"
            >
              <RotateCcw className="w-3 h-3 text-stone-400 group-hover:text-stone-600" />
              <span className="text-[9px] font-black uppercase text-stone-400 group-hover:text-stone-600 tracking-wider">Reset Checklist</span>
            </button>
          </div>
          <div className="divide-y divide-stone-50">
            {ingredients.map((ing, idx) => {
              const batchWeight = (batchSize * (ing.ratio / totalParts)).toFixed(1);
              const isExpanded = expandedIngredient === idx;
              const isChecked = checkedIngredients[idx];

              return (
                <div key={idx} className={`transition-all ${isChecked ? 'bg-stone-50/40 opacity-60' : ''}`}>
                  <div className="flex items-center">
                    {/* Interactive Checkmark Area */}
                    <button onClick={(e) => toggleCheck(e, idx)} className="pl-5 pr-2 py-5 group">
                      <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${isChecked ? 'bg-[#353432] border-[#353432]' : 'border-stone-200 bg-white group-hover:border-stone-400'}`}>
                        {isChecked && <Check className="w-4 h-4 text-white" />}
                      </div>
                    </button>

                    <button
                      onClick={() => setExpandedIngredient(isExpanded ? null : idx)}
                      className="flex-1 pr-5 py-5 flex justify-between items-center transition-colors active:bg-stone-50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full border border-stone-100 shadow-inner" style={{ backgroundColor: ing.color }} />
                        <div className="text-left">
                          <div className={`text-stone-800 font-bold text-sm leading-tight ${isChecked ? 'line-through text-stone-400' : ''}`}>{ing.name}</div>
                          <div className="text-[9px] font-bold uppercase text-stone-400 tracking-tighter">{ing.category}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[9px] font-black text-stone-300 uppercase">Batch</div>
                        <div className="text-lg font-black text-stone-900 leading-none">{batchWeight}g</div>
                      </div>
                    </button>
                  </div>
                  {isExpanded && (
                    <div className="px-6 pb-6 pt-0 ml-8">
                      <div className="rounded-xl p-4 bg-[#F9F8F6] text-[11px] text-stone-500 leading-relaxed border border-stone-100">
                        <span className="text-stone-800 font-bold uppercase text-[9px] block mb-1">Target Benefit:</span>
                        {ing.benefit} • Clinical: {ing.recommended}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Cycle Logistics Section */}
        <div className="bg-[#252422] rounded-2xl p-8 text-stone-300 shadow-2xl space-y-8 border-t border-white/5">
          <div className="flex justify-between items-center opacity-30">
            <p className="font-black uppercase tracking-[0.2em] text-[10px]">Supply Logistics</p>
            <Activity className="w-4 h-4" />
          </div>

          <div className="flex justify-center gap-6 items-end">
            <div className="relative">
              <div className="w-36 h-44 bg-[#121110] rounded-2xl border-[8px] border-[#1A1918] shadow-[0_25px_60px_rgba(0,0,0,0.6)] flex flex-col relative overflow-hidden">
                <div className="h-1/2 w-full bg-[#1E1D1B] border-b-[2px] border-black/50"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[100px] font-black text-white tracking-tighter tabular-nums leading-none">{daysInt}</span>
                </div>
                <span className="absolute bottom-4 right-5 text-[14px] font-black text-white/20 uppercase">day</span>
                <div className="absolute top-1/2 left-0 right-0 h-[4px] bg-black/70 z-10 -translate-y-1/2"></div>
              </div>
            </div>

            <div className="text-6xl font-black text-[#1A1918] mb-8 select-none">.</div>

            <div className="relative">
              <div className="w-28 h-36 bg-[#121110] rounded-xl border-[8px] border-[#1A1918] shadow-2xl flex flex-col relative overflow-hidden">
                <div className="h-1/2 w-full bg-[#1E1D1B] border-b-[2px] border-black/50"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-5xl font-black text-stone-500 tabular-nums">{daysDec}</span>
                </div>
                <span className="absolute bottom-3 right-4 text-[10px] font-black text-white/10 uppercase">part</span>
                <div className="absolute top-1/2 left-0 right-0 h-[3px] bg-black/70 z-10 -translate-y-1/2"></div>
              </div>
            </div>
          </div>

          <p className="text-[10px] text-center text-stone-600 font-bold uppercase tracking-[0.3em] opacity-50">
            Exhaustion Phase Analytics
          </p>
        </div>
      </div>
    </div>
  );
};

export default App;
