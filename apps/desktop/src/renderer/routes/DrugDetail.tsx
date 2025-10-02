import { useState } from 'react';
import { ChevronLeft, Plus, Pill, AlertCircle, Info, Zap } from 'lucide-react';

interface Drug {
  id: string;
  genericName: string;
  brandNames: string[];
  classification: string[];
  mechanismOfAction: string;
  indications: string[];
  contraindications: string[];
  sideEffects: string[];
  interactions: string[];
  clinicalPearls: string[];
}

// Mock drug data
const mockDrug: Drug = {
  id: 'lisinopril',
  genericName: 'Lisinopril',
  brandNames: ['Prinivil', 'Zestril'],
  classification: ['ACE Inhibitor', 'Antihypertensive'],
  mechanismOfAction:
    'Blocks angiotensin-converting enzyme (ACE), preventing conversion of angiotensin I to angiotensin II. This results in decreased vasoconstriction, reduced aldosterone secretion, and decreased sodium and water retention.',
  indications: [
    'Hypertension',
    'Heart failure with reduced ejection fraction',
    'Post-myocardial infarction',
    'Diabetic nephropathy',
  ],
  contraindications: [
    'Hypersensitivity to ACE inhibitors',
    'Angioedema (history of)',
    'Pregnancy',
    'Bilateral renal artery stenosis',
  ],
  sideEffects: [
    'Dry cough (10-15%)',
    'Hyperkalemia',
    'Angioedema (rare but serious)',
    'Hypotension',
    'Acute kidney injury',
    'Fatigue',
    'Dizziness',
  ],
  interactions: [
    'Potassium supplements/salt substitutes → hyperkalemia',
    'NSAIDs → reduced efficacy, kidney injury',
    'Lithium → increased lithium levels',
    'Diuretics → excessive hypotension',
  ],
  clinicalPearls: [
    'Start low, go slow - especially in elderly or volume depleted patients',
    'Check kidney function and potassium 1-2 weeks after initiation',
    'Cough is dose-independent and may take weeks to resolve after discontinuation',
    'Consider ARB if cough develops but ACE inhibition still needed',
  ],
};

export function DrugDetail() {
  const [drug] = useState(mockDrug);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateCards = async () => {
    setIsGenerating(true);

    // Simulate card generation
    const generatedCards = [
      {
        front: `What is the mechanism of action of ${drug.genericName}?`,
        back: drug.mechanismOfAction,
      },
      {
        front: `List the main indications for ${drug.genericName}`,
        back: drug.indications.join('\n• '),
      },
      {
        front: `What are the key contraindications for ${drug.genericName}?`,
        back: drug.contraindications.join('\n• '),
      },
      {
        front: `Name the most common side effects of ${drug.genericName}`,
        back: drug.sideEffects.slice(0, 4).join('\n• '),
      },
      {
        front: `What are important clinical pearls for ${drug.genericName}?`,
        back: drug.clinicalPearls.slice(0, 2).join('\n\n'),
      },
    ];

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // TODO: Add cards to study queue and persist to IndexedDB
    console.log('Generated cards:', generatedCards);

    // TODO: Show success toast
    console.log(`Generated ${generatedCards.length} cards for ${drug.genericName}`);

    setIsGenerating(false);
  };

  return (
    <div className='max-w-6xl mx-auto space-y-8'>
      {/* Header */}
      <div className='glass-dark rounded-2xl p-6'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-4'>
            <button
              onClick={() => window.history.back()}
              className='glass p-2 rounded-xl hover:scale-105 transition-all duration-300'
              aria-label='Go back'
            >
              <ChevronLeft className='h-5 w-5 text-white' />
            </button>
            <div>
              <h1 className='text-3xl font-bold text-white'>{drug.genericName}</h1>
              <div className='flex items-center gap-2 mt-2'>
                {drug.brandNames.map((brand, index) => (
                  <span key={index} className='text-white/70 text-sm bg-white/10 px-2 py-1 rounded'>
                    {brand}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={generateCards}
            disabled={isGenerating}
            className='glass-emerald px-6 py-3 rounded-2xl font-semibold text-white hover:scale-105 transition-all duration-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed'
            aria-label='Generate study cards from this drug information'
          >
            <Plus className='h-5 w-5' />
            {isGenerating ? 'Generating...' : 'Generate Cards'}
          </button>
        </div>

        <div className='flex flex-wrap gap-2 mt-4'>
          {drug.classification.map((cls, index) => (
            <span
              key={index}
              className='bg-purple-500/20 text-purple-200 px-3 py-1 rounded-full text-sm border border-purple-400/30'
            >
              {cls}
            </span>
          ))}
        </div>
      </div>

      {/* Drug Information Grid */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
        {/* Mechanism of Action */}
        <div className='glass-purple rounded-3xl p-8'>
          <div className='flex items-center gap-3 mb-6'>
            <div className='p-3 bg-purple-500 rounded-xl'>
              <Zap className='h-6 w-6 text-white' />
            </div>
            <h2 className='text-2xl font-bold text-white'>Mechanism of Action</h2>
          </div>
          <p className='text-white/90 leading-relaxed'>{drug.mechanismOfAction}</p>
        </div>

        {/* Indications */}
        <div className='glass-emerald rounded-3xl p-8'>
          <div className='flex items-center gap-3 mb-6'>
            <div className='p-3 bg-emerald-500 rounded-xl'>
              <Pill className='h-6 w-6 text-white' />
            </div>
            <h2 className='text-2xl font-bold text-white'>Indications</h2>
          </div>
          <ul className='space-y-3'>
            {drug.indications.map((indication, index) => (
              <li key={index} className='text-white/90 flex items-start gap-3'>
                <div className='w-2 h-2 bg-emerald-400 rounded-full mt-2 flex-shrink-0' />
                {indication}
              </li>
            ))}
          </ul>
        </div>

        {/* Side Effects */}
        <div className='glass-rose rounded-3xl p-8'>
          <div className='flex items-center gap-3 mb-6'>
            <div className='p-3 bg-rose-500 rounded-xl'>
              <AlertCircle className='h-6 w-6 text-white' />
            </div>
            <h2 className='text-2xl font-bold text-white'>Side Effects</h2>
          </div>
          <div className='grid grid-cols-1 gap-3'>
            {drug.sideEffects.map((effect, index) => (
              <div key={index} className='text-white/90 flex items-start gap-3'>
                <div className='w-2 h-2 bg-rose-400 rounded-full mt-2 flex-shrink-0' />
                {effect}
              </div>
            ))}
          </div>
        </div>

        {/* Contraindications */}
        <div className='glass-cyan rounded-3xl p-8'>
          <div className='flex items-center gap-3 mb-6'>
            <div className='p-3 bg-red-500 rounded-xl'>
              <AlertCircle className='h-6 w-6 text-white' />
            </div>
            <h2 className='text-2xl font-bold text-white'>Contraindications</h2>
          </div>
          <ul className='space-y-3'>
            {drug.contraindications.map((contraindication, index) => (
              <li key={index} className='text-white/90 flex items-start gap-3'>
                <div className='w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0' />
                {contraindication}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Drug Interactions & Clinical Pearls */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
        {/* Drug Interactions */}
        <div className='glass-dark rounded-3xl p-8'>
          <div className='flex items-center gap-3 mb-6'>
            <div className='p-3 bg-amber-500 rounded-xl'>
              <AlertCircle className='h-6 w-6 text-white' />
            </div>
            <h2 className='text-2xl font-bold text-white'>Drug Interactions</h2>
          </div>
          <div className='space-y-4'>
            {drug.interactions.map((interaction, index) => (
              <div key={index} className='glass rounded-2xl p-4'>
                <p className='text-white/90'>{interaction}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Clinical Pearls */}
        <div className='glass-strong rounded-3xl p-8'>
          <div className='flex items-center gap-3 mb-6'>
            <div className='p-3 bg-blue-500 rounded-xl'>
              <Info className='h-6 w-6 text-white' />
            </div>
            <h2 className='text-2xl font-bold text-white'>Clinical Pearls</h2>
          </div>
          <div className='space-y-4'>
            {drug.clinicalPearls.map((pearl, index) => (
              <div key={index} className='glass rounded-2xl p-4 border-l-4 border-blue-400'>
                <p className='text-white/90 font-medium'>{pearl}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
