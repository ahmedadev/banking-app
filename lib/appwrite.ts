// src/lib/server/appwrite.js
"use server";
import {Client, Account, Users, Databases} from "node-appwrite";
import {cookies} from "next/headers";
import { parseStringify } from './utils';
import { defaultUser } from '@/store/global';

export async function createSessionClient() {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);

  const session = cookies().get("appwrite-session");
  if (!session || !session.value) {
    throw new Error("No session");
  }

  client.setSession(session.value);

  return {
    get account() {
      return new Account(client);
    },
  };
}

export async function createAdminClient() {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!)
    .setKey(process.env.NEXT_APPWRITE_KEY!);

  return {
    get account() {
      return new Account(client);
    },
    get database() {
      return new Databases(client);
    },
    get user() {
      return new Users(client);
    },
  };
}

export async function getLoggedInUser() {
  try {
    const {account} = await createSessionClient();
    const user =await account.get();
    return parseStringify(user)
    
  } catch (error) {
    return defaultUser
  }
}

export async function getLoggedOutFromUser() {
try {
    const {account} = await createSessionClient();

  cookies().delete("appwrite-session");
  await account.deleteSession("current");

} catch (error) {
  return null
}

}