import { useMemo, useState } from 'react';
import { useRegisterCustomerMutation, useRegisterTenantMutation } from '../features/auth/services/authApi';
import { showNotification } from '../features/notifications/slice/notificationSlice';
import { useNavigate } from 'react-router-dom';
import { customerRegisterSchema, tenantRegisterSchema } from '../features/auth/utils/validationSchemas';
import DynamicForm from '../components/DynamicForm';
import { type FieldConfig } from '../components/types';
import { type FetchBaseQueryError } from '@reduxjs/toolkit/query';
import * as Yup from 'yup';
import { useAppDispatch } from "../app/hooks.ts";
import { useTranslation } from 'react-i18next';

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
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const [registerCustomer, { isLoading: isCustLoading }] = useRegisterCustomerMutation();
    const [registerTenant, { isLoading: isTenLoading }] = useRegisterTenantMutation();

    const customerFields: FieldConfig[] = [
        { name: 'fullName', label: t('register.full_name'), placeholder: 'John Doe' },
        { name: 'email', label: t('login.email_placeholder'), type: 'email', placeholder: 'john@example.com' },
        { name: 'password', label: t('login.pass_placeholder'), type: 'password', placeholder: '••••••••' },
        { name: 'confirmPassword', label: t('register.confirm_password'), type: 'password', placeholder: '••••••••' }
    ];

    const tenantFields: FieldConfig[] = [
        ...customerFields,
        { name: 'organizationName', label: t('register.org_name'), placeholder: 'TicketFlow LLC' },
        { name: 'contactEmail', label: t('register.org_contact'), type: 'email', placeholder: 'contact@cinema.com' },
        { name: 'slug', label: t('register.org_slug'), placeholder: 'my-company-link' }
    ];

    const currentSchema = useMemo(() => {
        return isTenant ? tenantRegisterSchema : customerRegisterSchema;
    }, [isTenant]);

    const handleFormSubmit = async (values: RegistrationValues) => {
        try {
            if (isTenant) {
                const tenantPayload = {
                    admin: { email: values.email, password: values.password },
                    organization: { name: values.organizationName, slug: values.slug, contactEmail: values.contactEmail }
                };
                await registerTenant(tenantPayload).unwrap();
            } else {
                const customerPayload = { email: values.email, password: values.password };
                await registerCustomer(customerPayload).unwrap();
            }
            dispatch(showNotification({
                message: t('register.success_msg'),
                type: 'success'
            }));
            navigate('/login');
        } catch (err) {
            const fetchError = err as FetchBaseQueryError;
            const errorMessage = (fetchError.data as { message?: string })?.message || t('register.error_failed');
            dispatch(showNotification({ message: errorMessage, type: 'error' }));
        }
    };

    return (
        <div className="max-w-2xl w-full p-10 bg-white/10 backdrop-blur-xl shadow-2xl rounded-[40px] border border-white/20 text-center animate-in fade-in duration-500">
            <div className="w-full">
                {/* Switcher - Fixed styling to match Glassmorphism */}
                <div className="flex bg-black/20 p-1 rounded-2xl mb-10 border border-white/10 shadow-inner">
                    <button
                        onClick={() => setIsTenant(false)}
                        className={`flex-1 py-2.5 font-black uppercase text-[10px] tracking-widest rounded-xl transition-all ${!isTenant ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                    >
                        {t('register.role_customer')}
                    </button>
                    <button
                        onClick={() => setIsTenant(true)}
                        className={`flex-1 py-2.5 font-black uppercase text-[10px] tracking-widest rounded-xl transition-all ${isTenant ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                    >
                        {t('register.role_owner')}
                    </button>
                </div>

                <DynamicForm
                    key={isTenant ? 'tenant' : 'customer'}
                    title={isTenant ? t('register.title_owner') : t('register.title_customer')}
                    validationSchema={currentSchema as Yup.AnyObjectSchema}
                    fields={isTenant ? tenantFields : customerFields}
                    initialValues={isTenant ? {
                        email: '', password: '', confirmPassword: '', fullName: '', organizationName: '', slug: '', contactEmail: ''
                    } : { email: '', password: '', confirmPassword: '', fullName: '' }}
                    onSubmit={handleFormSubmit}
                    onClose={() => navigate('/')}
                    submitText={t('register.submit_btn')}
                    isLoading={isCustLoading || isTenLoading}
                />

                <p className="mt-8 text-center text-slate-500 text-sm font-medium">
                    {t('login.no_account')}{' '}
                    <button onClick={() => navigate('/login')} className="text-indigo-600 font-bold hover:underline">
                        {t('login.sign_in')}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;
