import { useEffect } from 'react';

interface FeedbackProps {
    message: string;
    type: 'success' | 'error';
    onClose: () => void;
}

function Feedback({ message, type, onClose }: FeedbackProps) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className={`feedback feedback-${type}`}>
            <span>{message}</span>
            <button className="feedback-close" onClick={onClose}>X</button>
        </div>
    );
}

export default Feedback;
