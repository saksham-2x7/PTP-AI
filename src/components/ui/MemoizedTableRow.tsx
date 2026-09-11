'use client';
import React from 'react';
import { Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export const MemoizedTableRow = React.memo(function MemoizedTableRow({ record }: { record: any }) {
    return (
        <tr className="hover:bg-white/5 transition-colors group">
            <td className="px-6 py-4 font-mono text-xs text-neutral-400 whitespace-nowrap">
                <div className="flex items-center gap-2">
                    <Clock className="w-3 h-3" />
                    <span suppressHydrationWarning>{new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Kolkata', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true }).format(new Date(record.timestamp))}</span>
                </div>
            </td>
            <td className="px-6 py-4">
                <Badge variant="outline" className={
                    record.triageData.severityLevel === 1 ? 'border-red-900 text-red-500 bg-red-950/30 shadow-[0_0_15px_rgba(239,68,68,0.2)]' :
                    record.triageData.severityLevel === 2 ? 'border-orange-900 text-orange-500 bg-orange-950/30' :
                    'border-yellow-900 text-yellow-500 bg-yellow-950/30'
                }>
                    PRIORITY {record.triageData.severityLevel}
                </Badge>
            </td>
            <td className="px-6 py-4 max-w-xs">
                <p className="text-white font-mono text-xs truncate mb-1">{record.triageData.patientVitals}</p>
                <div className="flex flex-wrap gap-1">
                    {record.triageData.extractedSymptoms?.slice(0, 2).map((s: string, i: number) => (
                        <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-neutral-300 font-mono truncate max-w-[100px]">{s}</span>
                    ))}
                    {record.triageData.extractedSymptoms?.length > 2 && <span className="text-[10px] text-neutral-500 font-mono">+{record.triageData.extractedSymptoms.length - 2}</span>}
                </div>
            </td>
            <td className="px-6 py-4">
                <div className="flex flex-col gap-1 font-mono text-xs">
                    <span className="text-blue-400">{record.erpData?.assignedAmbulance}</span>
                    <span className="text-purple-400">{record.erpData?.bedId}</span>
                </div>
            </td>
            <td className="px-6 py-4 font-mono text-xs text-green-500 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                {record.erpData?.status}
            </td>
        </tr>
    );
});
