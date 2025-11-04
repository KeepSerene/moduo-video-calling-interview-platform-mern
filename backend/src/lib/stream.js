import { StreamClient } from "@stream-io/node-sdk";
import { StreamChat } from "stream-chat";
import ENV from "./env.js";

if (!ENV.STREAM_ACCESS_KEY || !ENV.STREAM_ACCESS_SECRET) {
  throw new Error("Stream Access Key and/or Access Secret are/is missing!");
}

// Instantiate your stream client using the API key and secret
// the secret is only used server side and gives you full access to the API
export const streamClient = new StreamClient(
  ENV.STREAM_ACCESS_KEY,
  ENV.STREAM_ACCESS_SECRET
); // for video calls
export const chatClient = StreamChat.getInstance(
  ENV.STREAM_ACCESS_KEY,
  ENV.STREAM_ACCESS_SECRET
); // for chat messaging

export async function upsertStreamUser(userData) {
  try {
    const response = await chatClient.upsertUser(userData);

    return response;
  } catch (error) {
    console.error("Error upserting the Stream user:", error);
  }
}

export async function deleteStreamUser(userId) {
  try {
    const response = await chatClient.deleteUser(userId);

    return response;
  } catch (error) {
    console.error("Error deleting the Stream user:", error);
  }
}
