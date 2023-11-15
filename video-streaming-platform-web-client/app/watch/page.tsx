'use client';

import { useSearchParams } from 'next/navigation'
import { getVideoData } from '../firebase/functions';
import { useEffect, useState } from 'react';
import styles from "./page.module.css";
import '../globals.css';
export interface Video {
    id?: string,
    uid?: string,
    filename?: string,
    status?: "processing" | "processed",
    title?: string,
    description?: string
    thumbnail?:string
}


export default function Watch() {
    const [videoTitle, setVideoTitle] = useState('');
    const [videoDescription, setVideoDescription] = useState('');

    const videoSrc = useSearchParams().get('v');
    useEffect(() => {
        async function getData() {
            if (videoSrc != null) {
                console.log(videoSrc);
                const videoData = await getVideoData(videoSrc);
                console.log("videoData: ", videoData);
                if (videoData && videoData.title) {
                    setVideoTitle(videoData.title);
                }
                if(videoData&&videoData.description){
                    setVideoDescription(videoData.description)
                }
            }
        }
        getData();
    }, [videoSrc]); // Add videoSrc as a dependency



    const videoPrefix = 'https://storage.googleapis.com/sbbj-platform-processed-videos/';

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <video controls src={videoPrefix + videoSrc} className={styles.video} />
            </div>
            <div className={styles.card}>
                <h2>{videoTitle}</h2>
                <h3>Description</h3>
                <p className={styles.description}>{videoDescription}</p>
            </div>
        </div>
    );
}