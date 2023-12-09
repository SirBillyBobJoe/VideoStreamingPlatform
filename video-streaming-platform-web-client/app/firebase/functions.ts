import { httpsCallable } from 'firebase/functions'
import { functions } from './firebase';


const generateUploadUrl = httpsCallable(functions, 'generateUploadUrl');
const saveVideoData = httpsCallable(functions, 'saveVideoData');
const getVideoDataFunction = httpsCallable(functions, 'getVideoData');
const generateThumbnailUrl = httpsCallable(functions, 'generateThumbnailUrl');
const saveThumbnail= httpsCallable(functions, 'saveThumbnail');

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



export async function getVideoData(filename: String) {

    const response = await getVideoDataFunction(filename);


    return response.data as Video;
}

export async function getPFP(uid:String){

    const response = await getPFPFunction(uid);

    return response.data as userInfo;
}
