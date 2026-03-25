import {useMemo, useState} from 'react';
import { useRegisterCustomerMutation, useRegisterTenantMutation } from '../features/auth/services/authApi';
import { useDispatch } from 'react-redux';
import { showNotification } from '../features/notifications/slice/notificationSlice';
import { useNavigate } from 'react-router-dom';
import { customerRegisterSchema, tenantRegisterSchema } from '../features/auth/utils/validationSchemas';
import DynamicForm from '../components/DynamicForm';
import { type FieldConfig } from '../components/types';
import { type FetchBaseQueryError } from '@reduxjs/toolkit/query';
import * as Yup from 'yup';

interface RegistrationValues {
    email: string;
    password: string;
    fullName: string;
    confirmPassword?: string;
    organizationName?: string;
    slug?: string;
    contactEmail?: string;
}

const RegisterPage = () => {
    const [isTenant, setIsTenant] = useState(false);

    const [registerCustomer, { isLoading: isCustLoading }] = useRegisterCustomerMutation();
    const [registerTenant, { isLoading: isTenLoading }] = useRegisterTenantMutation();

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const customerFields: FieldConfig[] = [
        { name: 'fullName', label: 'Full Name', placeholder: 'John Doe' },
        { name: 'email', label: 'Email Address', type: 'email', placeholder: 'john@example.com' },
        { name: 'password', label: 'Password', type: 'password', placeholder: '••••••••' },
        { name: 'confirmPassword', label: 'Confirm Password', type: 'password', placeholder: '••••••••' }
    ];

    const tenantFields: FieldConfig[] = [
        ...customerFields,
        { name: 'organizationName', label: 'Organization Name', placeholder: 'TicketFlow LLC' },
        { name: 'contactEmail', label: 'Organization Contact Email', type: 'email', placeholder: 'contact@cinemanikol.com' },
        { name: 'slug', label: 'Organization URL Slug', placeholder: 'my-company-link' }
    ];

    const currentSchema = useMemo(() => {
        return isTenant ? tenantRegisterSchema : customerRegisterSchema;
    }, [isTenant]);

    const handleFormSubmit = async (values: RegistrationValues) => {
        try {
            if (isTenant) {
                const tenantPayload = {
                    admin: {
                        email: values.email,
                        password: values.password
                    },
                    organization: {
                        name: values.organizationName,
                        slug: values.slug,
                        contactEmail: values.contactEmail
                    }
                };
                await registerTenant(tenantPayload).unwrap();
            } else {
                const customerPayload = {
                    email: values.email,
                    password: values.password
                };
                await registerCustomer(customerPayload).unwrap();
            }
            dispatch(showNotification({
                message: 'Registration successful! Please check your email for confirmation code.',
                type: 'success'
            }));
            navigate('/login');
        } catch (err) {
            const fetchError = err as FetchBaseQueryError;
            const errorMessage = (fetchError.data as { message?: string })?.message
                || 'Registration failed.';

            dispatch(showNotification({
                message: errorMessage,
                type: 'error'
            }));
        }
    };

    return (
        <div className="max-w-2xl w-full p-10 bg-white/10 backdrop-blur-xl shadow-2xl rounded-[40px] border border-white/20 text-center animate-in fade-in duration-500">
            <div className="w-full">
                {/* Switcher  */}
                <div className="flex bg-slate-200/50 p-1 rounded-2xl mb-6 shadow-inner">
                    <button
                        onClick={() => setIsTenant(false)}
                        className={`flex-1 py-2.5  font-bold rounded-xl transition-all ${!isTenant ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                    >
                        Customer
                    </button>
                    <button
                        onClick={() => setIsTenant(true)}
                        className={`flex-1 py-2.5  font-bold rounded-xl transition-all ${isTenant ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                    >
                        Business Owner
                    </button>
                </div>

                <DynamicForm
                    key={isTenant ? 'tenant' : 'customer'}
                    title={isTenant ? "Business Registration" : "Create Account"}
                    validationSchema={currentSchema as Yup.AnyObjectSchema}
                    fields={isTenant ? tenantFields : customerFields}
                    initialValues={isTenant ? {
                        email: '', password: '', confirmPassword: '', fullName: '', organizationName: '', slug: ''
                        ,contactEmail: ''
                    } : {
                        email: '', password: '', confirmPassword: '', fullName: ''
                    }}
                    onSubmit={handleFormSubmit}
                    onClose={() => navigate('/')}
                    submitText="Register Now"
                    isLoading={isCustLoading || isTenLoading}
                />
                <p className="mt-8 text-center text-slate-500 text-sm font-medium">
                    Already have an account?{' '}
                    <button onClick={() => navigate('/login')} className="text-indigo-600 font-bold hover:underline">
                        Sign In
                    </button>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;
