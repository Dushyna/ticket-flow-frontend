export interface UserResponseDto {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    birthDate?: string;
    phone?: string;
    role: 'ROLE_USER' | 'ROLE_TENANT' | 'ROLE_SUPER_ADMIN';
    confirmationStatus: string;
    organizationId: string | null;
}

export interface LoginRequest {
    email: string;
    password: string;
}

