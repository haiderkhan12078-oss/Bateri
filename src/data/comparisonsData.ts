import { ComparisonItem } from '../types';

export const COMPARISONS_DATABASE: ComparisonItem[] = [
  {
    id: 'agm-vs-lead-acid',
    slug: 'agm-vs-lead-acid',
    title: 'AGM vs. Standard Flooded Lead-Acid Batteries',
    subtitle: 'Absorbent Glass Mat (AGM) vs. Traditional Wet-Cell Lead-Acid',
    optionAName: 'AGM (Absorbent Glass Mat)',
    optionBName: 'Standard Flooded Lead-Acid',
    summary:
      'AGM batteries feature compressed fiberglass separators that absorb liquid acid, creating a sealed, spill-proof battery with superior vibration resistance, faster recharge speed, and longer cycle life compared to traditional flooded wet-cell batteries.',
    keyTakeaways: [
      'AGM charges up to 5x faster than flooded lead-acid due to lower internal resistance.',
      'Flooded batteries are 40–50% cheaper upfront and remain ideal for basic budget starting applications.',
      'AGM is mandatory for vehicles with Start-Stop, high electrical demands, or trunk-mounted batteries.',
      'AGM cannot tolerate overcharging above 14.8V and requires proper voltage-regulated charging.',
    ],
    attributes: [
      {
        name: 'Upfront Capital Cost',
        description: 'Initial purchase price for equivalent group size.',
        optionAValue: '$180 – $280',
        optionBValue: '$90 – $160',
        winner: 'B',
        explanation: 'Flooded lead-acid remains the most economical upfront battery chemistry.',
      },
      {
        name: 'Cycle Life (at 50% DoD)',
        description: 'Number of partial charge/discharge cycles before reaching 80% capacity.',
        optionAValue: '500 – 800 cycles',
        optionBValue: '250 – 400 cycles',
        winner: 'A',
        explanation: 'AGM tightly compressed plates prevent active lead shedding during cycling.',
      },
      {
        name: 'Vibration & Shock Resistance',
        description: 'Resistance to rough road, off-road, and marine pounding.',
        optionAValue: 'Outstanding (up to 20x higher)',
        optionBValue: 'Moderate (plate damage risk)',
        winner: 'A',
        explanation: 'Glass mats firmly hold plates in place, eliminating internal short-circuits from severe vibration.',
      },
      {
        name: 'Spill & Leak Hazard',
        description: 'Safety in enclosed trunks or overturned orientation.',
        optionAValue: '100% Sealed & Non-spillable',
        optionBValue: 'Liquid acid can vent and spill',
        winner: 'A',
        explanation: 'AGM has no free liquid and can be mounted on its side if required.',
      },
      {
        name: 'Self-Discharge Rate',
        description: 'Rate of charge loss during storage at 20°C.',
        optionAValue: '1–2% per month',
        optionBValue: '4–8% per month',
        winner: 'A',
        explanation: 'AGM can sit in off-season storage for 6–12 months without going completely flat.',
      },
    ],
    bestForOptionA: [
      'Vehicles with Auto Start-Stop technology',
      'Luxury cars with extensive electronics and heavy parasitic standby loads',
      'Batteries installed inside passenger cabin or trunk',
      'Off-road, marine, and high-vibration power sports applications',
    ],
    bestForOptionB: [
      'Budget-conscious standard passenger vehicle replacements',
      'Older vehicles without complex electrical systems',
      'Warm climate daily drivers with standard alternator charging',
    ],
    recommendation:
      'If your car came with AGM from the factory, you MUST replace it with AGM. For older cars without start-stop, standard flooded is adequate, but upgrading to AGM will provide superior reliability and longer life in extreme weather.',
    faqs: [
      {
        question: 'Can I replace my standard flooded battery with an AGM battery?',
        answer:
          'Yes, upgrading to an AGM battery is completely safe as long as the group size and terminal configuration match. It provides superior starting power, vibration resistance, and longer lifespan.',
      },
      {
        question: 'Can I put a standard flooded battery in an AGM start-stop car to save money?',
        answer:
          'No. A flooded battery in a start-stop vehicle will overheat, sulfate rapidly, and typically fail within 6 to 12 months. Modern vehicle charging profiles will also overwork the battery.',
      },
    ],
  },
  {
    id: 'lifepo4-vs-lead-acid',
    slug: 'lifepo4-vs-lead-acid',
    title: 'LiFePO4 Lithium vs. Lead-Acid (AGM/Gel)',
    subtitle: 'Lithium Iron Phosphate vs. Deep-Cycle Lead-Acid for Solar, RV & Marine',
    optionAName: 'LiFePO4 (Lithium Iron Phosphate)',
    optionBName: 'Deep Cycle Lead-Acid / AGM',
    summary:
      'LiFePO4 is the premier deep-cycle storage technology offering 4,000+ cycles at 80-90% DoD, 70% lighter weight, flat voltage discharge curves, and built-in BMS protection.',
    keyTakeaways: [
      'LiFePO4 provides 90%+ usable capacity vs 50% recommended limit for lead-acid.',
      'Weight is ~70% lower (100Ah LiFePO4 weighs ~26 lbs vs ~65 lbs for AGM).',
      '4,000 to 6,000 cycle lifespan yields significantly lower cost per usable kWh over 10 years.',
      'Must have low-temperature charge cutoff below 0°C (32°F).',
    ],
    attributes: [
      {
        name: 'Cycle Life (at 80% DoD)',
        description: 'Estimated cycles until 80% capacity retention.',
        optionAValue: '3,500 – 6,000+ cycles',
        optionBValue: '300 – 500 cycles',
        winner: 'A',
        explanation: 'LiFePO4 lasts 8–10x more cycles than lead-acid.',
      },
      {
        name: 'Usable Capacity',
        description: 'Percentage of rated capacity safely usable without degrading lifespan.',
        optionAValue: '90% – 100%',
        optionBValue: '50%',
        winner: 'A',
        explanation: 'A 100Ah LiFePO4 provides 1,150+ Wh usable vs 600 Wh usable from 100Ah lead-acid.',
      },
      {
        name: 'Weight per 100Ah (12V)',
        description: 'Total physical weight of battery unit.',
        optionAValue: '11 – 13 kg (24 – 29 lbs)',
        optionBValue: '28 – 34 kg (62 – 75 lbs)',
        winner: 'A',
        explanation: 'Lithium is roughly 1/3 the weight for equivalent usable energy.',
      },
      {
        name: 'Cold Weather Charging',
        description: 'Ability to accept charge below 0°C (32°F).',
        optionAValue: 'Requires heater / low-temp cutoff',
        optionBValue: 'Can charge down to -20°C',
        winner: 'B',
        explanation: 'Charging lithium below freezing without cell heating causes irreversible dendrite plating.',
      },
      {
        name: 'Round-Trip Efficiency',
        description: 'Percentage of charging energy recovered during discharge.',
        optionAValue: '95% – 98%',
        optionBValue: '80% – 85%',
        winner: 'A',
        explanation: 'LiFePO4 wastes very little solar generation to internal heat.',
      },
    ],
    bestForOptionA: [
      'Off-grid solar homes, cabins, and energy storage banks',
      'RVs, campervans, and overland rigs where weight and space are critical',
      'Marine trolling motors and house electrical banks',
      'Long-term stationary power systems designed for 10+ years',
    ],
    bestForOptionB: [
      'Low-budget projects with infrequent occasional use (e.g. backup sump pump)',
      'Sub-zero unheated outdoor equipment without battery heating pads',
      'Traditional engine starting batteries',
    ],
    recommendation:
      'For any deep-cycle or solar energy storage project with regular use, LiFePO4 is the superior technical and financial choice over its lifetime. Lead-acid is only justified for very tight immediate budgets or infrequent standby use.',
    faqs: [
      {
        question: 'Can I drop a LiFePO4 battery into my existing lead-acid solar system?',
        answer:
          'Yes, provided your solar charge controller and inverter support custom charge voltages (14.2V–14.6V bulk/absorption, 13.6V float, and zero equalization charge). Equalization cycles intended for lead acid must be disabled for lithium.',
      },
    ],
  },
  {
    id: '12v-vs-24v-vs-48v',
    slug: '12v-vs-24v-vs-48v',
    title: '12V vs. 24V vs. 48V Battery Systems',
    subtitle: 'Choosing the right system voltage for Off-Grid Solar, Inverters, and Vans',
    optionAName: '48V Battery System',
    optionBName: '12V Battery System',
    summary:
      'System voltage determines the current (amperage) required to power a given wattage load. Increasing voltage from 12V to 48V cuts current by 75%, allowing thinner copper wiring, reducing resistive heat loss, and enabling large inverters (3,000W to 15,000W+).',
    keyTakeaways: [
      'Power (Watts) = Volts × Amps. At 3,000W load: 12V draws 250A, while 48V draws only 62.5A.',
      '12V requires thick, expensive 4/0 AWG copper cables; 48V uses manageable 4 AWG or 2 AWG wire.',
      '12V is best for small loads (<1,500W) with native 12V automotive/RV appliances.',
      '48V is the standard for whole-home solar, high-capacity inverters (>3,000W), and EV conversions.',
    ],
    attributes: [
      {
        name: 'Cable Thickness for 3000W Inverter',
        description: 'Required DC conductor gauge to limit voltage drop under 3%.',
        optionAValue: '4 AWG or 2 AWG (Easy to route)',
        optionBValue: '4/0 AWG or Dual 2/0 (Very thick & stiff)',
        winner: 'A',
        explanation: 'Higher voltage drastically reduces required copper gauge and cost.',
      },
      {
        name: 'Direct DC Appliance Availability',
        description: 'Availability of native DC lights, fans, and USB ports.',
        optionAValue: 'Requires 48V to 12V DC-DC converter',
        optionBValue: 'Thousands of native 12V automotive products',
        winner: 'B',
        explanation: '12V ecosystem has massive native appliance compatibility in RV and marine markets.',
      },
      {
        name: 'Efficiency & Resistive Heat Loss',
        description: 'I²R electrical heat loss through fuses, breakers, and busbars.',
        optionAValue: '16x lower resistive losses (P = I²R)',
        optionBValue: 'Significant heat dissipation at high loads',
        winner: 'A',
        explanation: 'Cutting current by 4x reduces I²R resistive power losses by a factor of 16.',
      },
    ],
    bestForOptionA: [
      'Off-grid and grid-tied solar homes (3,000W – 15,000W inverters)',
      'Large RVs running multiple rooftop air conditioners simultaneously',
      'Commercial battery energy storage systems (BESS)',
    ],
    bestForOptionB: [
      'Small campervans and trailers with inverter under 1,500W',
      'Simple boat house systems running lights, bilge pumps, and fish finders',
      'Automotive auxiliary setups',
    ],
    recommendation:
      'For loads under 1,500W, stick with 12V for simplicity. For loads between 1,500W and 3,000W, 24V is a great sweet spot. For any system with inverters 3,000W or higher, 48V is the undisputed modern standard.',
    faqs: [
      {
        question: 'Is 48V DC safe to touch?',
        answer:
          'Yes. In electrical safety codes (such as NEC and IEC), voltages under 60V DC are classified as Safety Extra-Low Voltage (SELV) and do not present a shock hazard under normal dry human skin contact.',
      },
    ],
  },
];
