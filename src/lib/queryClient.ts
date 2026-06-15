import { QueryClient } from '@tanstack/react-query';

// Single shared TanStack Query client. Tune defaults centrally here.
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
      refetchOnWindowFocus: false,
    },
  },
});
