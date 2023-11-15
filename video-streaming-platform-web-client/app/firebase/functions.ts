import { httpsCallable } from 'firebase/functions'
import { functions } from './firebase';


const generateUploadUrl = httpsCallable(functions, 'generateUploadUrl');
const getVideosFunction = httpsCallable(functions, 'getVideos');
const saveVideoData = httpsCallable(functions, 'saveVideoData');
const getVideoDataFunction = httpsCallable(functions, 'getVideoData');
const generateThumbnailUrl = httpsCallable(functions, 'generateThumbnailUrl');
const saveThumbnail= httpsCallable(functions, 'saveThumbnail');
const getSearchFunction= httpsCallable(functions, 'getSearch');
const getPFPFunction= httpsCallable(functions, 'getPFP');
export interface Video {
    id?: string,
    uid?: string,
    filename?: string,
    status?: 'processing' | 'processed',
    title?: string,
    description?: string
    thumbnail?: string
}

export interface userInfo {
    uid?: string,
    email?: string,
    photoUrl?: string,
    name?: string,
};

export async function uploadVideo(file: File, title: String, description: String, image: File | null) {
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
    console.log("video type: ",file.type)
    if (uploadResult.ok) {
        await saveVideoData({
            filename: response?.data?.filename,
            title,
            description
        })
    }

    //upload image if theres an image
    if (image != null) {
        const thumbnailResponse: any = await generateThumbnailUrl({
            fileExtension: image.name.split('.').pop()
        });

        console.log(thumbnailResponse?.data?.url)
        console.log("image type: ",image.type)
        //upload via the signed url
        const uploadImage = await fetch(thumbnailResponse?.data?.url, {
            method: 'Put',
            body: image,
            headers: {
                'Content-Type': image.type,
            }
        });


        if (uploadImage.ok) {
            const id=response?.data?.filename.split(".")[0];
            await saveThumbnail({
                thumbnail: thumbnailResponse?.data?.filename,
                id
            })
        }
    }

    return uploadResult;
}

export async function getVideos() {
    const response = await getVideosFunction();
    const allVideos = response.data as Video[];

    // Filter to get only processed videos
    const processedVideos = allVideos.filter(video => video.status === 'processed');

    return processedVideos;
}
export async function getSearch(key:string) {
    console.log("key ", key)
    const response = await getSearchFunction(key);
    const allVideos = response.data as Video[];

    const processedVideos = allVideos.filter(video => video.status === 'processed');

    return processedVideos;
}

export async function getVideoData(filename: String) {
    console.log("functions start");
    const response = await getVideoDataFunction(filename);
    console.log("functions finished");
    console.log("response", response);
    console.log("response.data getVideoData", response.data);

    return response.data as Video;
}

export async function getPFP(uid:String){
    console.log("getPFP functions start");
    console.log("uid: ",uid)
    const response = await getPFPFunction(uid);
    console.log("response.data getPFP", response.data)
    return response.data as userInfo;
}
