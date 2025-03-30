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
