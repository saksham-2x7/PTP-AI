'use client';
import { useState, useRef, useEffect } from 'react';
import { chatWithGemini, ChatMessage } from '@/lib/application/chat';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { BrainCircuit, Send, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function IntelligencePage() {
    const [messages, setMessages] = useState<ChatMessage[]>([{ role: 'model', content: 'MediBridge Intelligence Core online. State your query regarding medical protocols, HAZMAT, or triage guidelines.' }]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMsg = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setLoading(true);

        const res = await chatWithGemini(messages, userMsg);
        
        if (res.success && res.reply) {
            setMessages(prev => [...prev, { role: 'model', content: res.reply! }]);
        } else {
            setMessages(prev => [...prev, { role: 'model', content: `[SYSTEM ERROR] ${res.error}` }]);
        }
        setLoading(false);
    };

    return (
        <main className="flex-1 p-6 lg:p-10 flex flex-col min-h-0 relative z-10">
            <header className="mb-8 shrink-0">
                <h2 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
                    <BrainCircuit className="text-purple-500 w-8 h-8" /> TACTICAL INTELLIGENCE
                </h2>
                <p className="text-neutral-400 mt-2 font-mono text-xs uppercase tracking-widest">
                    Gemini-powered standard operating procedures
                </p>
            </header>

            <Card className="bg-neutral-950/40 backdrop-blur-xl border-white/10 shadow-2xl flex-1 flex flex-col min-h-0">
                <CardHeader className="border-b border-white/5 pb-4 shrink-0 bg-white/5">
                    <CardTitle className="text-white text-lg font-mono flex items-center gap-2">
                        <ShieldAlert className="w-4 h-4 text-neutral-400" /> SECURE COMMS LINK
                    </CardTitle>
                </CardHeader>
                
                <CardContent className="flex-1 overflow-y-auto p-6 space-y-6" ref={scrollRef}>
                    <AnimatePresence>
                        {messages.map((msg, i) => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`flex flex-col max-w-[80%] ${msg.role === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'}`}
                            >
                                <span className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${msg.role === 'user' ? 'text-blue-400' : 'text-purple-500'}`}>
                                    {msg.role === 'user' ? 'Dispatcher' : 'AI Core'}
                                </span>
                                <div className={`p-4 rounded-lg font-mono text-sm leading-relaxed border ${
                                    msg.role === 'user' 
                                    ? 'bg-blue-950/30 border-blue-900/50 text-blue-100' 
                                    : 'bg-purple-950/20 border-purple-900/30 text-purple-100 shadow-[0_0_15px_rgba(168,85,247,0.1)]'
                                }`}>
                                    {msg.content}
                                </div>
                            </motion.div>
                        ))}
                        {loading && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mr-auto items-start flex flex-col max-w-[80%]">
                                <span className="text-[10px] font-bold uppercase tracking-widest mb-1 text-purple-500">AI Core</span>
                                <div className="p-4 rounded-lg border bg-purple-950/20 border-purple-900/30 flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-bounce" />
                                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-bounce delay-75" />
                                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-bounce delay-150" />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </CardContent>

                <div className="p-4 border-t border-white/5 bg-black/40 shrink-0">
                    <form onSubmit={handleSend} className="flex gap-4">
                        <Textarea 
                            placeholder="Query medical protocols..."
                            className="flex-1 min-h-[60px] max-h-[120px] bg-black/60 border-white/10 text-white font-mono text-sm resize-none focus-visible:ring-purple-500/50"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(e); } }}
                        />
                        <Button type="submit" disabled={loading || !input.trim()} className="h-auto px-8 bg-purple-700 hover:bg-purple-600 text-white font-bold transition-all shadow-[0_0_20px_rgba(126,34,206,0.3)]">
                            <Send className="w-5 h-5" />
                        </Button>
                    </form>
                </div>
            </Card>
        </main>
    );
}
