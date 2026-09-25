/**
 * Central query key factory for TanStack Query.
 * Using factory functions ensures consistent cache key shapes
 * for both queries and invalidations.
 *
 * Pattern: base key is always the first element.
 * Calling the factory with no args gives just ["entity"],
 * which TanStack Query uses as a prefix to invalidate ALL
 * variants (any page, search, filter) via partial matching.
 */
export const queryKeys = {
    // Admin
    admins: (page?: number) =>
        page !== undefined ? ["admins", page] as const : ["admins"] as const,
    admin: (id?: number | string | null) =>
        id !== undefined ? ["admin", id] as const : ["admin"] as const,

    // Users
    users: (page?: number, search?: string, filter?: string) =>
        page !== undefined ? ["users", page, search, filter] as const : ["users"] as const,

    // Notifications
    notifications: (page?: number, search?: string, filter?: string) =>
        page !== undefined ? ["notifications", page, search, filter] as const : ["notifications"] as const,
    notification: (id?: number | string | null) =>
        id !== undefined ? ["notification", id] as const : ["notification"] as const,
    unreadNotificationCount: () => ["unreadNotificationCount"] as const,

    // Animals
    animals: (page?: number, search?: string, filter?: string) =>
        page !== undefined ? ["animals", page, search, filter] as const : ["animals"] as const,
    animal: (id?: number | string | null) =>
        id !== undefined ? ["animal", id] as const : ["animal"] as const,

    // Farmers
    farmers: (page?: number, search?: string, filter?: string) =>
        page !== undefined ? ["farmers", page, search, filter] as const : ["farmers"] as const,
    farmer: (id?: number | null) =>
        id !== undefined ? ["farmer", id] as const : ["farmer"] as const,

    // Doctors
    doctors: (page?: number, search?: string, filter?: string) =>
        page !== undefined ? ["doctors", page, search, filter] as const : ["doctors"] as const,
    doctor: (id?: number | null) =>
        id !== undefined ? ["doctor", id] as const : ["doctor"] as const,

    // Global Search
    globalSearch: (query: string) => ["globalSearch", query] as const,

    // Dashboard Charts
    dashboardStats: (period?: string) => ["dashboardStats", period] as const,
    userGrowth: (period?: string) => ["userGrowth", period] as const,
    userOS: (period?: string) => ["userOS", period] as const,
    aiUsers: (period?: string) => ["aiUsers", period] as const,
    appointments: (period?: string) => ["appointments", period] as const,
    retention: (period?: string) => ["retention", period] as const,
    userListStats: (period?: string) => ["userListStats", period] as const,
    userLocation: (period?: string, role?: string, filter?: string) =>
        ["userLocation", period, role, filter] as const,
    dailyUsers: (period?: string) => ["dailyUsers", period] as const,
    registeredAnimals: (period?: string) => ["registeredAnimals", period] as const,
    taskFeatureUsers: (period?: string) => ["taskFeatureUsers", period] as const,
} as const;
