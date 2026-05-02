import { fetchBaseQuery, type BaseQueryFn, type FetchArgs, type FetchBaseQueryError } from '@reduxjs/toolkit/query/react';

const getCookie = (name: string) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
    return undefined;
};

const baseQuery = fetchBaseQuery({
    baseUrl: 'http://localhost:8080/api/v1',
    credentials: 'include',
    prepareHeaders: (headers) => {
        const csrfToken = getCookie('XSRF-TOKEN');
        if (csrfToken) {
            headers.set('X-XSRF-TOKEN', csrfToken);
        }
        return headers;
    },
});

export const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
    args,
    api,
    extraOptions
) => {
    let result = await baseQuery(args, api, extraOptions);

    if (result.error && result.error.status === 401) {
        console.log('Access token expired, trying to refresh...');

        const refreshResult = await baseQuery({ url: '/auth/refresh-token', method: 'POST' }, api, extraOptions);

        if (refreshResult.data) {
            console.log('Token refreshed! Retrying original request...');
            result = await baseQuery(args, api, extraOptions);
        } else {
            console.warn('Refresh failed. Please login again.');
        }
    }
    return result;
};
