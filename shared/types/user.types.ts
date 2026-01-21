export type UserRole = 'admin' | 'user';

export interface User {
    id: string;          // Same as Firebase Auth UID
    email: string;
    name: string;
    role: UserRole;
    createdAt: string;   // ISO 8601
}

export type CreateUserDto = Omit<User, 'id' | 'createdAt'>;
