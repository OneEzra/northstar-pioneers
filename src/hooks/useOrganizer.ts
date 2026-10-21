import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useCurrentUser } from '@/hooks/useCurrentUser';
import {
  fetchEmailSession,
  requestSignInCode,
  signOutOfEmailSession,
  verifySignInCode,
  type EmailSession,
} from '@/lib/organizerApi';
import { isNspAdmin } from '@/lib/nspNostr';

export const ORGANIZER_SESSION_KEY = ['organizer-session'];

export interface Organizer {
  /** Organizer Nostr account that edits are saved under */
  pubkey: string;
  /** `email`: signed in by emailed code, the server signs. `nostr`: signed in with a Nostr key, this browser signs. */
  via: 'email' | 'nostr';
  email?: string;
}

/**
 * Who is managing events: an organizer signed in by email code, or one
 * signed in with a Nostr key. An email session wins when both exist.
 */
export function useOrganizer() {
  const queryClient = useQueryClient();
  const { user } = useCurrentUser();

  const session = useQuery({
    queryKey: ORGANIZER_SESSION_KEY,
    queryFn: fetchEmailSession,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  const requestCode = useMutation({ mutationFn: requestSignInCode });

  const verifyCode = useMutation({
    mutationFn: ({ email, code }: { email: string; code: string }) => verifySignInCode(email, code),
    onSuccess: (s: EmailSession) => queryClient.setQueryData(ORGANIZER_SESSION_KEY, s),
  });

  const signOut = useMutation({
    mutationFn: signOutOfEmailSession,
    onSuccess: () => queryClient.setQueryData(ORGANIZER_SESSION_KEY, null),
  });

  let organizer: Organizer | null = null;
  if (session.data) organizer = { pubkey: session.data.pubkey, via: 'email', email: session.data.email };
  else if (user) organizer = { pubkey: user.pubkey, via: 'nostr' };

  return {
    organizer,
    isAdmin: isNspAdmin(organizer?.pubkey),
    /** Still finding out whether an email session exists */
    isLoading: session.isLoading,
    requestCode,
    verifyCode,
    signOut,
  };
}
