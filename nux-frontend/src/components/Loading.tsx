import { Loader2 } from 'lucide-react';

function Loading() {
    return (
        <div className="flex flex-col items-center justify-center p-8 space-y-3">
            <Loader2 size={40} className="text-blue-500 animate-spin" />
            <p className="text-slate-500 text-sm font-medium animate-pulse">Loading...</p>
        </div>
    );
}

export default Loading;
