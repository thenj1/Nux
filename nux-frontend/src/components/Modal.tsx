import type { ReactNode } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
    title: string;
    children: ReactNode;
    onClose: () => void;
}

function Modal({ title, children, onClose }: ModalProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 transform transition-all">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-[#0f172a] text-lg font-bold">
                        {title}
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>
                <div>
                    {children}
                </div>
            </div>
        </div>
    );
}

export default Modal;
