export function AdSlot({ position }: { position: 'header' | 'sidebar' | 'content' }) {
    return (
        <div className={`
      bg-slate-900/50 border border-slate-800 rounded-md flex items-center justify-center text-slate-700 text-xs uppercase tracking-widest font-bold
      ${position === 'header' ? 'w-full h-24 my-6' : ''}
      ${position === 'sidebar' ? 'w-full h-[600px]' : ''}
      ${position === 'content' ? 'w-full h-64 my-8' : ''}
    `}>
            Ad Space ({position})
        </div>
    );
}
