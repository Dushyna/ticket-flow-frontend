import { useNavigate } from 'react-router-dom';
import { useForgotPasswordMutation } from '../features/auth/services/authApi';
import { showNotification } from '../features/notifications/slice/notificationSlice';
import DynamicForm from '../components/DynamicForm';
import { type FieldConfig } from '../components/types';
import * as Yup from 'yup';
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { useAppDispatch } from "../app/hooks.ts";
import { useTranslation } from 'react-i18next';

const ForgotPasswordPage = () => {
    const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const fields: FieldConfig[] = [
        {
            name: 'email',
            label: t('forgot_password.email_label'),
            type: 'email',
            placeholder: t('forgot_password.email_placeholder')
        }
    ];

    const forgotSchema = Yup.object().shape({
        email: Yup.string()
            .email(t('validation.email_invalid'))
            .required(t('validation.email_required')),
    });

    const handleSubmit = async (values: { email: string }) => {
        try {
            await forgotPassword(values).unwrap();
            dispatch(showNotification({
                message: t('forgot_password.success_msg'),
                type: 'success'
            }));
            navigate('/login');
        } catch (err) {
            const fetchError = err as FetchBaseQueryError;
            const errorMessage = (fetchError.data as { message?: string })?.message
                || t('forgot_password.error_generic');
            dispatch(showNotification({ message: errorMessage, type: 'error' }));
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4">
            <div className="w-full max-w-md">
                <DynamicForm
                    title={t('forgot_password.title')}
                    description={t('forgot_password.description')}
                    fields={fields}
                    initialValues={{ email: '' }}
                    validationSchema={forgotSchema as Yup.AnyObjectSchema}
                    onSubmit={handleSubmit}
                    onClose={() => navigate('/login')}
                    submitText={t('forgot_password.submit_btn')}
                    isLoading={isLoading}
                />
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
