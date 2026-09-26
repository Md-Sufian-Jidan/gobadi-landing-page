"use client";

import React, { useState } from "react";
import {
    QueryClient,
    QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

function makeQueryClient() {
    return new QueryClient({
        defaultOptions: {
            queries: {
                // Data is considered fresh for 1 minute — avoids redundant refetches
                staleTime: 60 * 1000,
                // Keep unused data in cache for 5 minutes
                gcTime: 5 * 60 * 1000,
                // Don't automatically refetch when the window regains focus
                refetchOnWindowFocus: false,
                // Retry failed requests once before surfacing the error
                retry: 1,
            },
        },
    });
}

export default function Providers({ children }: { children: React.ReactNode }) {
    // useState ensures the QueryClient is not recreated on every render
    const [queryClient] = useState(() => makeQueryClient());

    return (
        <QueryClientProvider client={queryClient}>
            {children}
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    );
}
