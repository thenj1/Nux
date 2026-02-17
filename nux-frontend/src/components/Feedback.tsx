import { useEffect } from 'react';
import { X, CheckCircle2, AlertCircle } from 'lucide-react';

interface FeedbackProps {
    message: string;
    type: 'success' | 'error';
    onClose: () => void;
}

function Feedback({ message, type, onClose }: FeedbackProps) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 4000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const isSuccess = type === 'success';

    return (
        <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl shadow-slate-200/50 border animate-in slide-in-from-top-2 fade-in duration-300 ${isSuccess
                ? 'bg-emerald-50 border-emerald-100 text-emerald-800'
                : 'bg-red-50 border-red-100 text-red-800'
            }`}>
            {isSuccess ? (
                <CheckCircle2 size={20} className="text-emerald-500 flex-shrink-0" />
            ) : (
                <AlertCircle size={20} className="text-red-500 flex-shrink-0" />
            )}

            <span className="text-sm font-medium">{message}</span>

            <button
                onClick={onClose}
                className={`ml-2 p-1 rounded-lg transition-colors cursor-pointer ${isSuccess
                        ? 'hover:bg-emerald-100 text-emerald-600'
                        : 'hover:bg-red-100 text-red-600'
                    }`}
            >
                <X size={16} />
            </button>
        </div>
    );
}

export default Feedback;
