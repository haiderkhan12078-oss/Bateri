import { GuideArticle } from '../types';

export const GUIDES_DATABASE: GuideArticle[] = [
  {
    id: 'how-to-test-a-car-battery',
    slug: 'how-to-test-a-car-battery',
    title: 'How to Test a Car Battery with a Multimeter (Step-by-Step)',
    category: 'Car Battery',
    readTimeMinutes: 7,
    publishedDate: '2024-11-10',
    lastUpdated: '2024-12-14',
    summary:
      'A practical guide to checking open-circuit resting voltage, cranking voltage drop, and alternator charging performance using a digital multimeter.',
    seoDescription:
      'Learn how to test your car battery and alternator with a digital multimeter. Step-by-step instructions for resting voltage, crank load test, and charging voltage.',
    sections: [
      {
        id: 'prep',
        title: '1. Preparation and Multimeter Setup',
        content:
          'Before testing, ensure the engine has been switched off for at least 30–60 minutes (or overnight) to allow surface charge from the alternator to dissipate. Turn your digital multimeter dial to the DC Voltage setting (marked with a solid line and dashed line over a "V"). Select the 20V DC range if your multimeter is manual-ranging.',
        callout: {
          type: 'tip',
          title: 'Removing Surface Charge',
          text: 'If the engine was running recently, turn your high-beam headlights on for 15 seconds, then switch them off and wait 2 minutes before measuring resting voltage.',
        },
      },
      {
        id: 'resting-voltage',
        title: '2. Testing Resting Open-Circuit Voltage',
        content:
          'Connect the RED multimeter probe to the POSITIVE (+) battery terminal post, and the BLACK probe to the NEGATIVE (-) battery terminal post. Read the displayed voltage on the screen.',
        table: {
          headers: ['Resting Voltage (at 20°C / 68°F)', 'State of Charge', 'Battery Condition'],
          rows: [
            ['12.65V – 12.75V+', '100%', 'Fully Charged (Healthy)'],
            ['12.45V – 12.50V', '75%', 'Good Charge Level'],
            ['12.20V – 12.30V', '50%', 'Needs Immediate Recharging'],
            ['12.00V – 12.10V', '25%', 'Severely Discharged; Sulfation Risk'],
            ['Under 11.90V', '0%', 'Discharged / Dead Cell; Replace or Desulfate'],
          ],
        },
      },
      {
        id: 'cranking-voltage',
        title: '3. Testing Cranking Voltage Drop (Load Test)',
        content:
          'Have an assistant crank the engine for 3 to 5 seconds while you observe the multimeter screen. The starter motor draws between 120 and 250+ Amperes of instantaneous current during engagement.\n\n- Above 10.0V while cranking: Excellent starter and battery health.\n- 9.6V to 9.9V: Acceptable in warm weather, but will struggle in cold winter conditions.\n- Below 9.6V: Battery has high internal resistance or plate shedding; replacement recommended.',
      },
      {
        id: 'alternator-test',
        title: '4. Testing Alternator Charging Voltage',
        content:
          'With the engine running at idle, observe the multimeter across the battery posts.\n\n- Normal charging range: 13.8V to 14.5V DC.\n- Below 13.5V: Alternator is undercharging, serpentine belt slipping, or voltage regulator failing.\n- Above 15.0V: Alternator is overcharging (cooking the battery with excessive voltage, causing boiling electrolyte and sulfuric gas odor).',
        callout: {
          type: 'warning',
          title: 'Overcharging Hazard',
          text: 'Charging voltage above 15.2V will boil water out of the electrolyte, degrade AGM glass mats, and create explosive hydrogen gas. Disconnect battery and replace alternator regulator immediately.',
        },
      },
    ],
    faqs: [
      {
        question: 'Can a battery show 12.6V resting but still fail to start the car?',
        answer:
          'Yes. A sulfated or aged battery can hold 12.6V with zero load (surface voltage), but when the starter demands 150A of current, its internal resistance causes the voltage to collapse instantly to under 8V. Cranking voltage testing reveals true battery capacity.',
      },
      {
        question: 'Does temperature affect multimeter voltage readings?',
        answer:
          'Yes. Open-circuit voltage drops slightly in freezing temperatures (~0.01V per 10°C). More importantly, the chemical reaction slows down in sub-zero weather, cutting available cranking power by up to 50%.',
      },
    ],
    relatedToolLinks: [
      { title: 'Battery Runtime Calculator', tab: 'battery-tools', subTab: 'runtime-calculator' },
      { title: 'Vehicle Battery Finder', tab: 'vehicle-battery' },
    ],
    relatedGuideSlugs: ['how-long-do-car-batteries-last', 'parasitic-battery-drain-guide', 'cca-vs-ah-explained'],
  },
  {
    id: 'how-long-do-car-batteries-last',
    slug: 'how-long-do-car-batteries-last',
    title: 'How Long Do Car Batteries Last? (Average Lifespan & Failure Factors)',
    category: 'Car Battery',
    readTimeMinutes: 6,
    publishedDate: '2024-10-22',
    lastUpdated: '2024-12-01',
    summary:
      'Standard lead-acid car batteries typically last 3 to 5 years. Understand how extreme heat, frequent short trips, and parasitic drains cut battery life.',
    seoDescription:
      'Discover real average car battery lifespan statistics, why hot climates kill batteries faster than cold winters, and 5 signs your battery needs replacement.',
    sections: [
      {
        id: 'lifespan-overview',
        title: 'Average Lifespan by Climate and Battery Type',
        content:
          'Across global automotive fleets, the typical lifespan of a flooded 12V automotive battery is 3 to 5 years. Modern AGM (Absorbent Glass Mat) batteries typically last 4 to 7 years due to compressed plate construction and recombinant gas technology.',
        table: {
          headers: ['Climate / Region', 'Average Flooded Lifespan', 'Average AGM Lifespan', 'Primary Failure Mechanism'],
          rows: [
            ['Hot Climates (e.g. Phoenix, Dubai, Texas)', '2.5 – 3.5 Years', '3.5 – 5.0 Years', 'Electrolyte evaporation, grid corrosion'],
            ['Moderate Climates (e.g. UK, Germany, Pacific NW)', '4.0 – 6.0 Years', '5.0 – 8.0 Years', 'Gradual plate active material shedding'],
            ['Cold Climates (e.g. Canada, Scandinavia, Midwest)', '3.5 – 5.0 Years', '4.5 – 6.5 Years', 'Severe winter capacity drop & cold freeze'],
          ],
        },
      },
      {
        id: 'heat-vs-cold',
        title: 'Why Heat Kills Batteries Faster Than Cold',
        content:
          'While car batteries most noticeably fail on freezing winter mornings, the damage actually occurs during hot summer months. High ambient heat (and under-hood temperatures reaching 90°C / 194°F) accelerates positive grid oxidation and chemical degradation according to the Arrhenius reaction rate principle (doubling chemical reaction speed every 10°C rise). When winter arrives, the already-degraded battery cannot overcome cold engine oil drag.',
      },
      {
        id: 'replacement-signs',
        title: '5 Warning Signs Your Battery Needs Replacement',
        content:
          '1. Sluggish engine cranking on morning cold start.\n2. Dim headlights at idle that brighten when pressing the gas pedal.\n3. Bloated or swollen battery casing caused by extreme heat or overcharging.\n4. Age code sticker showing more than 4 years in service.\n5. Frequent reliance on jump-starts.',
      },
    ],
    faqs: [
      {
        question: 'How do I read the date code on my car battery?',
        answer:
          'Most batteries feature a round sticker or hot-stamped alphanumeric code. The letter represents the month (A = January, B = February, C = March, skipping I) and the number represents the year (e.g., C4 = March 2024, K1 = October 2021).',
      },
    ],
    relatedToolLinks: [
      { title: 'Vehicle Battery Finder', tab: 'vehicle-battery' },
      { title: 'Battery Capacity Calculator', tab: 'battery-tools', subTab: 'capacity-calculator' },
    ],
    relatedGuideSlugs: ['how-to-test-a-car-battery', 'agm-vs-lead-acid', 'cca-vs-ah-explained'],
  },
  {
    id: 'agm-vs-lead-acid',
    slug: 'agm-vs-lead-acid',
    title: 'AGM vs. Standard Flooded vs. EFB: Which Battery Do You Need?',
    category: 'Battery Basics',
    readTimeMinutes: 8,
    publishedDate: '2024-11-05',
    lastUpdated: '2024-12-18',
    summary:
      'Detailed engineering comparison between Absorbent Glass Mat (AGM), Enhanced Flooded Battery (EFB), and traditional flooded lead-acid.',
    seoDescription:
      'AGM vs EFB vs Flooded car batteries compared. Understand internal construction, cycle life differences, start-stop vehicle requirements, and charging specs.',
    sections: [
      {
        id: 'construction',
        title: 'Internal Construction Differences',
        content:
          '- Traditional Flooded: Lead plates suspended in liquid sulfuric acid solution. Requires venting for hydrogen gas release; susceptible to vibration and acid stratification.\n\n- EFB (Enhanced Flooded): Adds a polyester scrim layer to retain active lead mass on plates and carbon additives to improve dynamic charge acceptance for basic start-stop vehicles.\n\n- AGM (Absorbent Glass Mat): Ultra-thin borosilicate glass fiber mats absorb 100% of liquid electrolyte. Plates are tightly compressed inside sealed cells with pressure-relief VRLA valves. Completely non-spillable and highly vibration resistant.',
      },
      {
        id: 'start-stop-mandate',
        title: 'Start-Stop Vehicles: Why You Cannot Downgrade to Flooded',
        content:
          'Modern vehicles with Start-Stop (engine shuts off at traffic lights) place immense cycle demand on the 12V battery. In a typical commute, the battery may endure 20 to 50 partial discharge/charge pulses while powering navigation, HVAC blowers, and audio. A standard flooded battery placed in a start-stop vehicle will often fail in 6 to 12 months.',
        callout: {
          type: 'danger',
          title: 'Never Downgrade from AGM to Flooded',
          text: 'If your car came from the factory with an AGM battery, replacing it with a standard flooded battery will trigger BMS error codes and cause premature failure. You can upgrade from Flooded to AGM, but never downgrade.',
        },
      },
    ],
    faqs: [
      {
        question: 'Do AGM batteries require a special battery charger?',
        answer:
          'Yes. AGM batteries must be charged with an AGM-compatible smart charger that regulates peak absorption voltage between 14.4V and 14.7V. Charging an AGM battery with an old high-voltage unregulated charger (>15.0V) can permanently dry out the glass mats.',
      },
    ],
    relatedToolLinks: [
      { title: 'Battery Chemistry Comparison', tab: 'comparisons' },
      { title: 'Vehicle Battery Finder', tab: 'vehicle-battery' },
    ],
    relatedGuideSlugs: ['how-to-test-a-car-battery', 'lifepo4-vs-lead-acid', 'cca-vs-ah-explained'],
  },
  {
    id: 'lifepo4-vs-lead-acid',
    slug: 'lifepo4-vs-lead-acid',
    title: 'LiFePO4 Lithium vs. Lead-Acid for Solar & Deep Cycle Backup',
    category: 'Solar',
    readTimeMinutes: 9,
    publishedDate: '2024-11-18',
    lastUpdated: '2024-12-10',
    summary:
      'A complete financial and technical breakdown comparing Lithium Iron Phosphate (LiFePO4) with Lead-Acid/AGM for off-grid, solar, RV, and marine applications.',
    seoDescription:
      'Compare LiFePO4 Lithium vs Lead-Acid for solar battery banks. Usable capacity, cycle life (4,000 vs 500), weight comparison, and true cost-per-kWh.',
    sections: [
      {
        id: 'usable-capacity',
        title: 'Usable Capacity vs Nominal Capacity',
        content:
          'A 12V 100Ah Lead-Acid battery has 1,200 Wh nominal energy, but discharging beyond 50% Depth of Discharge (DoD) causes rapid plate sulfation. This leaves only 600 Wh of usable energy.\n\nIn contrast, a 12V 100Ah LiFePO4 battery safely delivers 90% to 100% of its rated capacity (1,080 Wh to 1,280 Wh usable) without damaging cycle life. One 100Ah LiFePO4 battery effectively replaces two 100Ah lead-acid batteries.',
      },
      {
        id: 'true-cost-per-cycle',
        title: 'True Cost-Per-Cycle Analysis',
        content:
          '- Lead-Acid (AGM): $220 upfront cost ÷ 500 cycles (at 50% DoD) = $0.44 per usable kWh per cycle.\n\n- LiFePO4 Lithium: $380 upfront cost ÷ 4,000 cycles (at 80% DoD) = $0.095 per usable kWh per cycle.\n\nOver a 10-year period, LiFePO4 is more than 4x cheaper per delivered kilowatt-hour despite higher initial capital cost.',
      },
    ],
    faqs: [
      {
        question: 'Can LiFePO4 batteries be charged in sub-zero freezing weather?',
        answer:
          'No standard lithium cell should be charged below 0°C (32°F) as it causes irreversible metallic lithium plating on the anode, resulting in cell short circuits. Always choose LiFePO4 batteries with built-in low-temperature charging protection or internal heating pads for winter climates.',
      },
    ],
    relatedToolLinks: [
      { title: 'Solar Battery Bank Calculator', tab: 'solar', subTab: 'solar-battery-calculator' },
      { title: 'Battery Runtime Calculator', tab: 'battery-tools', subTab: 'runtime-calculator' },
    ],
    relatedGuideSlugs: ['agm-vs-lead-acid', 'parasitic-battery-drain-guide'],
  },
  {
    id: 'parasitic-battery-drain-guide',
    slug: 'parasitic-battery-drain-guide',
    title: 'How to Diagnose & Fix Parasitic Battery Drain',
    category: 'Automotive Electrical',
    readTimeMinutes: 8,
    publishedDate: '2024-10-15',
    lastUpdated: '2024-12-08',
    summary:
      'Step-by-step procedure for using a digital multimeter or milli-voltmeter across fuse test points to track down mysterious overnight battery drains.',
    seoDescription:
      'Learn how to find a parasitic draw in your car. Milliamp draw testing, fuse voltage drop chart, and common culprits like stuck relays and dashcams.',
    sections: [
      {
        id: 'what-is-drain',
        title: 'Normal Standby Draw vs Parasitic Drain',
        content:
          'Modern vehicles use small amounts of standby power for keyless entry receivers, clock memory, and anti-theft immobilizers. Normal key-off standby current is 20mA to 50mA (0.020A to 0.050A). Any continuous current draw exceeding 75mA to 100mA will drain a healthy 60Ah battery to dead in 3 to 7 days of non-use.',
      },
      {
        id: 'procedure',
        title: 'Multimeter Inline Amperage Test Procedure',
        content:
          '1. Latch all doors, hood, and trunk switches manually so vehicle modules believe car is closed and locked.\n2. Disconnect the negative (-) battery cable clamp.\n3. Set multimeter to 10A DC mode with red probe in 10A fused socket.\n4. Connect one probe to the negative battery post, and the second probe to the disconnected negative cable clamp.\n5. Wait 30 to 45 minutes for CAN-bus computers to enter deep sleep.\n6. If reading exceeds 0.05A (50mA), pull fuses one by one until current drops to pinpoint the offending circuit.',
      },
    ],
    faqs: [
      {
        question: 'What are the most common causes of parasitic drain?',
        answer:
          '1. Aftermarket accessories (dashcams hardwired to constant 12V, GPS trackers, amplifiers).\n2. Stuck mechanical relays (e.g. A/C clutch relay staying closed with key off).\n3. Glovebox or trunk light switch failed in closed position.\n4. Shorted alternator rectifier diode leaking current back to ground.',
      },
    ],
    relatedToolLinks: [
      { title: 'Watts to Amps Converter', tab: 'converters' },
      { title: 'Battery Runtime Calculator', tab: 'battery-tools', subTab: 'runtime-calculator' },
    ],
    relatedGuideSlugs: ['how-to-test-a-car-battery', 'how-long-do-car-batteries-last'],
  },
  {
    id: 'cca-vs-ah-explained',
    slug: 'cca-vs-ah-explained',
    title: 'Understanding Cold Cranking Amps (CCA) vs. Amp-Hours (Ah)',
    category: 'Battery Basics',
    readTimeMinutes: 6,
    publishedDate: '2024-11-28',
    lastUpdated: '2024-12-16',
    summary:
      'The definitive breakdown of battery capacity ratings: CCA, CA/MCA, Amp-Hours (Ah), and Reserve Capacity (RC).',
    seoDescription:
      'Understand Cold Cranking Amps (CCA) vs Amp Hours (Ah) and Reserve Capacity (RC). Know which rating matters for starting an engine vs powering solar loads.',
    sections: [
      {
        id: 'cca-definition',
        title: 'What is Cold Cranking Amps (CCA)?',
        content:
          'Cold Cranking Amps (CCA) is the standard rating defined by the Battery Council International (BCI). It measures the number of amperes a 12-volt battery can deliver at 0°F (-18°C) for 30 seconds continuously while maintaining a terminal voltage of at least 7.2 volts.\n\nCCA indicates instantaneous starting power to turn over cold, high-compression engines in freezing climates.',
      },
      {
        id: 'ah-definition',
        title: 'What is Amp-Hours (Ah)?',
        content:
          'Amp-Hours (Ah) measures total energy capacity over time, typically tested at a 20-hour discharge rate (C/20). A 100Ah battery can deliver 5 Amperes continuously for 20 hours before reaching 10.5V cut-off.\n\nAh is the critical metric for deep-cycle, solar, marine house banks, and EV auxiliary storage where sustained electrical runtime is required.',
      },
    ],
    faqs: [
      {
        question: 'Can I replace a 550 CCA battery with a 750 CCA battery in my car?',
        answer:
          'Yes! Installing a battery with higher CCA than factory specification is completely safe and beneficial for winter starting. The starter motor only draws the amperage it needs. However, you must ensure the physical group size (dimensions and terminal orientation) matches your tray.',
      },
    ],
    relatedToolLinks: [
      { title: 'Vehicle Battery Finder', tab: 'vehicle-battery' },
      { title: 'Ah to Wh Converter', tab: 'converters' },
    ],
    relatedGuideSlugs: ['agm-vs-lead-acid', 'how-to-test-a-car-battery'],
  },
];
