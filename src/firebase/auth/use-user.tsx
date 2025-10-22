'use client';
    
import { useFirebase } from '@/firebase/provider';

/**
 * Hook for accessing the currently authenticated user's state.
 *
 * This hook is a lightweight wrapper around the more general `useFirebase` hook.
 * Its primary purpose is to provide a focused and convenient way to access
 * user authentication information (the `User` object, loading status, and errors)
 * without needing to destructure the full object returned by `useFirebase`.
 *
 * It improves code clarity by signaling that a component's only dependency
 * from the Firebase context is the user's auth state.
 *
 * @returns {object} An object containing:
 *  - `user`: The Firebase `User` object if authenticated, otherwise `null`.
 *  - `isUserLoading`: A boolean that is `true` while the auth state is being determined, and `false` otherwise.
 *  - `userError`: An `Error` object if there was an issue with the auth listener, otherwise `null`.
 */
export const useUser = () => {
  // The `useFirebase` hook provides the user state from its context.
  const { user, isUserLoading, userError } = useFirebase();

  // Return the user-specific parts of the context value.
  return { user, isUserLoading, userError };
};
