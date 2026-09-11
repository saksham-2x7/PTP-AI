'use client';
import { useState, useEffect } from 'react';
import { generateShiftSummary } from '@/lib/application/analytics';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, FileText, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AnalyticsPage() {
    const [summary, setSummary] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const loadSummary = async () => {
        setLoading(true);
        const res = await generateShiftSummary();
        if (res.success) setSummary(res.summary!);
        else setSummary(`[SYSTEM ERROR] ${res.error}`);
        setLoading(false);
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadSummary();
    }, []);

    return (
        <main className="flex-1 p-6 lg:p-10 flex flex-col min-h-0 relative z-10">
            <header className="mb-8 flex justify-between items-end shrink-0">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
                        <BarChart3 className="text-orange-500 w-8 h-8" /> SHIFT ANALYTICS
                    </h2>
                    <p className="text-neutral-400 mt-2 font-mono text-xs uppercase tracking-widest">
                        AI-Generated Post-Action Reports
                    </p>
                </div>
                <Button 
                    variant="outline" 
                    onClick={loadSummary}
                    disabled={loading}
                    className="border-white/10 bg-black/40 text-neutral-300 hover:text-white hover:bg-white/10 font-mono text-xs"
                >
                    <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                    REGENERATE REPORT
                </Button>
            </header>

            <div className="grid grid-cols-1 gap-8 flex-1 min-h-0">
                <Card className="bg-neutral-950/40 backdrop-blur-xl border-white/10 shadow-2xl flex flex-col h-fit max-h-full">
                    <CardHeader className="border-b border-white/5 pb-4 shrink-0 bg-white/5">
                        <CardTitle className="text-white text-lg font-mono flex items-center gap-2">
                            <FileText className="w-5 h-5 text-orange-400" /> TACTICAL SHIFT SUMMARY
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 overflow-y-auto">
                        {loading ? (
                            <div className="space-y-4 animate-pulse">
                                <div className="h-4 bg-orange-900/20 rounded w-3/4"></div>
                                <div className="h-4 bg-orange-900/20 rounded w-full"></div>
                                <div className="h-4 bg-orange-900/20 rounded w-5/6"></div>
                                <div className="h-4 bg-orange-900/20 rounded w-2/3 mt-8"></div>
                                <div className="h-4 bg-orange-900/20 rounded w-full"></div>
                            </div>
                        ) : summary ? (
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="prose prose-invert prose-orange max-w-none font-mono text-sm leading-loose text-neutral-300"
                            >
                                {summary.split('\n').map((paragraph, idx) => (
                                    <p key={idx} className="mb-4">{paragraph}</p>
                                ))}
                            </motion.div>
                        ) : null}
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}
