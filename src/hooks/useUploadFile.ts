import { useMutation } from "@tanstack/react-query";
import { BlossomUploader } from '@nostrify/nostrify/uploaders';

import { useCurrentUser } from "./useCurrentUser";
import { useAppContext } from "./useAppContext";
import { useOrganizer } from "./useOrganizer";
import { getEffectiveBlossomServers } from "@/lib/appBlossom";
import { uploadHostedFile } from "@/lib/organizerApi";

/**
 * Upload a file and get back its URL tags. Organizers signed in by email
 * upload to our own site; anyone signed in with a Nostr key uploads to
 * Blossom media servers, as before.
 */
export function useUploadFile() {
  const { user } = useCurrentUser();
  const { organizer } = useOrganizer();
  const { config } = useAppContext();

  return useMutation({
    mutationFn: async (file: File): Promise<[['url', string], ...string[][]]> => {
      if (organizer?.via === 'email') {
        return [['url', await uploadHostedFile(file)]];
      }
      if (!user) {
        throw new Error('Must be logged in to upload files');
      }

      const servers = getEffectiveBlossomServers(
        config.blossomServerMetadata,
        config.useAppBlossomServers,
      );

      if (servers.length === 0) {
        throw new Error('No Blossom servers configured');
      }

      const uploader = new BlossomUploader({
        servers,
        signer: user.signer,
      });

      return uploader.upload(file);
    },
  });
}
