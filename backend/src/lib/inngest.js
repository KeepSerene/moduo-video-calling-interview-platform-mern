import { Inngest } from "inngest";
import { connectToDB } from "./db.js";
import User from "../models/User.js";
import { upsertStreamUser, deleteStreamUser } from "./stream.js";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "moduo" });

const syncUser = inngest.createFunction(
  { id: "moduo-sync-user" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    try {
      await connectToDB();
      const { id, first_name, last_name, email_addresses, image_url } =
        event.data;
      const newUser = {
        clerkId: id,
        name: `${first_name} ${last_name}`,
        email: email_addresses.at(0)?.email_address,
        profileImageUrl: image_url,
      };
      await User.create(newUser);

      // Stream
      await upsertStreamUser({
        id: newUser.clerkId.toString(),
        name: newUser.name,
        image: newUser.profileImageUrl,
      });
    } catch (error) {
      console.error("Error running the Inngest syncUser function:", error);
    }
  }
);

const deleteUser = inngest.createFunction(
  { id: "moduo-delete-user" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    try {
      await connectToDB();
      const { id } = event.data;
      await User.deleteOne({ clerkId: id });

      // Stream
      deleteStreamUser(id.toString());
    } catch (error) {
      console.error("Error running the Inngest deleteUser function:", error);
    }
  }
);

// An array to export Inngest functions
export const functions = [syncUser, deleteUser];
