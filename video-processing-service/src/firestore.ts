import { credential } from "firebase-admin";
import {initializeApp} from "firebase-admin/app";
import {Firestore} from "firebase-admin/firestore";

initializeApp({credential: credential.applicationDefault()});

const firestore = new Firestore();


const videoCollectionId = 'videos';

export interface Video {
  id?: string,
  uid?: string,
  filename?: string,
  res720?:string,
  status?: 'processing' | 'processed',
  title?: string,
  description?: string
  thumbnail?:string
}

async function getVideo(videoId: string) {
  const snapshot = await firestore.collection(videoCollectionId).doc(videoId).get();
  return (snapshot.data() as Video) ?? {};
}

export function setVideo(videoId: string, video: Video) {
  return firestore
    .collection(videoCollectionId)
    .doc(videoId)
    .set(video, { merge: true })
}

export async function getThumbnail(videoId:string){
  const documentSnapshot = await firestore
    .collection(videoCollectionId)
    .doc(videoId).get();
    
  if (!documentSnapshot.exists) {
    throw new Error("Document not found");
  }
  const info = documentSnapshot.data();
  if (!info) {
    throw new Error("No Info found");
  }

  console.log("info ", info);

  return info.thumbnail;
}

export async function isVideoNew(videoId: string) {
  const video = await getVideo(videoId);
  return video?.status === undefined;
}
