import { StreamVideoClient } from "@stream-io/video-react-sdk";

const accessKey = import.meta.env.VITE_STREAM_ACCESS_KEY;

if (!accessKey) {
  throw new Error("Stream access/API key is missing!");
}

let videoClient = null;

export async function initStreamVideoClient(user, token) {
  if (!user || !user.id) {
    throw new Error("Invalid user object provided to initStreamVideoClient");
  }

  if (videoClient && videoClient.user && videoClient.user.id === user.id) {
    return videoClient;
  }

  // clean up existing client before creating new one to prevent duplicates
  if (videoClient) {
    await disconnectUserFromStreamVideoClient();
  }

  // create new video client
  videoClient = new StreamVideoClient({
    apiKey: accessKey,
    user,
    token,
  });

  return videoClient;
}

export async function disconnectUserFromStreamVideoClient() {
  if (videoClient) {
    try {
      if (videoClient.user) {
        await videoClient.disconnectUser();
      }
      videoClient = null;
    } catch (error) {
      console.error(
        "Error disconnecting user from Stream video client:",
        error
      );
      // always set to null even if disconnect fails to allow fresh start
      videoClient = null;

      throw error;
    }
  }
}
