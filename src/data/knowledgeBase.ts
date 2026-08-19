import { KnowledgeDoc } from '../types';

export const KNOWLEDGE_BASE_DOCS: KnowledgeDoc[] = [
  {
    id: 'kb-multimeter-testing',
    title: 'Automotive 12V Battery Testing Standards & Voltage Thresholds',
    slug: 'automotive-battery-testing-standards',
    category: 'Diagnostic Standards',
    content: `A healthy flooded 12V automotive battery at 20°C (68°F) rests at 12.65V–12.75V (100% SoC).
At 12.45V, state of charge is approximately 75%.
At 12.24V, state of charge is 50% (sulfation threshold).
At 12.00V, state of charge is 25% (deeply discharged).
Below 11.90V, battery is effectively 0% discharged.
During active starter engagement (crank test), healthy battery voltage must stay above 9.6V (at 20°C).
Alternator charging output with engine idling must register between 13.8V and 14.5V DC.
Alternator output above 15.0V indicates a failed voltage regulator that will boil electrolyte and emit sulfur odors.`,
    source: 'Battery Council International (BCI) Technical Manual & SAE J537',
    sourceUrl: 'https://batterycouncil.org',
    verified: true,
    lastUpdated: '2024-11-20',
  },
  {
    id: 'kb-bci-group-sizes',
    title: 'BCI Battery Group Size Dimension & Capacity References',
    slug: 'bci-group-size-specifications',
    category: 'Vehicle Specifications',
    content: `Common Global Automotive Group Sizes:
- Group 35: 230 x 175 x 225 mm (9.06 x 6.89 x 8.86 in), top post pos right. Very common in Toyota, Nissan, Subaru, Honda.
- Group 24F: 260 x 173 x 225 mm (10.25 x 6.81 x 8.86 in), top post pos right. Common in Honda, Acura, Toyota trucks/V6.
- Group 51R: 238 x 129 x 223 mm (9.38 x 5.08 x 8.78 in), narrow footprint. Common in Honda Civic, CR-V, Fit, early Tesla Model 3 12V.
- Group 48 / H6 (DIN LN3): 278 x 175 x 190 mm (10.94 x 6.89 x 7.48 in), recessed DIN posts. Standard in European & modern start-stop vehicles (VW, Audi, BMW, Chevy, Ford).
- Group 94R / H7 (DIN LN4): 315 x 175 x 190 mm (12.4 x 6.89 x 7.48 in). Common in Ford F-150, GM full-size SUVs, BMW, Mercedes.
- Group 49 / H8 (DIN LN5): 353 x 175 x 190 mm (13.9 x 6.89 x 7.48 in). Common in BMW 3/5 Series, Mercedes, Audi large SUVs.`,
    source: 'BCI Standard Group Size Dimensional Catalog',
    verified: true,
    lastUpdated: '2024-10-14',
  },
  {
    id: 'kb-lifepo4-characteristics',
    title: 'LiFePO4 Chemistry Operating Parameters & Voltage Profiles',
    slug: 'lifepo4-chemistry-specifications',
    category: 'Battery Chemistry',
    content: `LiFePO4 (Lithium Iron Phosphate) 12V 4-cell pack specifications:
- Nominal voltage: 12.8V (3.2V per cell).
- Full charge resting voltage: 13.3V – 13.4V (3.325V – 3.35V/cell).
- Absorption charge target voltage: 14.2V – 14.6V (3.55V – 3.65V/cell).
- Float charge voltage: 13.5V – 13.6V.
- Recommended low-voltage cutoff: 11.5V – 12.0V (protects internal cells from over-discharge).
- Cycle life: 3,500 – 6,000 cycles at 80% Depth of Discharge.
- Low-temperature charging limit: DO NOT charge below 0°C (32°F) unless battery features internal heating elements or low-temp charge cutoff.`,
    source: 'IEEE 1679.1 Standard for the Characterization and Evaluation of Lithium-Based Batteries',
    verified: true,
    lastUpdated: '2024-11-05',
  },
  {
    id: 'kb-ev-safety-high-voltage',
    title: 'Electric Vehicle High-Voltage Safety Guidelines',
    slug: 'ev-high-voltage-safety',
    category: 'Safety Standards',
    content: `Electric vehicle traction battery systems operate between 350V and 800V DC.
Orange-colored high-voltage cables, inverter casings, and battery pack enclosures contain lethal electrical potential.
Never cut or probe orange high-voltage cables.
In the event of an EV collision, battery fire, thermal runaway, or submerged vehicle, first responders must locate and pull the Low-Voltage First Responder Cut Loop or Service Disconnect Plug.
Water deluging with copious amounts of water (3,000+ gallons) is required for EV traction battery thermal runaway cooling.`,
    source: 'NFPA 1006 / SAE J2990 Hybrid and EV First Responder Safety',
    verified: true,
    lastUpdated: '2024-12-01',
  },
];

/**
 * Search the grounded knowledge base
 */
export function searchKnowledgeDocs(keyword: string): KnowledgeDoc[] {
  if (!keyword || !keyword.trim()) return KNOWLEDGE_BASE_DOCS;
  const q = keyword.toLowerCase().trim();
  return KNOWLEDGE_BASE_DOCS.filter(
    (doc) =>
      doc.title.toLowerCase().includes(q) ||
      doc.category.toLowerCase().includes(q) ||
      doc.content.toLowerCase().includes(q)
  );
}
