import type { ReactNode } from 'react';

interface ModalProps {
    title: string;
    children: ReactNode;
    onClose: () => void;
}

function Modal({ title, children, onClose }: ModalProps) {
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-card" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{title}</h2>
                    <button className="modal-close" onClick={onClose}>X</button>
                </div>
                <div className="modal-body">
                    {children}
                </div>
            </div>
        </div>
    );
}

export default Modal;
