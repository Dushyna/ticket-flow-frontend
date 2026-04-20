import { useSearchParams, useNavigate } from 'react-router-dom';
import { useResetPasswordMutation } from '../features/auth/services/authApi';
import { showNotification } from '../features/notifications/slice/notificationSlice';
import DynamicForm from '../components/DynamicForm';
import * as Yup from 'yup';
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { resetSchema } from '../features/auth/utils/validationSchemas';
import { useAppDispatch } from "../app/hooks.ts";
import { useTranslation } from 'react-i18next';

interface ResetPasswordValues {
    password: string;
    confirmPassword?: string;
}

const ResetPasswordPage = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const [resetPassword, { isLoading }] = useResetPasswordMutation();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { t } = useTranslation();

    const handleSubmit = async (values: ResetPasswordValues) => {
        if (!token) {
            dispatch(showNotification({
                message: t('reset_password.error_no_token'),
                type: 'error'
            }));
            return;
        }

        try {
            await resetPassword({ token, newPassword: values.password }).unwrap();

            dispatch(showNotification({
                message: t('reset_password.success_msg'),
                type: 'success'
            }));

            navigate('/login');
        } catch (err) {
            const fetchError = err as FetchBaseQueryError;
            const errorMessage = (fetchError.data as { message?: string })?.message
                || t('reset_password.error_failed');

            dispatch(showNotification({
                message: errorMessage,
                type: 'error'
            }));
        }
    };

    return (
        <div className="flex items-center justify-center py-12 px-4 w-full max-w-md">
            <DynamicForm
                title={t('reset_password.title')}
                description={t('reset_password.description')}
                fields={[
                    { name: 'password', label: t('reset_password.label_new'), type: 'password', placeholder: '••••••••' },
                    { name: 'confirmPassword', label: t('register.confirm_password'), type: 'password', placeholder: '••••••••' }
                ]}
                initialValues={{ password: '', confirmPassword: '' }}
                validationSchema={resetSchema as Yup.AnyObjectSchema}
                onSubmit={handleSubmit}
                onClose={() => navigate('/login')}
                submitText={t('reset_password.btn_submit')}
                isLoading={isLoading}
            />
        </div>
    );
};

export default ResetPasswordPage;
