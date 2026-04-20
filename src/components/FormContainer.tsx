import React from "react";

type FormContainerProps = {
    title: string;
    description?: string;
    children: React.ReactNode;
    onClose: () => void;
    submitButton?: React.ReactNode;
    errorMessage?: string;
};

const FormContainer = ({
                           title,
                           description,
                           children,
                           onClose,
                           submitButton,
                           errorMessage,
                       }: FormContainerProps) => {
    return (
        <div className="relative mx-auto max-w-md w-full p-8 rounded-2xl bg-white/10 backdrop-blur-xl shadow-2xl  border border-white/20 text-center animate-in fade-in duration-500">

            {/* Close button */}
            <button
                onClick={onClose}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors text-xl font-light"
                aria-label="Close"
            >
                ×
            </button>

            {/* Header */}
            <div className="space-y-2 text-center mb-8">
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                    {title}
                </h1>
                {description && (
                    <p className="text-sm text-slate-500 font-medium">
                        {description}
                    </p>
                )}

                {/* Error message */}
                {errorMessage && (
                    <div className="mt-4 rounded-xl bg-red-50 p-4 text-sm text-red-600 border border-red-100 font-semibold flex items-center gap-2">
                        <span className="text-lg">⚠️</span>
                        {errorMessage}
                    </div>
                )}
            </div>

            {/* Form content */}
            <div className="space-y-5">
                {children}
            </div>

            {/* Submit button container */}
            {submitButton && (
                <div className="mt-8 pt-2">
                    {submitButton}
                </div>
            )}
        </div>
    );
};

export default FormContainer;
