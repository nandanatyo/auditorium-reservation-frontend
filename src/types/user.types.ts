export type UserRole = "user" | "admin" | "event_coordinator";

export interface User {
    id: string | null;
    name: string | null;
    email: string | null;
    role: UserRole | null;
    bio: string | null;
    created_at: string | null;
    updated_at: string | null;
}

export interface UserMinimal {
    id: string | null;
    name: string | null;
    role: UserRole | null;
    bio: string | null;
}

export interface CreateUserRequest {
    name: string;
    email: string;
    password: string;
    role: "event_coordinator" | "user";
}

export interface CreateUserResponse {
    user: {
        id: string;
    };
}

export interface UpdateUserProfileRequest {
    name?: string | null;
    bio?: string | null;
}

export interface GetUserResponse {
    user: User;
}

export interface GetUserMinimalResponse {
    user: UserMinimal;
}
