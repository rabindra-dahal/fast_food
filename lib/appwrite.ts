import { CreateUserParams, SignInParams } from "@/type";
import { Account, Avatars, Client, ID, Permission, Query, Role, TablesDB } from "react-native-appwrite";

export const appWriteConfig = {
    endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!,
    projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!,
    platform: 'com.rd.fastfood',
    databaseId: '6925836b00309a6c1302',
    userTableId: 'user',
} 

export const client = new Client();

client
    .setEndpoint(appWriteConfig.endpoint)
    .setProject(appWriteConfig.projectId)
    .setPlatform(appWriteConfig.platform);

export const account = new Account(client);
// export const databases = new Databases(client);

export const tablesDB = new TablesDB(client);

const avatars = new Avatars(client);

export const createUser = async ({ email, password, name }: CreateUserParams) => {
    try {
        const newAccount = await account.create({userId: ID.unique(), email: email,password: password, name: name});
        if(!newAccount) throw Error;

        await signIn({ email, password });

        const avatarUrl = avatars.getInitialsURL(name);

        return await tablesDB.createRow({
            databaseId: appWriteConfig.databaseId,
            tableId: appWriteConfig.userTableId,
            rowId: ID.unique(),
            data: { email, name, accountId: newAccount.$id, avatar: avatarUrl },
            permissions: [Permission.write(Role.user(newAccount.$id))]
        });
    } catch (e) {
        throw new Error(e as string);
    }
}

export const signIn = async ({ email, password }: SignInParams) => {
    try {
        return await account.createEmailPasswordSession({email: email, password: password})
    } catch (e) {
        throw new Error(e as string);
    }
}

export const logout = async() => {
    return await account.deleteSession({ sessionId: "current" });
}

export const getCurrentUser = async () => {
    try {
        const currentAccount = await account.get();
        if(!currentAccount) throw Error;

        const currentUser = await tablesDB.listRows({
            databaseId: appWriteConfig.databaseId,
            tableId: appWriteConfig.userTableId,
            queries: [Query.equal('accountId', currentAccount.$id)]
            });

        if(!currentUser) throw Error;

        return currentUser.rows[0];
    } catch (e) {
        console.log(e);
        throw new Error(e as string);
    }
}
