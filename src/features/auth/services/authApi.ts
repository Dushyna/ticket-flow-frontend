import { type UserResponseDto, type LoginRequest } from '../types/types';
import { createApi} from '@reduxjs/toolkit/query/react';
import {baseQueryWithReauth} from "../../../app/baseQueryWithReauth.ts";


export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({        login: builder.mutation<UserResponseDto, LoginRequest>({
            query: (credentials) => ({
                url: '/auth/login',
                method: 'POST',
                body: credentials,
            }),
        }),
        getCurrentUser: builder.query<UserResponseDto, void>({
            query: () => '/auth/me',
        }),

        logout: builder.mutation<void, void>({
            query: () => ({
                url: '/auth/logout',
                method: 'POST',
            }),
        }),
        registerCustomer: builder.mutation({
            query: (userData) => ({
                url: '/auth/register/customer',
                method: 'POST',
                body: userData,
            }),
        }),
        registerTenant: builder.mutation({
            query: (tenantData) => ({
                url: '/auth/register/tenant',
                method: 'POST',
                body: tenantData,
            }),
        }),
        confirmRegistration: builder.query({
            query: (code) => `/auth/confirm/${code}`,
        }),
        forgotPassword: builder.mutation<void, { email: string }>({
            query: (body) => ({
                url: '/auth/forgot-password',
                method: 'POST',
                body,
            }),
        }),
        resetPassword: builder.mutation<void, { token: string | null; newPassword: string }>({
            query: (body) => ({
                url: '/auth/reset-password',
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
    useGetCurrentUserQuery,
    useResetPasswordMutation
} = authApi;
