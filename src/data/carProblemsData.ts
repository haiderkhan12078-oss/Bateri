import { CarProblem } from '../types';

export const COMMON_CAR_PROBLEMS: CarProblem[] = [
  {
    id: 'car-wont-start',
    slug: 'car-wont-start',
    title: 'Car Won’t Start (No Crank or Dead Power)',
    shortDescription: 'Engine completely fails to turn over, or instrument cluster goes completely dark upon turning key.',
    icon: '⚡',
    severity: 'critical',
    symptoms: [
      'No sound or single faint click when turning ignition',
      'Dashboard warning lights dim to black or fail to illuminate',
      'Power windows, radio, and horn are unresponsive',
      'Engine does not rotate at all',
    ],
    diagnosticTree: [
      {
        stepId: 1,
        question: 'Do any interior lights or dashboard indicators light up?',
        action: 'Turn ignition key to ON (without cranking) and observe instrument cluster and dome light.',
        ifYes: {
          conclusion: 'Basic 12V standby circuitry is present, but heavy cranking voltage may still collapse.',
          nextStepId: 2,
        },
        ifNo: {
          conclusion: 'Complete 0V dead battery, disconnected main terminal, blown 100A-150A main fusible link, or severe ground corrosion.',
        },
      },
      {
        stepId: 2,
        question: 'Does the starter motor click rapidly (machine-gun sound) when turning key?',
        action: 'Turn key fully to START and listen carefully to under-hood sound.',
        ifYes: {
          conclusion: 'Starter solenoid engages, but battery drops under 9.0V under load, causing solenoid chatter.',
          nextStepId: 3,
        },
        ifNo: {
          conclusion: 'Possible neutral safety switch, starter relay failure, ignition cylinder switch, or immobilized key transponder.',
        },
      },
      {
        stepId: 3,
        question: 'Does resting multimeter voltage measure above 12.4V at battery posts?',
        action: 'Place red probe on positive post, black on negative post with engine off.',
        ifYes: {
          conclusion: 'Battery voltage is acceptable, but bad terminal clamps or high internal resistance is preventing current transfer.',
        },
        ifNo: {
          conclusion: 'Battery is discharged below 50% state of charge (<12.2V) or deeply dead (<10.5V sulfated cell).',
        },
      },
    ],
    likelyCauses: [
      {
        cause: 'Discharged or Dead 12V Battery',
        probability: 70,
        verification: 'Resting open-circuit voltage < 12.2V with multimeter; fails carbon pile load test.',
        fix: 'Jump-start vehicle and recharge battery with 10A smart charger, or replace if battery is 3-5+ years old.',
      },
      {
        cause: 'Corroded / Loose Terminal Clamps',
        probability: 18,
        verification: 'Hand-twist terminal clamps; white/blue lead sulfate powder around post connection.',
        fix: 'Clean posts and clamps with wire brush and baking soda solution. Torque clamps to 10–12 Nm.',
      },
      {
        cause: 'Failed Starter Motor / Solenoid',
        probability: 8,
        verification: '12V+ present at starter trigger wire while cranking, but motor does not turn.',
        fix: 'Replace starter motor assembly.',
      },
      {
        cause: 'Blown Main Fusible Link',
        probability: 4,
        verification: 'Continuity test on 100A–200A battery mounted fuse with multimeter Ohms setting.',
        fix: 'Replace high-current master fuse block after inspecting for short circuits.',
      },
    ],
    preventativeTips: [
      'Replace lead-acid automotive starting batteries every 3 to 4 years in hot climates and 4 to 5 years in mild climates.',
      'Apply dielectric grease or anti-corrosion felt washers to battery posts.',
      'Ensure battery tie-down bracket is secure; excessive engine vibration damages internal lead plates.',
    ],
    relatedTools: [
      { title: 'Battery Runtime Calculator', tab: 'battery-tools', subTab: 'runtime-calculator' },
      { title: 'Vehicle Fitment Finder', tab: 'vehicle-battery' },
    ],
  },
  {
    id: 'battery-keeps-dying',
    slug: 'battery-keeps-dying',
    title: 'Parasitic Battery Drain (Draining Overnight)',
    shortDescription: 'Battery repeatedly goes flat after vehicle sits parked for 1 to 3 days, even after jump starting.',
    icon: '🔋',
    severity: 'moderate',
    symptoms: [
      'Vehicle starts fine after driving, but is dead next morning',
      'Battery tests good when tested immediately off a charger',
      'Glove box, trunk light, or aftermarket dash cam warm to the touch while parked',
    ],
    diagnosticTree: [
      {
        stepId: 1,
        question: 'Does the battery hold 12.6V when disconnected from the car for 24 hours?',
        action: 'Disconnect negative battery terminal, charge to 100%, and measure voltage 24 hours later.',
        ifYes: {
          conclusion: 'The battery itself is healthy; an active vehicle circuit is drawing continuous parasitic current.',
          nextStepId: 2,
        },
        ifNo: {
          conclusion: 'Internal battery cell short or severe plate sulfation causing internal self-discharge.',
        },
      },
      {
        stepId: 2,
        question: 'Does digital multimeter measure current draw above 50mA (0.050A) in sleep mode?',
        action: 'Set meter to 10A DC in series between disconnected negative cable and negative battery post.',
        ifYes: {
          conclusion: 'Abnormal parasitic draw confirmed. Normal modern car sleep draw is 20mA–50mA.',
          nextStepId: 3,
        },
        ifNo: {
          conclusion: 'Standby current is normal; intermittent alarm trigger or failing alternator diode is suspect.',
        },
      },
      {
        stepId: 3,
        question: 'Does pulling specific fuses in interior fuse box drop current below 50mA?',
        action: 'Pull fuses one at a time while observing multimeter display.',
        ifYes: {
          conclusion: 'Defective module or stuck relay identified on the isolated fuse circuit.',
        },
        ifNo: {
          conclusion: 'Check un-fused alternator rectifier diode or starter main B+ cable.',
        },
      },
    ],
    likelyCauses: [
      {
        cause: 'Stuck Body Control Relay / Trunk Light Switch',
        probability: 45,
        verification: 'Parasitic draw drops instantly when pulling fuse for BCM / interior lighting.',
        fix: 'Replace sticky Bosch-style relay or adjust trunk/glovebox closure switch.',
      },
      {
        cause: 'Short Circuit in Alternator Rectifier Diode',
        probability: 25,
        verification: 'Draw disappears when disconnecting heavy B+ output cable from alternator.',
        fix: 'Rebuild or replace alternator assembly.',
      },
      {
        cause: 'Aftermarket Alarm, Dash Cam, or GPS Tracker',
        probability: 20,
        verification: 'Hardwired accessories staying awake and drawing 150mA–300mA continuously.',
        fix: 'Rewire accessory power to switched ACC / Ignition circuit rather than constant Battery 12V.',
      },
      {
        cause: 'Battery Internal Self-Discharge',
        probability: 10,
        verification: 'Battery discharges on a bench with zero connected loads.',
        fix: 'Replace defective battery.',
      },
    ],
    preventativeTips: [
      'Disconnect 12V accessory port chargers when parking vehicle for longer than 48 hours.',
      'Use a 1.5A trickle maintainer if vehicle is parked for more than 2 weeks.',
    ],
    relatedTools: [
      { title: 'Watts to Amps Converter', tab: 'converters', subTab: 'watts-to-amps' },
    ],
  },
  {
    id: 'alternator-not-charging',
    slug: 'alternator-not-charging',
    title: 'Alternator Charging System Failure',
    shortDescription: 'Red battery dashboard light illuminated; electrical power rapidly degrades while driving.',
    icon: '⚠️',
    severity: 'critical',
    symptoms: [
      'Red battery light on gauge cluster while engine is running',
      'Headlights dim and brighten proportionally with engine RPM',
      'Radio screens or ABS warning lights flash randomly before car stalls out',
    ],
    diagnosticTree: [
      {
        stepId: 1,
        question: 'Is the serpentine alternator drive belt intact and tight?',
        action: 'Visually inspect alternator pulley belt for cracking, glaze, or slipping.',
        ifYes: {
          conclusion: 'Mechanical drive is functional; electrical alternator internal components need testing.',
          nextStepId: 2,
        },
        ifNo: {
          conclusion: 'Broken or loose serpentine belt; alternator is not spinning.',
        },
      },
      {
        stepId: 2,
        question: 'Does running engine battery voltage measure between 13.8V and 14.5V DC?',
        action: 'Start engine, hold idle at 1,500 RPM, and measure voltage across battery posts.',
        ifYes: {
          conclusion: 'Alternator charging voltage is healthy.',
        },
        ifNo: {
          conclusion: 'Alternator is under-charging (<13.2V) or overcharging (>15.0V boiling electrolyte).',
        },
      },
    ],
    likelyCauses: [
      {
        cause: 'Worn Alternator Carbon Brushes / Voltage Regulator',
        probability: 60,
        verification: 'Running voltage is identical to resting battery voltage (12.2V - 12.4V) without rise.',
        fix: 'Replace alternator assembly or internal regulator/brush pack.',
      },
      {
        cause: 'Blown Alternator Sense Fuse (ALT-S)',
        probability: 20,
        verification: 'Inspect 7.5A / 10A ALT-S fuse in underhood fuse box with test light.',
        fix: 'Replace blown mini fuse.',
      },
      {
        cause: 'Glazed / Snapped Serpentine Belt',
        probability: 20,
        verification: 'Belt missing from pulleys or slipping with loud high-pitched squeal.',
        fix: 'Install new EPDM serpentine belt and check automatic tensioner.',
      },
    ],
    preventativeTips: [
      'Inspect serpentine belt tension and rib condition at every oil change.',
      'Do not jump-start a completely dead battery on a vehicle with a weak alternator without pre-charging.',
    ],
    relatedTools: [
      { title: 'Battery Capacity Sizing', tab: 'battery-tools', subTab: 'capacity-calculator' },
    ],
  },
  {
    id: 'corroded-terminals',
    slug: 'corroded-terminals',
    title: 'Severe Battery Post Corrosion & Resistance',
    shortDescription: 'Crusty white, blue, or green crystal buildup around battery posts causing intermittent no-starts.',
    icon: '🔧',
    severity: 'moderate',
    symptoms: [
      'Fuzzy powdery crust coating positive or negative post',
      'Car starts intermittently when wiggling cables',
      'Voltage drops drastically under starter load',
    ],
    diagnosticTree: [
      {
        stepId: 1,
        question: 'Is corrosion primarily located on the positive (+) post?',
        action: 'Observe post color: Positive corrosion is typically copper sulfate (blue/green); negative is white.',
        ifYes: {
          conclusion: 'Positive corrosion indicates mild overcharging or acid gas seepage past post seal.',
        },
        ifNo: {
          conclusion: 'Negative corrosion indicates slight undercharging or ground resistance.',
        },
      },
    ],
    likelyCauses: [
      {
        cause: 'Electrolyte Fume Leakage Around Terminal Lead Bushing',
        probability: 75,
        verification: 'Acid gas reacts with copper clamp and lead post forming copper sulfate.',
        fix: 'Neutralize with baking soda/water, scrub with wire brush, and install chemically treated felt washers.',
      },
      {
        cause: 'Over-tightened Clamps Cracking Post Seal',
        probability: 25,
        verification: 'Post wiggles inside plastic top cover.',
        fix: 'Replace cracked battery to prevent hydrogen gas leaks.',
      },
    ],
    preventativeTips: [
      'Clean terminals yearly and coat with petroleum jelly or protective silicone battery sealant.',
    ],
  },
];

export function evaluateDiagnosticAnswers(
  problemSlug: string,
  answers: Record<string, string>
) {
  const problem = COMMON_CAR_PROBLEMS.find((p) => p.slug === problemSlug || p.id === problemSlug);
  return {
    problemId: problem?.id || problemSlug,
    problemTitle: problem?.title || 'Vehicle Battery Diagnosis',
    answersReceived: answers,
    likelyCauses: problem?.likelyCauses || [],
    preventativeTips: problem?.preventativeTips || [],
    assumptions: [
      'Diagnostic logic based on standard automotive 12V lead-acid and AGM electrical systems.',
      'Always observe eye safety and remove metal jewelry before working near high-current battery terminals.',
    ],
  };
}

