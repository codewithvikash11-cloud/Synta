import Link from 'next/link';
import { LayoutDashboard, ListTodo } from 'lucide-react';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-50 font-sans flex">
            {/* Sidebar */}
            <aside className="w-64 border-r border-slate-800 bg-slate-900 hidden md:flex flex-col">
                <div className="p-6 border-b border-slate-800">
                    <Link href="/admin/dashboard" className="text-xl font-bold text-white">
                        Synta Admin
                    </Link>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    <Link
                        href="/admin/dashboard"
                        className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white rounded-md transition-colors"
                    >
                        <LayoutDashboard className="w-5 h-5" />
                        Dashboard
                    </Link>
                    <Link
                        href="/admin/errors"
                        className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white rounded-md transition-colors"
                    >
                        <ListTodo className="w-5 h-5" />
                        Error Queue
                    </Link>
                </nav>
                <div className="p-4 border-t border-slate-800">
                    <div className="text-xs text-slate-500">v1.0.0 (Admin)</div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                {children}
            </main>
        </div>
    );
}
