import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useForgotPasswordMutation } from '../features/auth/services/authApi';
import { showNotification } from '../features/notifications/slice/notificationSlice';
import DynamicForm from '../components/DynamicForm';
import { type FieldConfig } from '../components/types';
import * as Yup from 'yup';
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";

const ForgotPasswordPage = () => {
    const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const fields: FieldConfig[] = [
        { name: 'email', label: 'Email Address', type: 'email', placeholder: 'your@email.com' }
    ];

    const forgotSchema = Yup.object().shape({
        email: Yup.string().email('Invalid email format').required('Email is required'),
    });

    const handleSubmit = async (values: { email: string }) => {
        try {
            await forgotPassword(values).unwrap();
            dispatch(showNotification({
                message: 'Reset link has been sent to your email!',
                type: 'success'
            }));
            navigate('/login');
        } catch (err) {
            const fetchError = err as FetchBaseQueryError;

            const errorMessage = (fetchError.data as { message?: string })?.message
                || 'Something went wrong. Try again later.';
            dispatch(showNotification({ message: errorMessage, type: 'error' }));
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4">
            <div className="w-full max-w-md">
                <DynamicForm
                    title="Reset Password"
                    description="Enter your email and we'll send you a link to reset your password."
                    fields={fields}
                    initialValues={{ email: '' }}
                    validationSchema={forgotSchema as Yup.AnyObjectSchema}
                    onSubmit={handleSubmit}
                    onClose={() => navigate('/login')}
                    submitText="Send Reset Link"
                    isLoading={isLoading}
                />
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
