import { Account,
    Avatars,
    Client,
    Databases,
    ID,
    Query,
    Storage, } from "appwrite";

    export const appwriteConfig = {
        endpoint: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT  as string,
        platform:process.env.NEXT_PUBLIC_APPWRITE_PLATFORM as string,
        projectId:process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID as string,
        databaseId:process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
        userCollectionId: process.env.NEXT_PUBLIC_APPWRITE_USER_COLLECTION_ID as string,  
        storageId: process.env.NEXT_PUBLIC_APPWRITE_STORAGE_ID as string,
        postId:process.env.NEXT_PUBLIC_APPWRITE_POSTS_ID as string
      };
      const client = new Client();
client
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId)
 export const account = new Account(client);
 export const storage = new Storage(client);
 export const avatars = new Avatars(client);
 export const databases = new Databases(client);
export async function createUser(email: string, password: string, username: string) {
  console.log(username)
    try {
      const newAccount = await account.create(
        ID.unique(),
        email,
        password,
        username
      );
  
      if (!newAccount) throw Error;
      const avatarUrl = avatars.getInitials(username);
      await signIn(email, password);
      const newUser = await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        ID.unique(),
        {
          accountid: newAccount.$id,
          email: email,
          username: username,
          avatar: avatarUrl,
        }
      );
      return newUser;
    } catch (error) {
      throw new Error('theres an error');
    }
  }

  export async function signIn(email: string, password: string) {
    try {
      const session = await account.createEmailPasswordSession(email, password);
      return session;
    } catch (error) {
      throw new Error("account could not be found");
    }
  }
  
  // Get Account
export async function getAccount() {
    try {
      const currentAccount = await account.get();
  
      return currentAccount;
    } catch (error) {
    console.log(error)
    }
  }
  
  // Get Current User
  export async function getCurrentUser() {
    try {
      const currentAccount = await getAccount();
      if (!currentAccount) throw Error;
  
      const currentUser = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        [Query.equal("accountid", currentAccount.$id)]
      );
  
      if (!currentUser) throw Error;
  
      return currentUser.documents[0];
    } catch (error) {
      console.log(error);
      return null;
    }
  }


  export async function signOut() {
    try {
      const session = await account.deleteSession("current");
      return session;
    } catch (error) {
      console.log(error)
      throw new Error('error signing out');
    }
  }

  export async function getAllPosts() {
    try {
      const posts = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.postId
      );
      
      return posts.documents;
    } catch (error) {
      throw new Error("there was an error getting posts");
    }
  }

  export async function getUserPosts(userId: string) {
    if (!userId || typeof userId !== 'string' || userId.trim() === '') {
    return
    }
  
    try {
      const posts = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.postId,
        [Query.equal("creator", userId)]
      );
      return posts.documents;
    } catch (error) {
      console.log(error);
      throw new Error('Error getting user posts');
    }
  }
  
  export async function updateUsername( newUsername :any, documentId: any) {
    try {
      const updated = await databases.updateDocument(
       appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        documentId,
        {
          username: newUsername
        }
      );
  
      console.log('Username updated:', updated);
      alert('username updated')
      return updated;
    } catch (err) {
      console.error('Failed to update username:', err);
      throw err;
    }
  }

  export async function deletePost(documentId: string) {
    try {
      await databases.deleteDocument(
        appwriteConfig.databaseId,
        appwriteConfig.postId, // this should be the posts collection ID
        documentId
      );
      console.log('Post deleted successfully');
      return true;
    } catch (error) {
      console.error('Failed to delete post:', error);
      throw error;
    }
  }

  export async function createPost(form:any) {
    try {
      const newPost = await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.postId,
        ID.unique(),
        {
          category: form.category,
          thumbnail: form.thumbnail,
          description: form.description,
          report: form.report,
          color: form.color,
          location: form.location,
          creator: form.userId
        }
      );
      return newPost;
    } catch (error) {
     console.log(error)
    }
  }