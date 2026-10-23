import React, { useState } from 'react';
import { Send, CheckCircle2, Copy, Check, ExternalLink, ShieldAlert, AlertCircle, Bot, RefreshCw } from 'lucide-react';
import { wayfarerApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export function TelegramSetupPage() {
  const { user, updateTelegramStatus } = useAuth();
  const [tokenInput, setTokenInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedStep, setCopiedStep] = useState<number | null>(null);

  const isConnected = !!user?.telegram?.connected;
  const botUsername = user?.telegram?.botUsername || 'WayfarerTripGuideBot';

  const copyToClipboard = (text: string, stepIndex: number) => {
    navigator.clipboard.writeText(text);
    setCopiedStep(stepIndex);
    setTimeout(() => setCopiedStep(null), 2000);
  };

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tokenInput.trim()) return;

    setErrorMsg(null);
    setIsSubmitting(true);

    try {
      const res = await wayfarerApi.connectTelegram(tokenInput.trim());
      if (res.success) {
        updateTelegramStatus(true, res.botUsername);
        // Wipe token immediately from memory per strict security rule
        setTokenInput('');
      } else {
        setErrorMsg('Invalid token. Please check the token provided by @BotFather.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to connect to Telegram bot.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDisconnect = async () => {
    setIsSubmitting(true);
    try {
      await wayfarerApi.disconnectTelegram();
      updateTelegramStatus(false, undefined);
    } catch (e) {
      console.warn('Disconnect error:', e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const telegramCommands = [
    { command: '/start', description: 'Connect your trip to this chat' },
    { command: '/today', description: "What's planned for today" },
    { command: '/day 2', description: 'Show plan for day 2' },
    { command: '/hotel', description: 'Your hotel details and directions' },
    { command: '/nearby', description: 'Places and food near you' },
    { command: '/budget', description: 'Budget summary for this trip' },
    { command: '/help', description: 'List commands' }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F5F3FF] border border-[#EDE9FE] text-[#6D28D9] text-xs font-semibold mb-3">
          <Send className="w-3.5 h-3.5" />
          <span>Telegram Integration</span>
        </div>
        <h1 className="text-3xl font-bold font-heading text-[#1F1637]">
          Personal Telegram Trip Assistant
        </h1>
        <p className="text-sm text-[#6B6385] mt-2 max-w-2xl leading-relaxed">
          Receive real-time directions, day plans, hotel check-in details, and local food suggestions right inside Telegram while exploring your destination.
        </p>
      </div>

      {/* Live Status Card */}
      <div className="p-6 bg-white rounded-2xl border border-[#EDE9FE] shadow-wayfarer mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
              isConnected ? 'bg-green-100 text-[#16A34A]' : 'bg-[#F5F3FF] text-[#6D28D9]'
            }`}>
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-bold text-base text-[#1F1637]">
                  Bot Status
                </h3>
                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                  isConnected ? 'bg-green-100 text-[#16A34A]' : 'bg-gray-100 text-[#6B6385]'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-[#16A34A]' : 'bg-gray-400'}`} />
                  {isConnected ? `Connected as @${botUsername}` : 'Not Connected'}
                </span>
              </div>
              <p className="text-xs text-[#6B6385] mt-0.5">
                {isConnected
                  ? 'Your trip is synced. Open Telegram and send /today to get started.'
                  : 'Follow the 3-step checklist below to connect your bot.'}
              </p>
            </div>
          </div>

          {isConnected && (
            <div className="flex items-center gap-3">
              <a
                href={`https://t.me/${botUsername}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#6D28D9] text-white text-xs font-semibold rounded-xl hover:bg-[#5B21B6] transition-colors shadow-sm"
              >
                <span>Open in Telegram</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <button
                onClick={handleDisconnect}
                disabled={isSubmitting}
                className="px-4 py-2 text-xs font-semibold text-[#DC2626] border border-red-200 hover:bg-red-50 rounded-xl transition-colors"
              >
                Disconnect
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Left Column: 3-Step Setup Guide */}
        <div className="space-y-6">
          <h2 className="text-lg font-bold font-heading text-[#1F1637]">
            3-Step BotFather Setup
          </h2>

          {/* Step 1 */}
          <div className="p-4 bg-[#F5F3FF] rounded-2xl border border-[#EDE9FE] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#6D28D9] uppercase tracking-wider">Step 1</span>
              <a
                href="https://t.me/BotFather"
                target="_blank"
                rel="noreferrer"
                className="text-xs font-semibold text-[#6D28D9] hover:underline inline-flex items-center gap-1"
              >
                Open @BotFather <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <p className="text-xs text-[#1F1637]">
              Open Telegram, search for <strong>@BotFather</strong>, and send the new bot command:
            </p>
            <div className="flex items-center justify-between bg-white px-3 py-2 rounded-xl border border-[#EDE9FE] text-xs font-mono text-[#6D28D9]">
              <span>/newbot</span>
              <button
                onClick={() => copyToClipboard('/newbot', 1)}
                className="text-[#6B6385] hover:text-[#1F1637] p-1"
                title="Copy command"
              >
                {copiedStep === 1 ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Step 2 */}
          <div className="p-4 bg-[#F5F3FF] rounded-2xl border border-[#EDE9FE] space-y-2">
            <span className="text-xs font-bold text-[#6D28D9] uppercase tracking-wider">Step 2</span>
            <p className="text-xs text-[#1F1637]">
              Give your bot a friendly name (e.g. <em>My Wayfarer Guide</em>) and a unique username ending in <code>bot</code> (e.g. <em>sakthi_wayfarer_bot</em>).
            </p>
          </div>

          {/* Step 3 & Token Form */}
          <div className="p-4 bg-[#F5F3FF] rounded-2xl border border-[#EDE9FE] space-y-3">
            <span className="text-xs font-bold text-[#6D28D9] uppercase tracking-wider">Step 3</span>
            <p className="text-xs text-[#1F1637]">
              Copy the HTTP API Token provided by BotFather and paste it below:
            </p>

            <form onSubmit={handleConnect} className="space-y-3">
              {errorMsg && (
                <div className="flex items-center gap-2 p-2.5 bg-red-50 text-[#DC2626] rounded-xl text-xs border border-red-200">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div>
                <input
                  type="password"
                  value={tokenInput}
                  onChange={(e) => setTokenInput(e.target.value)}
                  placeholder="e.g. 7123456789:AAFlkjw92kd_EXAMPLE..."
                  className="w-full px-3.5 py-2.5 text-xs bg-white rounded-xl border border-[#EDE9FE] focus:outline-none focus:border-[#6D28D9] text-[#1F1637] font-mono"
                  required
                />
              </div>

              <div className="flex items-center gap-2 text-[11px] text-[#6B6385]">
                <ShieldAlert className="w-3.5 h-3.5 text-[#6D28D9] shrink-0" />
                <span>Encrypted with AES-256-GCM on backend. Never stored client-side.</span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !tokenInput.trim()}
                className="w-full py-2.5 bg-[#6D28D9] text-white text-xs font-semibold rounded-xl hover:bg-[#5B21B6] transition-colors disabled:opacity-50 shadow-sm"
              >
                {isSubmitting ? 'Verifying & Registering Webhook...' : 'Connect Telegram Bot'}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Supported Commands */}
        <div>
          <h2 className="text-lg font-bold font-heading text-[#1F1637] mb-4">
            Available Bot Commands
          </h2>
          <div className="bg-white rounded-2xl border border-[#EDE9FE] p-5 shadow-wayfarer space-y-3">
            <p className="text-xs text-[#6B6385] mb-2 leading-relaxed">
              Once connected, you can chat with your personal assistant on the go. Responses are grounded strictly in your verified itinerary.
            </p>

            <div className="divide-y divide-[#EDE9FE]">
              {telegramCommands.map((cmd) => (
                <div key={cmd.command} className="py-2.5 flex items-center justify-between text-xs">
                  <code className="font-mono font-semibold text-[#6D28D9] bg-[#F5F3FF] px-2 py-0.5 rounded">
                    {cmd.command}
                  </code>
                  <span className="text-[#6B6385] text-right">{cmd.description}</span>
                </div>
              ))}
            </div>

            <div className="mt-4 p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-[#1F1637]">
              <strong>Security Invariant:</strong> The bot token is held only in encrypted backend memory. The webhook verifies the secret header <code>x-telegram-bot-api-secret-token</code> on every message.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
