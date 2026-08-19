import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

import {
  calculateBatteryRuntime,
  calculateBatteryCapacity,
  calculateBatteryChargingTime,
  calculatePeukertCapacity,
} from './src/lib/calculations/batteryCalculators.js';

import {
  calculateSolarBatteryBank,
  calculateSolarPanels,
  calculateInverterSizing,
} from './src/lib/calculations/solarCalculators.js';

import {
  calculateEVRange,
  calculateEVChargingTime,
  calculateEVChargingCost,
} from './src/lib/calculations/evCalculators.js';

import {
  convertAhToWh,
  convertWhToAh,
  convertMahToWh,
  convertWhToMah,
  convertWattsToAmps,
  convertAmpsToWatts,
  convertCcaToCa,
  convertKwhToWh,
  convertWhToKwh,
} from './src/lib/calculations/converters.js';

import {
  VEHICLE_BATTERY_DATABASE,
  searchVehicleDatabase,
  getUniqueMakes,
  getModelsByMake,
  getYearsByMakeAndModel,
  findVehicleBatterySpecs,
} from './src/data/vehicleDatabase.js';

import {
  COMMON_CAR_PROBLEMS,
  evaluateDiagnosticAnswers,
} from './src/data/carProblemsData.js';

//const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // =========================================================
  // HEALTH CHECK
  // =========================================================

  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'Bateri Engine API',
    });
  });

  // =========================================================
  // CALCULATIONS API ENDPOINTS
  // =========================================================

  // Battery Runtime
  app.post('/api/calculate/runtime', (req, res) => {
    try {
      const result = calculateBatteryRuntime(req.body);

      res.json({
        success: true,
        result,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error?.message || 'Calculation error',
      });
    }
  });

  // Battery Capacity
  app.post('/api/calculate/capacity', (req, res) => {
    try {
      const result = calculateBatteryCapacity(req.body);

      res.json({
        success: true,
        result,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error?.message || 'Calculation error',
      });
    }
  });

  // Battery Charging Time
  app.post('/api/calculate/charging', (req, res) => {
    try {
      const result = calculateBatteryChargingTime(req.body);

      res.json({
        success: true,
        result,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error?.message || 'Calculation error',
      });
    }
  });

  // Peukert Law Calculation
  app.post('/api/calculate/peukert', (req, res) => {
    try {
      const result = calculatePeukertCapacity(req.body);

      res.json({
        success: true,
        result,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error?.message || 'Calculation error',
      });
    }
  });

  // Solar Battery Bank
  app.post('/api/calculate/solar-bank', (req, res) => {
    try {
      const result = calculateSolarBatteryBank(req.body);

      res.json({
        success: true,
        result,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error?.message || 'Calculation error',
      });
    }
  });

  // Solar Panels
  app.post('/api/calculate/solar-panels', (req, res) => {
    try {
      const result = calculateSolarPanels(req.body);

      res.json({
        success: true,
        result,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error?.message || 'Calculation error',
      });
    }
  });

  // Inverter Sizing
  app.post('/api/calculate/inverter', (req, res) => {
    try {
      const result = calculateInverterSizing(req.body);

      res.json({
        success: true,
        result,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error?.message || 'Calculation error',
      });
    }
  });

  // EV Range
  app.post('/api/calculate/ev-range', (req, res) => {
    try {
      const result = calculateEVRange(req.body);

      res.json({
        success: true,
        result,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error?.message || 'Calculation error',
      });
    }
  });

  // EV Charging Duration
  app.post('/api/calculate/ev-charging', (req, res) => {
    try {
      const result = calculateEVChargingTime(req.body);

      res.json({
        success: true,
        result,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error?.message || 'Calculation error',
      });
    }
  });

  // EV Charging Cost
  app.post('/api/calculate/ev-cost', (req, res) => {
    try {
      const result = calculateEVChargingCost(req.body);

      res.json({
        success: true,
        result,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error?.message || 'Calculation error',
      });
    }
  });

  // =========================================================
  // UNIT CONVERTER
  // =========================================================

  app.post('/api/convert', (req, res) => {
    try {
      const {
        type,
        value,
        param1,
        param2,
      } = req.body;

      let result;

      switch (type) {
        case 'ah-to-wh':
          result = convertAhToWh(value, param1);
          break;

        case 'wh-to-ah':
          result = convertWhToAh(value, param1);
          break;

        case 'mah-to-wh':
          result = convertMahToWh(value, param1);
          break;

        case 'wh-to-mah':
          result = convertWhToMah(value, param1);
          break;

        case 'watts-to-amps':
          result = convertWattsToAmps(value, param1, param2);
          break;

        case 'amps-to-watts':
          result = convertAmpsToWatts(value, param1, param2);
          break;

        case 'cca-to-ca':
          result = convertCcaToCa(value);
          break;

        case 'kwh-to-wh':
          result = convertKwhToWh(value);
          break;

        case 'wh-to-kwh':
          result = convertWhToKwh(value);
          break;

        default:
          return res.status(400).json({
            success: false,
            error: `Unknown conversion type: ${type}`,
          });
      }

      res.json({
        success: true,
        result,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error?.message || 'Conversion error',
      });
    }
  });

  // =========================================================
  // VEHICLE BATTERY DATABASE
  // =========================================================

  app.get('/api/vehicles', (req, res) => {
    const {
      make,
      model,
      year,
      search,
    } = req.query as Record<string, string>;

    if (make || model || year || search) {
      const results = searchVehicleDatabase({
        make,
        model,
        year,
        keyword: search,
      });

      return res.json({
        success: true,
        count: results.length,
        data: results,
      });
    }

    res.json({
      success: true,
      count: VEHICLE_BATTERY_DATABASE.length,
      data: VEHICLE_BATTERY_DATABASE,
    });
  });

  // Vehicle Makes
  app.get('/api/vehicles/makes', (_req, res) => {
    const makes = getUniqueMakes();

    res.json({
      success: true,
      data: makes,
    });
  });

  // Vehicle Models
  app.get('/api/vehicles/models', (req, res) => {
    const make = req.query.make as string;

    if (!make) {
      return res.status(400).json({
        success: false,
        error: 'Make query parameter required',
      });
    }

    const models = getModelsByMake(make);

    res.json({
      success: true,
      data: models,
    });
  });

  // Vehicle Years
  app.get('/api/vehicles/years', (req, res) => {
    const {
      make,
      model,
    } = req.query as Record<string, string>;

    if (!make || !model) {
      return res.status(400).json({
        success: false,
        error: 'Make and model query parameters required',
      });
    }

    const years = getYearsByMakeAndModel(make, model);

    res.json({
      success: true,
      data: years,
    });
  });

  // Vehicle Battery Specification
  app.get('/api/vehicles/:id', (req, res) => {
    const spec = findVehicleBatterySpecs(req.params.id);

    if (!spec) {
      return res.status(404).json({
        success: false,
        error: 'Vehicle specification not found',
      });
    }

    res.json({
      success: true,
      data: spec,
    });
  });

  // =========================================================
  // DIAGNOSTICS
  // =========================================================

  app.get('/api/problems', (_req, res) => {
    res.json({
      success: true,
      data: COMMON_CAR_PROBLEMS,
    });
  });

  app.post('/api/diagnose', (req, res) => {
    try {
      const {
        problemSlug,
        answers,
      } = req.body;

      const evaluation = evaluateDiagnosticAnswers(
        problemSlug,
        answers || {}
      );

      res.json({
        success: true,
        result: evaluation,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error?.message || 'Diagnostic evaluation error',
      });
    }
  });

  // =========================================================
  // AI BATTERY ASSISTANT - GEMINI
  // =========================================================

  let aiClient: GoogleGenAI | null = null;

  function getAIClient(): GoogleGenAI | null {
    if (!aiClient && process.env.GEMINI_API_KEY) {
      aiClient = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
      });
    }

    return aiClient;
  }

  app.post('/api/ai/diagnose', async (req, res) => {
    try {
      const {
        query,
        conversationHistory = [],
      } = req.body;

      if (!query) {
        return res.status(400).json({
          success: false,
          error: 'Query is required',
        });
      }

      const client = getAIClient();

      // -------------------------------------------------------
      // FALLBACK MODE
      // -------------------------------------------------------

      if (!client) {
        return res.json({
          success: true,
          answer:
            `[Deterministic Mode]: For diagnosing "${query}", our database recommends checking your resting 12V voltage (should be 12.4V-12.7V), checking terminal cleanliness, and performing an alternator output check (13.8V-14.4V while running). You can also run our automated diagnostic steps in the Diagnostic Hub.`,
          isFallback: true,
        });
      }

      // -------------------------------------------------------
      // AI SYSTEM INSTRUCTION
      // -------------------------------------------------------

      const systemInstruction =
        `You are the Bateri.com Master Automotive & Electrical Battery Specialist.

You provide precise, deterministic, safety-focused, and technically accurate battery advice for automotive, solar storage, marine, RV, and EV battery systems.

Always reference multimeter testing thresholds:
- 12.6V = approximately 100% State of Charge
- 12.2V = approximately 50% State of Charge
- Below 11.9V = discharged
- 13.8V-14.5V = typical alternator charging range

Keep answers structured with:

1. Direct Diagnostic Conclusion
2. Step-by-Step Testing Procedure
   - Include multimeter settings where appropriate
3. Safety Precaution

Never encourage unsafe electrical work.
If the user describes a potentially dangerous situation, clearly explain the safety precautions before giving diagnostic steps.`;

      // -------------------------------------------------------
      // CONVERSATION HISTORY
      // -------------------------------------------------------

      const contents = [
        ...conversationHistory.map(
          (item: {
            role: string;
            content: string;
          }) => ({
            role: item.role === 'user' ? 'user' : 'model',
            parts: [
              {
                text: item.content,
              },
            ],
          })
        ),

        {
          role: 'user',
          parts: [
            {
              text: query,
            },
          ],
        },
      ];

      // -------------------------------------------------------
      // GEMINI REQUEST
      // -------------------------------------------------------

      const response = await client.models.generateContent({
        model: 'gemini-2.5-flash',
        contents,
        config: {
          systemInstruction,
          temperature: 0.2,
        },
      });

      res.json({
        success: true,
        answer: response.text || 'No response generated.',
        isFallback: false,
      });

    } catch (error: any) {
      console.error('AI diagnosis error:', error);

      res.status(500).json({
        success: false,
        error:
          error?.message ||
          'Failed to process AI diagnosis request',
      });
    }
  });

  // =========================================================
  // VITE / STATIC HANDLING
  // =========================================================

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
      },
      appType: 'spa',
    });

    app.use(vite.middlewares);

  } else {
    const distPath = path.join(
      process.cwd(),
      'dist'
    );

    app.use(express.static(distPath));

    app.get('*', (_req, res) => {
      res.sendFile(
        path.join(
          distPath,
          'index.html'
        )
      );
    });
  }

  // =========================================================
  // START SERVER + AUTOMATICALLY OPEN BROWSER
  // =========================================================

  app.listen(PORT, '0.0.0.0', () => {
    const url = `http://localhost:${PORT}`;

    console.log('');
    console.log('==========================================');
    console.log('       BATERI.COM DEVELOPMENT SERVER');
    console.log('==========================================');
    console.log(`Local:   ${url}`);
    console.log(`API:     ${url}/api/health`);
    console.log('==========================================');
    console.log('');

    // Automatically open browser
    const command =
      process.platform === 'win32'
        ? `start "" "${url}"`
        : process.platform === 'darwin'
          ? `open "${url}"`
          : `xdg-open "${url}"`;

    exec(command, (error) => {
      if (error) {
        console.log(
          `Could not automatically open browser: ${error.message}`
        );
        console.log(`Please open ${url} manually.`);
      }
    });
  });
}

// ===========================================================
// START APPLICATION
// ===========================================================

startServer().catch((err) => {
  console.error(
    'Fatal error starting server:',
    err
  );

  process.exit(1);
});