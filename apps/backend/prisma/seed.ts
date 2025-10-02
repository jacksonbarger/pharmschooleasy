import { prisma } from '../src/lib/db';

const top200Drugs = [
  // Cardiovascular
  { front: 'Lisinopril — Drug class?', back: 'ACE inhibitor (Angiotensin-Converting Enzyme inhibitor)' },
  { front: 'Atorvastatin — Primary mechanism?', back: 'HMG-CoA reductase inhibitor (statin) — reduces cholesterol synthesis' },
  { front: 'Metoprolol — Drug class and selectivity?', back: 'Beta-1 selective adrenergic blocker (cardioselective)' },
  { front: 'Amlodipine — Mechanism of action?', back: 'Calcium channel blocker (dihydropyridine) — vasodilation' },
  { front: 'Losartan — Drug class?', back: 'Angiotensin II receptor blocker (ARB)' },

  // Diabetes
  { front: 'Metformin — Mechanism of action?', back: 'Biguanide — decreases hepatic glucose production, increases insulin sensitivity' },
  { front: 'Glipizide — Drug class?', back: 'Sulfonylurea — stimulates insulin release from pancreatic beta cells' },
  { front: 'Insulin glargine — Type and duration?', back: 'Long-acting insulin analog — 24-hour duration' },
  { front: 'Sitagliptin — Mechanism?', back: 'DPP-4 inhibitor — increases incretin levels, glucose-dependent insulin release' },

  // Antibiotics
  { front: 'Amoxicillin — Drug class and spectrum?', back: 'Beta-lactam antibiotic (penicillin) — broad-spectrum against gram-positive and some gram-negative' },
  { front: 'Azithromycin — Drug class?', back: 'Macrolide antibiotic — inhibits bacterial protein synthesis' },
  { front: 'Ciprofloxacin — Drug class?', back: 'Fluoroquinolone — inhibits bacterial DNA gyrase and topoisomerase IV' },
  { front: 'Cephalexin — Generation and spectrum?', back: 'First-generation cephalosporin — primarily gram-positive coverage' },

  // CNS
  { front: 'Sertraline — Drug class?', back: 'Selective serotonin reuptake inhibitor (SSRI)' },
  { front: 'Alprazolam — Drug class and controlled substance schedule?', back: 'Benzodiazepine — Schedule IV controlled substance' },
  { front: 'Gabapentin — Primary uses?', back: 'Anticonvulsant — neuropathic pain, seizures, off-label anxiety' },
  { front: 'Tramadol — Mechanism and scheduling?', back: 'Atypical opioid analgesic — Schedule IV, dual mechanism (opioid + monoamine reuptake inhibition)' },

  // Respiratory
  { front: 'Albuterol — Drug class and receptor?', back: 'Short-acting beta-2 agonist (SABA) — bronchodilator' },
  { front: 'Montelukast — Mechanism?', back: 'Leukotriene receptor antagonist — anti-inflammatory for asthma' },
  { front: 'Fluticasone — Drug class?', back: 'Inhaled corticosteroid — anti-inflammatory for asthma/COPD' },

  // GI
  { front: 'Omeprazole — Drug class and mechanism?', back: 'Proton pump inhibitor (PPI) — irreversibly blocks H+/K+-ATPase' },
  { front: 'Ranitidine — Drug class? (NOTE: Recalled)', back: 'H2 receptor antagonist — recalled due to NDMA contamination (use famotidine instead)' },
  { front: 'Ondansetron — Primary use and mechanism?', back: '5-HT3 receptor antagonist — antiemetic for chemotherapy-induced nausea' }
];

const clinicalScenarios = [
  {
    front: 'Patient with Type 2 DM, eGFR 45 mL/min/1.73m² — Metformin safety?',
    back: 'CAUTION: eGFR 30-45 requires dose reduction; discontinue if eGFR <30 due to lactic acidosis risk'
  },
  {
    front: 'ACE inhibitor + hyperkalemia — Management?',
    back: 'Monitor K+ levels; consider dose reduction, dietary counseling, or switch to ARB if persistent'
  },
  {
    front: 'Warfarin + new antibiotic — Key interaction concern?',
    back: 'Many antibiotics increase warfarin effect; monitor INR closely, especially with fluoroquinolones, macrolides'
  },
  {
    front: 'Beta-blocker abrupt discontinuation — Risk?',
    back: 'Rebound hypertension, tachycardia, potential MI — must taper gradually over 1-2 weeks'
  },
  {
    front: 'Statin + muscle pain — DDx and management?',
    back: 'Rule out rhabdomyolysis (check CK); consider statin-induced myopathy — may need dose reduction or drug change'
  }
];

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seed...');

    // Create a demo user
    const user = await prisma.user.upsert({
      where: { email: 'demo@pharmschool.edu' },
      update: {},
      create: {
        email: 'demo@pharmschool.edu',
        name: 'Demo Student',
        isPremium: true
      }
    });

    console.log('✅ Created demo user');

    // Create Top 200 Drugs deck
    const drugsDeck = await prisma.deck.upsert({
      where: { id: 'top-200-drugs' },
      update: {},
      create: {
        id: 'top-200-drugs',
        title: 'Top 200 Drugs',
        ownerId: user.id,
        isPublic: true
      }
    });

    // Create Clinical Scenarios deck
    const scenariosDeck = await prisma.deck.upsert({
      where: { id: 'clinical-scenarios' },
      update: {},
      create: {
        id: 'clinical-scenarios',
        title: 'Clinical Scenarios & Safety',
        ownerId: user.id,
        isPublic: true
      }
    });

    console.log('✅ Created decks');

    // Add drug cards
    for (const drug of top200Drugs) {
      await prisma.card.create({
        data: {
          deckId: drugsDeck.id,
          front: drug.front,
          back: drug.back
        }
      });
    }

    // Add clinical scenario cards
    for (const scenario of clinicalScenarios) {
      await prisma.card.create({
        data: {
          deckId: scenariosDeck.id,
          front: scenario.front,
          back: scenario.back
        }
      });
    }

    console.log('✅ Added sample cards');

    // Create some sample study logs
    const cards = await prisma.card.findMany({ take: 5 });
    for (const card of cards) {
      await prisma.studyLog.create({
        data: {
          userId: user.id,
          cardId: card.id,
          rating: Math.floor(Math.random() * 4) + 1,
          timeSpent: Math.floor(Math.random() * 60) + 30
        }
      });
    }

    console.log('✅ Added sample study logs');
    console.log('🎉 Database seeding completed!');

    const stats = {
      users: await prisma.user.count(),
      decks: await prisma.deck.count(),
      cards: await prisma.card.count(),
      studyLogs: await prisma.studyLog.count()
    };

    console.log('📊 Database stats:', stats);

  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seedDatabase();