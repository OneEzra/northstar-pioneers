import { useMutation } from "@tanstack/react-query";
import { BlossomUploader } from '@nostrify/nostrify/uploaders';
import type { NostrSigner } from '@nostrify/nostrify';

import { useCurrentUser } from "./useCurrentUser";
import { useAppContext } from "./useAppContext";
import { useOrganizer } from "./useOrganizer";
import { getEffectiveBlossomServers } from "@/lib/appBlossom";
import { signOnServer } from "@/lib/organizerApi";

/** A signer that has the server sign upload authorizations, for organizers signed in by email. */
function serverSigner(pubkey: string): NostrSigner {
  return {
    getPublicKey: async () => pubkey,
    signEvent: async (template) => {
      const [event] = await signOnServer([
        { kind: template.kind, content: template.content, tags: template.tags, created_at: template.created_at },
      ]);
      return event;
    },
  };
}

export function useUploadFile() {
  const { user } = useCurrentUser();
  const { organizer } = useOrganizer();
  const { config } = useAppContext();

  return useMutation({
    mutationFn: async (file: File) => {
      const signer = organizer?.via === 'email' ? serverSigner(organizer.pubkey) : user?.signer;
      if (!signer) {
        throw new Error('Must be logged in to upload files');
      }

      const servers = getEffectiveBlossomServers(
        config.blossomServerMetadata,
        config.useAppBlossomServers,
      );

      if (servers.length === 0) {
        throw new Error('No Blossom servers configured');
      }

      const uploader = new BlossomUploader({ servers, signer });

      const tags = await uploader.upload(file);
      return tags;
    },
  });
}
