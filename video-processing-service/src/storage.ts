//1. Google cloud storage file interactions
//2. Local File interactions

import { Storage } from '@google-cloud/storage';
import fs from 'fs';
import ffmpeg from 'fluent-ffmpeg';
import { dir } from 'console';

const storage = new Storage();

const rawVideoBucketName = "sbbj-platform-raw-videos";
const processedVideoBucketName = "sbbj-platform-processed-videos";
const thumbnailBucketName="sbbj-platform-thumbnails"

const localRawVideoPath = "./raw-videos";
const localProcessedVideoPath = "./processed-videos";


/**
 * Creates the local directories for raw and processed videos.
 */

export function setupDirectories() {
    ensureDirectoryExistence(localProcessedVideoPath);
    ensureDirectoryExistence(localRawVideoPath);
}

/**
 * @param rawVideoName - The name of the file to convert from {@link localRawVideoPath}. 
 * @param processedVideoname - The name of the file to convert to {@link localProcessedVideoPath}.
 * @returns A promise that resolves when the video has been converted.
 */
export function convertVideo(rawVideoName: string, processedVideoName: string) {
    return new Promise<void>((resolve, reject) => {
        // Create the ffmpeg command
        ffmpeg(`${localRawVideoPath}/${rawVideoName}`)
            .outputOptions('-vf', 'scale=-1:360') // 360p
            .on('end', function () {
                console.log('Processing finished successfully');
                resolve();
            })
            .on('error', function (err: any) {
                console.log('An error occurred: ' + err.message);
                reject(err);
            })
            .save(`${localProcessedVideoPath}/${processedVideoName}`);
    })

}

/**
 * @param fileName 
 * {@link rawVideoBucketName} bucket into the {@link localRawVideoPath} folder.
 * @returns a promise that resolves when the file has been downloaded.
 */
export async function downloadRawVideo(fileName: string) {

    await storage.bucket(rawVideoBucketName)
        .file(fileName).
        download({ destination: `${localRawVideoPath}/${fileName}` });

    console.log(`gs://${rawVideoBucketName}/${fileName} downloaded to ${localRawVideoPath}/${fileName}.`);
}

/**
 * @param fileName 
 * {@link localProcessedVideoPath} folder into the {@link processedVideoBucketName}.
 * @returns A promise that resolves when the file has been uploaded.
 */
export async function uploadProcessedVideo(fileName: string) {
    const bucket = storage.bucket(processedVideoBucketName);

    await bucket.upload(`${localProcessedVideoPath}/${fileName}`, {
        destination: fileName
    })
    console.log(`${localProcessedVideoPath}/${fileName} uploaded to gs://${processedVideoBucketName}/${fileName}. `)
    await bucket.file(fileName).makePublic();
}
/**
 * 
 * @param filename - the name of the file to delete from the {@link localProcessedVideoPath} folder.
 * 
 * @returns a promise that resolves when the file has been deleted. 
 */
export function deleteProcessedVideo(filename: string) {
    return deleteFile(`${localProcessedVideoPath}/${filename}`);
}

/**
 * 
 * @param filename - the name of the file to delete from the {@link localRawVideoPath} folder.
 * 
 * @returns a promise that resolves when the file has been deleted. 
 */
export function deleteRawVideo(fileName: string) {
    return deleteFile(`${localRawVideoPath}/${fileName}`);
}

/**
 * @param filePath - the path of the file to delete.
 * @returns A promise that resolves when the file has been deleted.
 */
function deleteFile(filePath: string): Promise<void> {

    return new Promise((resolve, reject) => {
        if (fs.existsSync(filePath)) {
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.log(`Failed to delete ${filePath}`, err);
                    reject(err);
                } else {
                    console.log(`File deleted at  ${filePath}`);
                    resolve();
                }
            })
        } else {
            console.log(`File not found at ${filePath}, skipping the delete.`);
            resolve();
        }
    })

}

/**
 * @param {string} dirPath - the direcory path to check.
 */
function ensureDirectoryExistence(dirPath: string) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true }); //recurseive true enables creating nested directory
        console.log(`created directry at ${dirPath}.`)
    }
}

export async function makeThumbnailPublic(thumbnail:string){
    const bucket=storage.bucket(thumbnailBucketName);
    await bucket.file(thumbnail).makePublic();
    console.log("Made thumbnail public")
}