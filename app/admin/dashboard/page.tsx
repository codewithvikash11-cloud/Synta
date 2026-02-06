import { getDashboardStats, getRecentErrors } from '@/app/actions/admin';

import { FileText, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default async function AdminDashboard() {
    const stats = await getDashboardStats();
    const recentErrors = await getRecentErrors();

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-8 text-white">Dashboard Overview</h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                <StatsCard
                    title="Submitted Today"
                    value={stats.todayErrors}
                    icon={<Clock className="text-blue-500" />}
                />
                <StatsCard
                    title="Pending Review"
                    value={stats.pendingErrors}
                    icon={<AlertTriangle className="text-yellow-500" />}
                />
                <StatsCard
                    title="Published"
                    value={stats.publishedErrors}
                    icon={<CheckCircle className="text-green-500" />}
                />
                <StatsCard
                    title="Total Errors"
                    value={stats.totalErrors}
                    icon={<FileText className="text-slate-500" />}
                />
            </div>

            <h2 className="text-xl font-bold mb-6 text-white">Recent Activity (Latest 10)</h2>

            <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-950/50 text-slate-400 text-sm uppercase">
                        <tr>
                            <th className="p-4 font-medium">Original Error</th>
                            <th className="p-4 font-medium">Status</th>
                            <th className="p-4 font-medium">Date</th>
                            <th className="p-4 font-medium text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-sm text-slate-300">
                        {recentErrors.map((err: any) => (
                            <tr key={err._id} className="hover:bg-slate-800/50 transition">
                                <td className="p-4 font-mono truncate max-w-md">
                                    {err.rawError.substring(0, 80)}...
                                </td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold
                    ${err.status === 'PUBLISHED' ? 'bg-green-500/20 text-green-400' :
                                            err.status === 'REJECTED' ? 'bg-red-500/20 text-red-400' :
                                                'bg-yellow-500/20 text-yellow-400'}
                  `}>
                                        {err.status}
                                    </span>
                                </td>
                                <td className="p-4 text-slate-500">
                                    {new Date(err.createdAt).toLocaleDateString()}
                                </td>
                                <td className="p-4 text-right">
                                    <Link
                                        href={`/admin/errors/${err._id}`}
                                        className="text-blue-400 hover:text-blue-300 font-medium"
                                    >
                                        Review
                                    </Link>
                                </td>
                            </tr>
                        ))}
                        {recentErrors.length === 0 && (
                            <tr>
                                <td colSpan={4} className="p-8 text-center text-slate-500">No errors found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function StatsCard({ title, value, icon }: any) {
    return (
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-lg flex items-start justify-between">
            <div>
                <p className="text-slate-400 text-sm mb-1">{title}</p>
                <p className="text-3xl font-bold text-white">{value}</p>
            </div>
            <div className="p-3 bg-slate-800 rounded-md">
                {icon}
            </div>
        </div>
    );
}
