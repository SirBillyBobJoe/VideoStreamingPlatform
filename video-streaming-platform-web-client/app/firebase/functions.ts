import { httpsCallable } from 'firebase/functions'
import { functions } from './firebase';


const generateUploadUrl = httpsCallable(functions, 'generateUploadUrl');
const getVideosFunction = httpsCallable(functions, 'getVideos');

export interface Video {
    id?: string,
    uid?: string,
    filename?: string,
    status?: 'processing' | 'processed',
    title?: string,
    description?: string
}

export async function uploadVideo(file: File) {
    const response: any = await generateUploadUrl({
        fileExtension: file.name.split('.').pop()
    });

    //upload via the signed url
    const uploadResult = await fetch(response?.data?.url, {
        method: 'Put',
        body: file,
        headers: {
            'Content-Type': file.type
        }
    });
    return uploadResult;
}

export async function getVideos() {
    const response = await getVideosFunction();
    const allVideos = response.data as Video[];

    // Filter to get only processed videos
    const processedVideos = allVideos.filter(video => video.status === 'processed');
    
    return processedVideos;
}