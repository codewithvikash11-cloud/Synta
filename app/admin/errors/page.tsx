import { getRecentErrors } from '@/app/actions/admin';
import Link from 'next/link';

export default async function AdminErrorsQueue() {
    // Reuse the recent errors logic for now, but in a real app this would have pagination and filtering
    const errors = await getRecentErrors(50);

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-white">Work Queue</h1>
                <div className="flex gap-2">
                    <button className="px-4 py-2 bg-slate-800 text-slate-300 rounded hover:text-white">Filter: Unpublised</button>
                </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-950/50 text-slate-400 text-sm uppercase">
                        <tr>
                            <th className="p-4 font-medium">ID</th>
                            <th className="p-4 font-medium">Preview</th>
                            <th className="p-4 font-medium">Status</th>
                            <th className="p-4 font-medium text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-sm text-slate-300">
                        {errors.map((err: any) => (
                            <tr key={err._id} className="hover:bg-slate-800/50 transition">
                                <td className="p-4 font-mono text-xs text-slate-500">
                                    {err._id.substring(0, 8)}
                                </td>
                                <td className="p-4 font-mono truncate max-w-lg">
                                    {err.rawError.substring(0, 100)}...
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
                                <td className="p-4 text-right">
                                    <Link
                                        href={`/admin/errors/${err._id}`}
                                        className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded text-xs font-bold"
                                    >
                                        Review
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
