import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, User, Sparkles, AlertTriangle, ShieldCheck, RefreshCw, Wrench, Zap } from 'lucide-react';
import { Breadcrumbs } from '../ui/Breadcrumbs';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  citations?: string[];
  safetyWarning?: string;
}

const PROMPT_SUGGESTIONS = [
  'My 2019 Toyota Corolla won\'t start and makes a rapid clicking sound. What is the cause?',
  'How do I calculate what size 48V LiFePO4 battery bank is needed for a 5 kW solar array?',
  'Why is my car battery going flat after 3 days of not driving? How to test for parasitic drain?',
  'Can I upgrade my flooded car battery to an AGM without damaging the alternator?',
];

export const BateriAIAssistant: React.FC<{ onNavigate: (tab: any, subTab?: string, slug?: string) => void }> = ({
  onNavigate,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `Hello! I am **Bateri AI**, your specialized battery and automotive electrical diagnostic assistant.

I can help you:
- Diagnose starting problems, clicking noises, or slow cranking
- Track down parasitic battery drains with multimeter testing steps
- Size off-grid solar battery banks, inverters, and DC wiring
- Look up OEM battery group sizes and BMS registration procedures

How can I assist your engineering or vehicle diagnostic project today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: query.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      // Call secure server-side API endpoint
      const response = await fetch('/api/ai/diagnose', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: query.trim(),
          history: messages.map((m) => ({
            role: m.sender === 'user' ? 'user' : 'model',
            parts: [{ text: m.text }],
          })),
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      const data = await response.json();

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: data.reply || 'Diagnostic evaluation completed.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        citations: data.citations || ['Bateri.com Grounded Battery Knowledge Base'],
        safetyWarning: data.safetyWarning,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      // Deterministic engineering fallback if server endpoint or key is unavailable
      const fallbackReply = generateOfflineDiagnostic(query);
      const fallbackMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: fallbackReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        citations: ['Bateri.com Offline Knowledge Repository (SAE J537 / BCI)'],
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Deterministic local fallback responses for offline or unconfigured environments
   */
  const generateOfflineDiagnostic = (prompt: string): string => {
    const p = prompt.toLowerCase();
    if (p.includes('click') || p.includes('won\'t start') || p.includes('starter')) {
      return `### Diagnostic Assessment: Rapid Starter Clicking
**Primary Diagnosis:** Severely discharged battery or corroded high-resistance terminal connections.

**Root Cause Analysis:**
When you turn the key, the starter solenoid energizes, pulling ~30A and engaging the starter motor gear with the flywheel. However, when the heavy starter motor attempts to draw 150A–200A, the depleted battery voltage collapses below 9.0V. The solenoid drops out immediately, the load releases, voltage rebounds slightly, and the solenoid engages again — creating the rapid *click-click-click* cycle.

**Step-by-Step Action:**
1. Check battery resting open-circuit voltage with a multimeter. A healthy battery should read **12.6V+**.
2. Clean battery post corrosion (white/blue copper sulfate powder) using baking soda and water.
3. Perform a jump-start or connect a 10A smart charger for 2–4 hours.`;
    }

    if (p.includes('drain') || p.includes('parasitic') || p.includes('flat') || p.includes('overnight')) {
      return `### Parasitic Battery Drain Troubleshooting Guide
**Standard Standby Threshold:** Normal modern vehicle standby draw is **20mA to 50mA** (0.020A to 0.050A). Anything over 80mA will deplete a 60Ah battery in 4 to 6 days.

**Multimeter Current Test Procedure:**
1. Ensure all vehicle doors are latched and key fob is at least 20 feet away.
2. Disconnect the negative (-) battery terminal.
3. Place a digital multimeter set to the **10A DC** setting in series between the negative battery post and the disconnected negative cable clamp.
4. Wait 30 minutes for CAN-bus computers to enter deep sleep mode.
5. If current exceeds 0.050A (50mA), pull fuses one at a time from under-hood and interior fuse boxes until the current drops to normal.`;
    }

    return `### Battery & Electrical Engineering Advice
Thank you for your question regarding: "${prompt}".

**Key Electrical Principles:**
- **Power Law:** $Watts = Volts \\times Amps$.
- **Usable Capacity:** Discharging standard lead-acid batteries beyond 50% Depth of Discharge (DoD) causes rapid plate sulfation. LiFePO4 lithium batteries can safely discharge up to 90% DoD.
- **Charging Voltage:** Standard automotive alternators should output **13.8V to 14.5V DC** at idle. Voltages above 15.0V indicate a failed voltage regulator that can boil battery electrolyte.

Feel free to use our interactive calculators on the navigation bar for exact calculations!`;
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[{ label: 'Bateri AI Diagnostic Assistant' }]}
        onNavigate={onNavigate}
      />

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col h-[750px] max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-xs">
              <Bot className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-slate-900">Bateri AI Diagnostic Assistant</h1>
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 border border-emerald-200">
                  Grounded Expert
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Automotive electrical engineering & deterministic battery troubleshooting
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              setMessages([
                {
                  id: 'reset',
                  sender: 'assistant',
                  text: 'Diagnostic session refreshed. How can I help you today?',
                  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                },
              ])
            }
            className="rounded-lg border border-slate-200 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors"
            title="Clear Chat History"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'assistant' && (
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                  <Bot className="h-4 w-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed shadow-2xs ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : 'bg-slate-50 text-slate-800 border border-slate-200/80 rounded-bl-none'
                }`}
              >
                <div className="whitespace-pre-line font-normal space-y-2">
                  {msg.text}
                </div>

                {msg.safetyWarning && (
                  <div className="mt-3 rounded-lg border border-red-200 bg-red-50 p-2.5 text-[11px] text-red-900 flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
                    <span>{msg.safetyWarning}</span>
                  </div>
                )}

                {msg.citations && msg.citations.length > 0 && (
                  <div className="mt-3 border-t border-slate-200/60 pt-2 text-[10px] text-slate-500">
                    <span className="font-semibold">Sources:</span> {msg.citations.join(' · ')}
                  </div>
                )}

                <div
                  className={`mt-1.5 text-[10px] text-right ${
                    msg.sender === 'user' ? 'text-blue-100' : 'text-slate-400'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>

              {msg.sender === 'user' && (
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-slate-900 text-white">
                  <User className="h-4 w-4" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 items-center text-xs text-slate-500 animate-pulse">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <Bot className="h-4 w-4" />
              </div>
              <span>Analyzing diagnostic telemetry and engineering formulas...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Prompt Suggestions */}
        <div className="py-2 border-t border-slate-100 flex-shrink-0">
          <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 mb-1.5">
            <Sparkles className="h-3 w-3 text-amber-500" />
            <span>Suggested Diagnostic Queries:</span>
          </div>
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {PROMPT_SUGGESTIONS.map((sug, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(sug)}
                disabled={loading}
                className="whitespace-nowrap rounded-lg border border-slate-200 bg-slate-50/80 px-2.5 py-1 text-[11px] text-slate-700 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-colors disabled:opacity-50"
              >
                {sug}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="relative mt-2 flex items-center flex-shrink-0"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            placeholder="Ask a diagnostic question (e.g. car clicking, battery sizing, voltage drop)..."
            className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-4 pr-12 text-xs text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:outline-none disabled:bg-slate-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="absolute right-2 flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-40 transition-colors"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
