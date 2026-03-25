import { useSearchParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useResetPasswordMutation } from '../features/auth/services/authApi';
import { showNotification } from '../features/notifications/slice/notificationSlice';
import DynamicForm from '../components/DynamicForm';
import * as Yup from 'yup';
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { resetSchema} from '../features/auth/utils/validationSchemas';


interface ResetPasswordValues {
    password: string;
    confirmPassword?: string;
}


const ResetPasswordPage = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const [resetPassword, { isLoading }] = useResetPasswordMutation();
    const navigate = useNavigate();
    const dispatch = useDispatch();



    const handleSubmit = async (values: ResetPasswordValues) => {
        if (!token) {
            dispatch(showNotification({ message: 'Invalid or missing token.', type: 'error' }));
            return;
        }

        try {
            await resetPassword({ token, newPassword: values.password }).unwrap();

            dispatch(showNotification({
                message: 'Password reset successful! You can now log in.',
                type: 'success'
            }));

            navigate('/login');
        } catch (err) {
            const fetchError = err as FetchBaseQueryError;
            const errorMessage = (fetchError.data as { message?: string })?.message
                || 'Failed to reset password. Link might be expired.';

            dispatch(showNotification({
                message: errorMessage,
                type: 'error'
            }));
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4">
            <DynamicForm
                title="New Password"
                description="Please enter and confirm your new password."
                fields={[
                    { name: 'password', label: 'New Password', type: 'password', placeholder: '••••••••' },
                    { name: 'confirmPassword', label: 'Confirm Password', type: 'password', placeholder: '••••••••' }
                ]}
                initialValues={{ password: '', confirmPassword: '' }}
                validationSchema={resetSchema as Yup.AnyObjectSchema}
                onSubmit={handleSubmit}
                onClose={() => navigate('/login')}
                submitText="Update Password"
                isLoading={isLoading}
            />
        </div>
    );
};
export default ResetPasswordPage;