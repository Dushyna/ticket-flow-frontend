import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8080/api/v1/auth' }),
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (credentials) => ({
                url: '/login',
                method: 'POST',
                body: credentials,
            }),
        }),
        registerCustomer: builder.mutation({
            query: (userData) => ({
                url: '/register/customer',
                method: 'POST',
                body: userData,
            }),
        }),
        registerTenant: builder.mutation({
            query: (tenantData) => ({
                url: '/register/tenant',
                method: 'POST',
                body: tenantData,
            }),
        }),
        confirmRegistration: builder.query({
            query: (code) => `/confirm/${code}`,
        }),
        forgotPassword: builder.mutation<void, { email: string }>({
            query: (body) => ({
                url: '/forgot-password',
                method: 'POST',
                body,
            }),
        }),
        resetPassword: builder.mutation<void, { token: string | null; newPassword: string }>({
            query: (body) => ({
                url: '/reset-password',
                method: 'POST',
                body,
            }),
        }),


    }),
});

export const {
    useLoginMutation,
    useRegisterCustomerMutation,
    useLazyConfirmRegistrationQuery,
    useRegisterTenantMutation,
    useForgotPasswordMutation,
    useResetPasswordMutation
} = authApi;
