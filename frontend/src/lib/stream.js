import { StreamVideoClient } from "@stream-io/video-react-sdk";

const accessKey = import.meta.env.VITE_STREAM_ACCESS_KEY;

if (!accessKey) {
  throw new Error("Stream access/API key is missing!");
}

let videoClient = null;

export async function initStreamVideoClient(user, token) {
  if (videoClient && videoClient.user.id === user.id) {
    return videoClient;
  }

  // Prevent double call joining??
  if (videoClient) {
    await disconnectUserFromStreamVideoClient();
  }

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
      await videoClient.disconnectUser();
      videoClient = null;
    } catch (error) {
      console.error(
        "Error disconnecting user from Stream video client:",
        error
      );
      throw error;
    }
  }
}
