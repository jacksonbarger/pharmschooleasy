#!/usr/bin/env node

/**
 * AI Gap Analysis for Pharmacy Content
 * 
 * Analyzes extracted content and identifies missing information
 * that pharmacy students should know about the liver section.
 */

import { readdir, readFile, writeFile } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

const EXTRACTED_DIR = './content/liver-section/extracted-content'

// Comprehensive liver pharmacology knowledge base for gap analysis
const LIVER_KNOWLEDGE_BASE = {
  anatomy: [
    'Hepatocyte structure and function',
    'Portal circulation',
    'Bile duct system',
    'Liver lobule organization',
    'Kupffer cells and stellate cells'
  ],
  physiology: [
    'Bile acid synthesis and circulation',
    'Bilirubin metabolism',
    'Albumin synthesis',
    'Coagulation factor production',
    'Glucose homeostasis'
  ],
  pharmacokinetics: [
    'First-pass metabolism',
    'Hepatic clearance',
    'Bioavailability',
    'Protein binding',
    'Hepatic blood flow'
  ],
  enzymes: [
    'CYP450 system (1A2, 2C9, 2C19, 2D6, 3A4)',
    'Phase II conjugation enzymes',
    'Genetic polymorphisms',
    'Enzyme induction and inhibition',
    'Drug-drug interactions'
  ],
  diseases: [
    'Hepatitis (A, B, C)',
    'Cirrhosis',
    'NAFLD/NASH',
    'Drug-induced liver injury (DILI)',
    'Wilson disease',
    'Hemochromatosis'
  ],
  assessment: [
    'Liver function tests (ALT, AST, ALP, bilirubin)',
    'Child-Pugh classification',
    'MELD score',
    'Synthetic function markers'
  ],
  therapeutics: [
    'Hepatic impairment dosing',
    'Hepatotoxic medications',
    'Hepatoprotective agents',
    'Antiviral therapy',
    'Immunosuppressants'
  ],
  clinicalDrugs: [
    'Acetaminophen',
    'Statins',
    'Metformin',
    'Warfarin',
    'Phenytoin',
    'Rifampin',
    'Isoniazid',
    'Valproic acid'
  ]
}

async function analyzeContentGaps() {
  try {
    console.log('🔍 Analyzing content for knowledge gaps...')
    
    if (!existsSync(EXTRACTED_DIR)) {
      console.log('❌ No extracted content found. Run content extraction first:')
      console.log('   pnpm extract-content')
      return
    }
    
    const files = await readdir(EXTRACTED_DIR)
    const jsonFiles = files.filter(file => file.endsWith('.json'))
    
    if (jsonFiles.length === 0) {
      console.log('❌ No extracted content files found.')
      return
    }
    
    console.log(`📊 Analyzing ${jsonFiles.length} content file(s)...`)
    
    let allExtractedTopics = []
    let allDrugReferences = []
    let allKeyPoints = []
    
    // Collect all content from extracted files
    for (const file of jsonFiles) {
      const filePath = join(EXTRACTED_DIR, file)
      const content = JSON.parse(await readFile(filePath, 'utf8'))
      
      console.log(`📖 Processing: ${content.fileName}`)
      
      content.slides?.forEach(slide => {
        allKeyPoints.push(...(slide.keyPoints || []))
        allDrugReferences.push(...(slide.drugReferences || []))
      })
      
      allExtractedTopics.push(...(content.pharmacologyTopics?.map(t => t.topic) || []))
    }
    
    // Perform gap analysis
    const gapAnalysis = performGapAnalysis(allKeyPoints, allDrugReferences, allExtractedTopics)
    
    // Generate comprehensive report
    const report = generateGapAnalysisReport(gapAnalysis)
    
    const reportFile = join(EXTRACTED_DIR, 'gap-analysis-report.md')
    await writeFile(reportFile, report)
    
    console.log(`\\n✅ Gap analysis complete!`)
    console.log(`📋 Report saved to: ${reportFile}`)
    
    // Output key findings to console
    console.log('\\n🔍 KEY FINDINGS:')
    console.log(`\\n❌ Missing Topics (${gapAnalysis.missingTopics.length}):`)
    gapAnalysis.missingTopics.slice(0, 5).forEach(topic => 
      console.log(`   - ${topic}`)
    )
    
    console.log(`\\n💊 Missing Drug Coverage (${gapAnalysis.missingDrugs.length}):`)
    gapAnalysis.missingDrugs.slice(0, 5).forEach(drug => 
      console.log(`   - ${drug}`)
    )
    
    console.log(`\\n💡 Recommendations (${gapAnalysis.recommendations.length}):`)
    gapAnalysis.recommendations.slice(0, 3).forEach(rec => 
      console.log(`   - ${rec}`)
    )
    
  } catch (error) {
    console.error('💥 Error during gap analysis:', error.message)
    process.exit(1)
  }
}

function performGapAnalysis(keyPoints, drugReferences, extractedTopics) {
  const allContent = [...keyPoints, ...drugReferences, ...extractedTopics].join(' ').toLowerCase()
  
  const missingTopics = []
  const missingDrugs = []
  const recommendations = []
  
  // Check for missing anatomy topics
  LIVER_KNOWLEDGE_BASE.anatomy.forEach(topic => {
    if (!allContent.includes(topic.toLowerCase())) {
      missingTopics.push(`Anatomy: ${topic}`)
    }
  })
  
  // Check for missing pharmacokinetic concepts
  LIVER_KNOWLEDGE_BASE.pharmacokinetics.forEach(concept => {
    if (!allContent.includes(concept.toLowerCase().replace('-', ' '))) {
      missingTopics.push(`Pharmacokinetics: ${concept}`)
    }
  })
  
  // Check for missing enzyme information
  LIVER_KNOWLEDGE_BASE.enzymes.forEach(enzyme => {
    if (!allContent.includes(enzyme.toLowerCase())) {
      missingTopics.push(`Enzymes: ${enzyme}`)
    }
  })
  
  // Check for missing disease states
  LIVER_KNOWLEDGE_BASE.diseases.forEach(disease => {
    if (!allContent.includes(disease.toLowerCase())) {
      missingTopics.push(`Diseases: ${disease}`)
    }
  })
  
  // Check for missing clinical drugs
  LIVER_KNOWLEDGE_BASE.clinicalDrugs.forEach(drug => {
    if (!allContent.includes(drug.toLowerCase())) {
      missingDrugs.push(drug)
    }
  })
  
  // Generate recommendations based on gaps
  if (missingTopics.some(t => t.includes('CYP450'))) {
    recommendations.push('Add comprehensive CYP450 enzyme system coverage with drug interaction examples')
  }
  
  if (missingTopics.some(t => t.includes('Child-Pugh'))) {
    recommendations.push('Include Child-Pugh classification and hepatic impairment dosing guidelines')
  }
  
  if (missingDrugs.includes('Acetaminophen')) {
    recommendations.push('Add detailed acetaminophen metabolism and toxicity mechanisms')
  }
  
  if (missingTopics.some(t => t.includes('First-pass'))) {
    recommendations.push('Explain first-pass metabolism with specific drug examples and clinical implications')
  }
  
  if (missingDrugs.length > 5) {
    recommendations.push('Create drug interaction matrix for hepatically metabolized medications')
  }
  
  return {
    missingTopics,
    missingDrugs,
    recommendations,
    coverageScore: Math.max(0, 100 - (missingTopics.length + missingDrugs.length))
  }
}

function generateGapAnalysisReport(analysis) {
  return `# Liver Section - Knowledge Gap Analysis Report

*Generated: ${new Date().toISOString()}*

## 📊 Coverage Summary

**Overall Coverage Score: ${analysis.coverageScore}%**

- Missing Topics: ${analysis.missingTopics.length}
- Missing Drug Coverage: ${analysis.missingDrugs.length}
- Recommendations: ${analysis.recommendations.length}

## ❌ Missing Essential Topics

${analysis.missingTopics.map(topic => `- [ ] ${topic}`).join('\\n')}

## 💊 Missing Drug Coverage

${analysis.missingDrugs.map(drug => `- [ ] **${drug}** - Hepatic metabolism and clinical considerations`).join('\\n')}

## 💡 Priority Recommendations

${analysis.recommendations.map((rec, i) => `${i + 1}. ${rec}`).join('\\n')}

## 🎯 Suggested Study Plan

### High Priority
- Review CYP450 enzyme system and drug interactions
- Study hepatic impairment dosing adjustments
- Learn Child-Pugh classification system

### Medium Priority  
- Understand first-pass metabolism concepts
- Review drug-induced liver injury mechanisms
- Study liver function test interpretation

### Low Priority
- Advanced enzyme kinetics
- Genetic polymorphism effects
- Rare liver diseases

## 📚 Additional Resources Needed

- Drug interaction checker for hepatically metabolized drugs
- Child-Pugh calculator with dosing adjustments
- Case studies for drug-induced liver injury
- Interactive enzyme pathway diagrams

---

*This analysis helps identify knowledge gaps in your liver section content. Use this report to supplement your study materials and ensure comprehensive coverage of essential pharmacology concepts.*
`
}

// Run the gap analysis
analyzeContentGaps().catch(console.error)