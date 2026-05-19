export interface UserResponseDto {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    birthDate?: string;
    phone?: string;
    role: 'ROLE_USER' | 'ROLE_TENANT_ADMIN' | 'ROLE_CASHIER' | 'ROLE_CONTROLLER' | 'ROLE_SUPER_ADMIN';
    confirmationStatus: string;
    organizationId: string | null;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface UpdateUserRoleRequest {
    userId: string;
    role: 'ROLE_SUPER_ADMIN' | 'ROLE_TENANT_ADMIN' | 'ROLE_CASHIER' | 'ROLE_CONTROLLER'| 'ROLE_USER';
}

