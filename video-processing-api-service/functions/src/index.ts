import * as functions from "firebase-functions";
import {initializeApp} from "firebase-admin/app";
import {Firestore} from "firebase-admin/firestore";
import * as logger from "firebase-functions/logger";
import {Storage} from "@google-cloud/storage";
import {onCall} from "firebase-functions/v2/https";

initializeApp();

const firestore = new Firestore();
const storage = new Storage();

const rawVideoBucketName = "sbbj-platform-raw-videos";
const thumbnailBucketName = "sbbj-platform-thumbnails";
const videoCollectionId = "videos";
const userCollection="users";

export interface Video {
  id?: string,
  uid?: string,
  filename?: string,
  status?: "processing" | "processed",
  title?: string,
  description?: string,
  thumbnail?: string,
  name?: string,
  photoUrl?:string,
}
export interface userInfo {
  uid: string,
  email: string,
  photoUrl: string,
  name: string,
}
export const createUser = functions.auth.user().onCreate((user) => {
  let name="";
  if (user.displayName==null) {
    name="Guest"+Date.now();
  } else {
    name=user.displayName;
  }

  const userInfo = {
    uid: user.uid,
    email: user.email,
    photoUrl: user.photoURL,
    name,
  };

  firestore.collection("users").doc(user.uid).set(userInfo);
  logger.info(`User Created: ${JSON.stringify(userInfo)}`);
  return;
});

export const generateThumbnailUrl =
  onCall({maxInstances: 1}, async (request) => {
    console.log("start generate thumbnail url");
    // Check if the user is authentication
    if (!request.auth) {
      throw new functions.https.HttpsError(
        "failed-precondition",
        "The function must be called while authenticated."
      );
    }

    const auth = request.auth;
    const data = request.data;
    const bucket = storage.bucket(thumbnailBucketName);
    const filename = `${auth.uid}-${Date.now()}.${data.fileExtension}`;
    // Get a v4 signed URL for uploading file
    const [url] = await bucket.file(filename).getSignedUrl({
      version: "v4",
      action: "write",
      expires: Date.now() + 15 * 60 * 1000, // 15 minutes
    });
    console.log("generated url successfully");
    console.log(`url: ${url}`);
    console.log(`filename: ${filename}`);
    return {url, filename};
  });

export const generateUploadUrl = onCall({maxInstances: 1}, async (request) => {
  // Check if the user is authentication
  if (!request.auth) {
    throw new functions.https.HttpsError(
      "failed-precondition",
      "The function must be called while authenticated."
    );
  }

  const auth = request.auth;
  const data = request.data;
  const bucket = storage.bucket(rawVideoBucketName);

  // Generate a unique filename
  const filename = `${auth.uid}-${Date.now()}.${data.fileExtension}`;

  // Get a v4 signed URL for uploading file
  const [url] = await bucket.file(filename).getSignedUrl({
    version: "v4",
    action: "write",
    expires: Date.now() + 15 * 60 * 1000, // 15 minutes
  });

  console.log("generated url successfully");
  console.log(`url: ${url}`);
  console.log(`filename: ${filename}`);
  return {url, filename};
});

export const saveVideoData = onCall({maxInstances: 1}, async (request) => {
  // Check if the user is authenticated
  if (!request.auth) {
    throw new functions.https.HttpsError(
      "failed-precondition",
      "The function must be called while authenticated."
    );
  }
  // Extract video data from the request
  const {filename, title, description} = request.data;
  // Save the video data to Firestore
  const id = filename.split(".")[0];
  const uid = filename.split("-")[0];
  const info= await getPFPHelper(uid) as userInfo;
  await firestore.collection(videoCollectionId).doc(id).set({
    filename,
    title,
    description,
    id,
    uid,
    thumbnail: "",
    username: info.name,
    photoUrl: info.photoUrl,
  }, {merge: true});

  return {message: "Video data saved successfully."};
});

export const saveThumbnail = onCall({maxInstances: 1}, async (request) => {
  console.log("start save thumbnail");
  // Check if the user is authenticated
  if (!request.auth) {
    throw new functions.https.HttpsError(
      "failed-precondition",
      "The function must be called while authenticated."
    );
  }
  const {thumbnail, id} = request.data;
  console.log(id);
  console.log(thumbnail);
  await firestore.collection(videoCollectionId).doc(id).set({
    thumbnail,
  }, {merge: true});
  console.log("Thumbnail saved successfully.");
  return {message: "Thumbnail saved successfully."};
});

export const getVideoData = onCall({maxInstances: 1}, async (request) => {
  console.log("index");
  const filename = request.data;
  console.log(filename);
  const file = filename.split(".")[0];
  console.log(file);
  const id = file.split("d-")[1];
  console.log(id);

  if (!id || typeof id !== "string" || id.trim() === "") {
    throw new Error("Invalid or missing document ID");
  }

  const documentSnapshot = await firestore
    .collection(videoCollectionId)
    .doc(id).get();

  if (!documentSnapshot.exists) {
    throw new Error("Document not found");
  }
  const info = documentSnapshot.data();
  if (!info) {
    throw new Error("No Info found");
  }

  console.log("info ", info);
  console.log("info.data ", info.data);
  return info;
});

export const getSearch = onCall({maxInstances: 1},
  async (request) => {
    console.log("started search");
    console.log("request.data: ", request.data);
    const key = request.data;
    console.log("key ", key);
    const snapshot = await firestore
      .collection(videoCollectionId)
      .where("title", "==", key)
      .where("status", "==", "processed")
      // Filter for documents where status is 'processed'
      .limit(10) // Limit to 10 documents
      .get();
    console.log("ended search");
    console.log(snapshot.docs.map((doc) => doc.data()));
    return snapshot.docs.map((doc) => doc.data());
  });

export const getPFP = onCall({maxInstances: 1},
  async (request) => {
    console.log("start function");
    const uid = request.data;

    return getPFPHelper(uid);
  });

/**
 * Used to help get profile picture (pfp).
 * @param {string} uid - The user ID.
 */
async function getPFPHelper(uid: string) {
  const documentSnapshot = await firestore
    .collection(userCollection)
    .doc(uid).get();

  if (!documentSnapshot.exists) {
    throw new Error("Document not found");
  }
  const info = documentSnapshot.data();
  if (!info) {
    throw new Error("No Info found");
  }


  return info as userInfo;
}
