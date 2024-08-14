"use server";

import {cookies} from "next/headers";
import {createAdminClient, } from "../appwrite";
import {ID} from "node-appwrite";
import {parseStringify} from "../utils";

export const SignUp = async (userData: SignUpParams) => {
  const{ email, password, firstName,lastName}=userData
  try {
     const {account} = await createAdminClient();

    const newUserAccount= await account.create(ID.unique(), email, password, `${firstName} ${lastName}`);
     const session = await account.createEmailPasswordSession(email, password);

     cookies().set("appwrite-session", session.secret, {
       path: "/",
       httpOnly: true,
       sameSite: "strict",
       secure: true,
     });
    return parseStringify(newUserAccount)
  } catch (error) {
    console.error("SignUp Error: ", error);
    throw new Error("Failed to sign up.");
  }
};

export const SignIn = async ({email, password}: SignInProps) => {
  try {
    const {account} = await createAdminClient();
    const session = await account.createEmailPasswordSession(email, password);

    // Set the session cookie
    cookies().set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
    });

    return {success: true, data: parseStringify(session)};
  } catch (error: any) {
    console.error("SignIn Error: ", error);
    return {success: false, message: error.message || "Sign-in failed."};
  }
};
