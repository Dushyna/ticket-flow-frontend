import { createPortal } from 'react-dom';

type ConfirmModalProps = {
    title?: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
    isLoading?: boolean;
};

const ConfirmModal = ({
                          title = "Confirm action",
                          message,
                          confirmText = "Discard",
                          cancelText = "Cancel",
                          onConfirm,
                          onCancel,
                          isLoading = false,
                      }: ConfirmModalProps) => {
    const modalContent = (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
            {/* Overlay for closing */}
            <div className="absolute inset-0" onClick={onCancel} />

            <div className="relative w-full max-w-md rounded-2xl border border-slate-100 bg-white p-8 shadow-[0_20px_50px_rgba(0,0,0,0.1)] animate-in zoom-in-95 duration-200">
                {/* Icon & Title */}
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-amber-50 text-amber-500 text-xl">
                        ⚠️
                    </div>
                    <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                        {title}
                    </h2>
                </div>

                <p className="mb-8 text-sm text-slate-500 font-medium leading-relaxed">
                    {message}
                </p>

                <div className="flex justify-end gap-3">
                    {/* Cancel Button */}
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={isLoading}
                        className="px-5 py-2.5 text-sm font-bold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-all disabled:opacity-50"
                    >
                        {cancelText}
                    </button>

                    {/* Confirm (Action) Button */}
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="px-5 py-2.5 text-sm font-bold text-white bg-red-500 rounded-xl shadow-lg shadow-red-100 hover:bg-red-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2 min-w-[100px]"
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>Wait...</span>
                            </>
                        ) : (
                            confirmText
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
    return createPortal(modalContent, document.body);
};

export default ConfirmModal;
