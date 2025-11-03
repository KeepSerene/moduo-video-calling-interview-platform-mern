import { Inngest } from "inngest";
import { connectToDB } from "./db.js";
import User from "../models/User.js";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "moduo" });

const syncUser = inngest.createFunction(
  { id: "moduo-sync-user" },
  { event: "clerk/user.created" },
  async ({ event }) => {
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
  }
);

const deleteUser = inngest.createFunction(
  { id: "moduo-delete-user" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    await connectToDB();
    const { id } = event.data;
    await User.deleteOne({ clerkId: id });
  }
);

// An array to export Inngest functions
export const functions = [syncUser, deleteUser];
