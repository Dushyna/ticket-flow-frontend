import * as Yup from 'yup';

const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).{8,}$/;
const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

export const customerRegisterSchema = Yup.object().shape({
    fullName: Yup.string()
        .min(2, 'Name is too short')
        .required('Full name is required'),
    email: Yup.string()
        .matches(emailRegex, 'Invalid email format')
        .required('Email is required'),
    password: Yup.string()
        .matches(passwordRegex, 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number.')
        .required('Password is required'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], 'Passwords must match')
        .required('Please confirm your password'),
});

export const tenantRegisterSchema = Yup.object().shape({
    fullName: Yup.string()
        .min(2, 'Name is too short')
        .required('Full name is required'),
    email: Yup.string()
        .matches(emailRegex, 'Invalid admin email format')
        .required('Admin email is required'),
    organizationName: Yup.string()
        .min(2, 'Organization name is too short')
        .required('Organization name is required'),
    contactEmail: Yup.string()
        .email('Invalid organization email')
        .required('Organization contact email is required'),
    slug: Yup.string()
        .matches(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens')
        .required('Organization URL slug is required'),
    password: Yup.string()
        .matches(passwordRegex, 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number.')
        .required('Password is required'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], 'Passwords must match')
        .required('Please confirm your password'),
});

export const loginSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Required'),
    password: Yup.string().required('Required'),
});

export const resetSchema = Yup.object().shape({
    password: Yup.string()
        .matches(passwordRegex, 'Password must have 1 uppercase, 1 lowercase, 1 number and min 8 chars')
        .required('Password is required'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], 'Passwords must match')
        .required('Please confirm your password'),
});