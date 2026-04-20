import {type FormikValues, useFormik, type FormikHelpers} from "formik";
import * as Yup from "yup";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import FormContainer from "./FormContainer";
import ConfirmModal from "./ConfirmModal.tsx";
import type {FieldConfig} from "./types";
import {getErrorMessage} from "../utils/utils";
import { useTranslation } from 'react-i18next';

type DynamicFormProps<T extends FormikValues> = {
    title: string;
    description?: string;
    fields: FieldConfig[];
    initialValues: T;
    validationSchema: Yup.AnyObjectSchema;
    onSubmit: (values: T, formikHelpers: FormikHelpers<T>) => void;
    onClose: () => void;
    submitText?: string;
    errorMessage?: string;
    isLoading?: boolean;
};

function DynamicForm<T extends FormikValues>({
                                                 title,
                                                 description,
                                                 fields,
                                                 initialValues,
                                                 validationSchema,
                                                 onSubmit,
                                                 onClose,
                                                 submitText,
                                                 errorMessage,
                                                 isLoading,
                                             }: DynamicFormProps<T>) {
    const { t } = useTranslation();

    const formik = useFormik<T>({
        initialValues,
        validationSchema,
        onSubmit,
        validateOnChange: true,
        validateOnBlur: true,
    });

    const [showConfirm, setShowConfirm] = useState(false);
    const [passwordVisibility, setPasswordVisibility] = useState<Record<string, boolean>>({});
    const navigate = useNavigate();

    const finalSubmitText = submitText || t('common.submit');
    const finalProcessingText = t('common.processing');

    const togglePassword = (fieldName: string) => {
        setPasswordVisibility(prev => ({
            ...prev,
            [fieldName]: !prev[fieldName]
        }));
    };

    const handleClose = () => {
        if (formik.dirty) {
            setShowConfirm(true);
            return;
        }
        onClose();
    };

    return (
        <FormContainer
            title={title}
            description={description}
            onClose={handleClose}
            errorMessage={errorMessage}
            submitButton={
                <button
                    disabled={isLoading}
                    type="submit"
                    onClick={() => formik.handleSubmit()}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? finalProcessingText  : finalSubmitText}
                </button>
            }
        >
            <div className="space-y-5 p-10 bg-white/10 backdrop-blur-xl shadow-2xl rounded-[40px] border border-white/20 text-center animate-in fade-in duration-500">
                {fields.map((field) => (
                    <div className="space-y-1.5" key={field.name}>
                        <label className="block text-sm font-semibold text-slate-700">
                            {field.label}
                        </label>

                        <div className="relative">
                            {field.type === "textarea" ? (
                                <textarea
                                    {...formik.getFieldProps(field.name)}
                                    rows={field.rows || 4}
                                    placeholder={field.placeholder}
                                    className={`w-full px-4 py-2.5 text-sm rounded-xl border bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
                                        formik.touched[field.name] && formik.errors[field.name]
                                            ? "border-red-300 focus:ring-red-100"
                                            : "border-slate-200 focus:ring-indigo-100 focus:border-indigo-500"
                                    }`}
                                />
                            ) : (
                                <div className="relative">
                                    <input
                                        {...formik.getFieldProps(field.name)}
                                        type={
                                            field.type === "password"
                                                ? (passwordVisibility[field.name] ? "text" : "password")
                                                : field.type || "text"
                                        }
                                        placeholder={field.placeholder}
                                        className={`w-full px-4 py-2.5 text-sm rounded-xl border bg-white transition-all 
        ${
                                            formik.touched[field.name] && formik.errors[field.name]
                                                ? "border-red-500 ring-2 ring-red-100 text-red-900"
                                                : "border-slate-200 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500"
                                        }`}
                                    />
                                    {field.type === "password" && (
                                        <button
                                            type="button"
                                            onClick={() => togglePassword(field.name)}
                                            className="absolute inset-y-0 right-4 flex items-center text-slate-400 hover:text-indigo-600 transition-colors"
                                        >
                                            {passwordVisibility[field.name] ? "🔒" : "👁️"}
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>

                        {formik.errors[field.name] && (
                            <p className="text-xs font-medium text-red-500 ml-1">
                                {getErrorMessage(formik.errors[field.name])}
                            </p>
                        )}
                        {field.name === "password" && (title === "Sign In" || title === "Login") && (
                            <div className="flex justify-end mt-1">
                                <button
                                    type="button"
                                    onClick={() => navigate('/forgot-password')}
                                    className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold transition-colors"
                                >
                                    {t('login.forgot_password')}
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {showConfirm && (
                <ConfirmModal
                    title={t('common.discard_confirm_title')}
                    message={t('common.discard_confirm_msg')}
                    confirmText={t('common.discard_yes')}
                    cancelText={t('common.discard_no')}
                    onConfirm={() => {
                        setShowConfirm(false);
                        onClose();
                    }}
                    onCancel={() => setShowConfirm(false)}
                />
            )}
        </FormContainer>
    );
}

export default DynamicForm;
