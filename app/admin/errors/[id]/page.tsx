'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getErrorById, updateErrorStatus } from '@/app/actions/updateError';
import { Save, Check, X, AlertTriangle } from 'lucide-react';

export default function ReviewPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const [errorData, setErrorData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editableSolution, setEditableSolution] = useState<any>(null);

    useEffect(() => {
        params.then(unwrappedParams => {
            getErrorById(unwrappedParams.id).then(data => {
                setErrorData(data);
                setEditableSolution(data?.aiSolution || {});
                setLoading(false);
            });
        });
    }, [params]);

    const handleSave = async (status: string) => {
        setSaving(true);
        await updateErrorStatus(errorData._id, status, editableSolution);
        setSaving(false);
        if (status === 'PUBLISHED' || status === 'REJECTED') {
            router.push('/admin/errors');
        } else {
            // Just refresh local state for Draft save
            router.refresh();
        }
    };

    const updateField = (field: string, value: any) => {
        setEditableSolution({ ...editableSolution, [field]: value });
    };

    const updateStep = (index: number, value: string) => {
        const newSteps = [...(editableSolution.steps || [])];
        newSteps[index] = value;
        updateField('steps', newSteps);
    };

    if (loading) return <div className="p-8 text-white">Loading...</div>;
    if (!errorData) return <div className="p-8 text-white">Error not found</div>;

    return (
        <div className="h-screen flex flex-col bg-slate-950">
            {/* Header Toolbar */}
            <header className="px-6 py-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <h1 className="text-lg font-bold text-white">Review Error <span className="text-slate-500 text-sm font-mono">#{errorData._id.substring(0, 8)}</span></h1>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold
                ${errorData.status === 'PUBLISHED' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}
            `}>
                        {errorData.status}
                    </span>
                </div>

                <div className="flex gap-3">
                    <button
                        disabled={saving}
                        onClick={() => handleSave('UNPUBLISHED')}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded text-sm font-medium transition-colors"
                    >
                        <Save className="w-4 h-4" /> Save Draft
                    </button>
                    <button
                        disabled={saving}
                        onClick={() => handleSave('REJECTED')}
                        className="flex items-center gap-2 px-4 py-2 bg-red-900/30 hover:bg-red-900/50 text-red-200 border border-red-900/50 rounded text-sm font-medium transition-colors"
                    >
                        <X className="w-4 h-4" /> Reject
                    </button>
                    <button
                        disabled={saving}
                        onClick={() => handleSave('PUBLISHED')}
                        className="flex items-center gap-2 px-6 py-2 bg-green-600 hover:bg-green-500 text-white rounded text-sm font-medium shadow-lg shadow-green-900/20 transition-colors"
                    >
                        <Check className="w-4 h-4" /> Publish
                    </button>
                </div>
            </header>

            {/* Main Split View */}
            <div className="flex-1 flex overflow-hidden">

                {/* Left Panel: Original Input */}
                <div className="w-1/2 p-6 overflow-y-auto border-r border-slate-800 bg-slate-950">
                    <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Original User Input</h2>
                    <div className="bg-slate-900 p-4 rounded-md border border-slate-800">
                        <pre className="text-xs font-mono text-white whitespace-pre-wrap break-all">
                            {errorData.rawError}
                        </pre>
                    </div>

                    <div className="mt-8">
                        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">System Metadata</h2>
                        <div className="space-y-2 text-sm text-slate-300">
                            <div className="flex justify-between">
                                <span>Hash</span>
                                <span className="font-mono text-slate-500">{errorData.hash.substring(0, 12)}...</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Created</span>
                                <span>{new Date(errorData.createdAt).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Language</span>
                                <span>{errorData.language || 'Unknown'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Panel: AI Solution Editor */}
                <div className="w-1/2 p-6 overflow-y-auto bg-slate-925">
                    <h2 className="text-sm font-semibold text-blue-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                        AI Generated Content <span className="text-xs normal-case text-slate-500">(Editable)</span>
                    </h2>

                    <div className="space-y-6">

                        {/* Title */}
                        <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1">SEO Title (H1)</label>
                            <input
                                type="text"
                                value={editableSolution.title || ''}
                                onChange={(e) => updateField('title', e.target.value)}
                                className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white text-lg font-bold focus:border-blue-500 focus:outline-none"
                            />
                        </div>

                        {/* Explanation */}
                        <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1">Explanation</label>
                            <textarea
                                value={editableSolution.explanation || ''}
                                onChange={(e) => updateField('explanation', e.target.value)}
                                rows={3}
                                className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-300 focus:border-blue-500 focus:outline-none"
                            />
                        </div>

                        {/* Root Cause */}
                        <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1">Root Cause</label>
                            <textarea
                                value={editableSolution.rootCause || ''}
                                onChange={(e) => updateField('rootCause', e.target.value)}
                                rows={2}
                                className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-300 focus:border-blue-500 focus:outline-none"
                            />
                        </div>

                        {/* Steps */}
                        <div>
                            <label className="block text-xs font-medium text-slate-500 mb-2">Fix Steps</label>
                            <div className="space-y-2">
                                {editableSolution.steps?.map((step: string, idx: number) => (
                                    <div key={idx} className="flex gap-2">
                                        <span className="text-slate-500 py-2">{idx + 1}.</span>
                                        <input
                                            type="text"
                                            value={step}
                                            onChange={(e) => updateStep(idx, e.target.value)}
                                            className="flex-1 bg-slate-900 border border-slate-700 rounded p-2 text-slate-300 focus:border-blue-500 focus:outline-none"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Code Fix */}
                        <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1">Fixed Code</label>
                            <textarea
                                value={editableSolution.fixedCode || ''}
                                onChange={(e) => updateField('fixedCode', e.target.value)}
                                rows={8}
                                className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-green-400 font-mono text-sm focus:border-blue-500 focus:outline-none"
                                spellCheck={false}
                            />
                        </div>

                        {/* Prevention */}
                        <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1">Prevention Tips</label>
                            <textarea
                                value={editableSolution.prevention || ''}
                                onChange={(e) => updateField('prevention', e.target.value)}
                                rows={2}
                                className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-300 focus:border-blue-500 focus:outline-none"
                            />
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
