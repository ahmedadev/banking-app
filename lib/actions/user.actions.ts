"use server";

import {cookies} from "next/headers";
import {createAdminClient, createSessionClient} from "../appwrite";
import {ID} from "node-appwrite";
import {encryptId, parseStringify} from "../utils";
import {defaultUser} from "@/store/global";
import {
  CountryCode,
  ProcessorTokenCreateRequest,
  ProcessorTokenCreateRequestProcessorEnum,
  Products,
} from "plaid";
import {plaidClient} from "../plaid";
import { revalidatePath } from 'next/cache';
import { addFundingSource } from './dwolla.actions';

export const SignUp = async (userData: SignUpParams) => {
  const {email, password, firstName, lastName} = userData;
  try {
    const {account} = await createAdminClient();

    const newUserAccount = await account.create(
      ID.unique(),
      email,
      password,
      `${firstName} ${lastName}`
    );
    const session = await account.createEmailPasswordSession(email, password);

    cookies().set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });
    return parseStringify(newUserAccount);
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
export const getLoggedInUser = async () => {
  try {
    const {account} = await createSessionClient();
    const user = await account.get();
    return parseStringify(user);
  } catch (error) {
    return defaultUser;
  }
};

export const getLoggedOutFromUser = async () => {
  try {
    const {account} = await createSessionClient();

    cookies().delete("appwrite-session");
    await account.deleteSession("current");
  } catch (error) {
    return null;
  }
};
export const CreateLinkToken = async (user: User) => {
  try {
    const tokenParams = {
      user: {
        client_user_id: user.$id,
      },
      client_name: user.name,
      products: ["auth"] as Products[],
      language: "en",
      country_codes: ["US"] as CountryCode[],
    };
    const response = await plaidClient.linkTokenCreate(tokenParams);
    return parseStringify({linkToken: response.data.link_token});
  } catch (error) {
    console.log(error);
  }
};
export const exchangePublicToken = async ({
  publicToken,
  user,
}: exchangePublicTokenProps) => {
  try {
    const response = await plaidClient.itemPublicTokenExchange({
      public_token: publicToken,
    });
    const accessToken = response.data.access_token;
    const itemId = response.data.item_id;
    const accountsResponse = await plaidClient.accountsGet({
      access_token: accessToken,
    });
    const accountData = accountsResponse.data.accounts[0];
    const request: ProcessorTokenCreateRequest = {
      access_token: accessToken,
      account_id: accountData.account_id,
      processor: "dwolla" as ProcessorTokenCreateRequestProcessorEnum,
    };
    const processorTokenResponse = await plaidClient.processorTokenCreate(request)
    const processorToken = processorTokenResponse.data.processor_token
    // Create a funding source URL for the account using the Dwolla customer ID, processor token, and bank name
    const fundingSourceUrl = await addFundingSource({
      dwollaCustomerId: user.dwollaCustomerId,
      processorToken,
      bankName: accountData.name,
    });

    // If the funding source URL is not created, throw an error
    if (!fundingSourceUrl) throw Error;

    // Create a bank account using the user ID, item ID, account ID, access token, funding source URL, and sharable ID
    createBankAccount({
      userId: user.$id,
      bankId: itemId,
      accountId: accountData.account_id,
      accessToken,
      fundingSourceUrl,
      sharableId: encryptId(accountData.account_id),
    });

    // Revalidate the path to reflect the changes
    revalidatePath("/");

    // Return a success message
    return parseStringify({
      publicTokenExchange: "complete",
    });
  } catch (error) {
    // Log any errors that occur during the process
    console.error("An error occurred while creating exchanging token:", error);
  }
};


function createBankAccount(arg0: { userId: string; bankId: string; accountId: any; accessToken: string; fundingSourceUrl: string; sharableId: string; }) {
  throw new Error('Function not implemented.');
}

