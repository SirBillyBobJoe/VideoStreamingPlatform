'use client';

import { useSearchParams } from 'next/navigation'
import { getPFP, getVideoData } from '../firebase/functions';
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
    thumbnail?: string
}

export interface userInfo {
    uid?: string,
    email?: string,
    photoUrl?: string,
    name?: string,
};

export default function Watch() {
    const [videoTitle, setVideoTitle] = useState('');
    const [videoDescription, setVideoDescription] = useState('');
    const [pfp, setPFP] = useState('');
    const [username, setUserName] = useState('');

    const videoSrc = useSearchParams().get('v');
    const uid = useSearchParams().get('uid');
    useEffect(() => {
        async function getData() {
            if (videoSrc != null) {
                console.log(videoSrc);
                const videoData = await getVideoData(videoSrc);
                console.log("videoData: ", videoData);
                if (videoData && videoData.title) {
                    setVideoTitle(videoData.title);
                }
                if (videoData && videoData.description) {
                    setVideoDescription(videoData.description)
                }
            }
        }
        getData();
    }, [videoSrc]); // Add videoSrc as a dependency

    useEffect(() => {
        async function getImage() {
            if (uid != null) {
                console.log("uid: ", uid);
                const { photoUrl, name } = await getPFP(uid);
                console.log("image: ", photoUrl);
                console.log("username: ", name)
                if (photoUrl) {
                    setPFP(photoUrl);
                }
                if (name) {
                    setUserName(name);
                }
            }
        }
        getImage();
    }, [uid]);


    const videoPrefix = 'https://storage.googleapis.com/sbbj-platform-processed-videos/';

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <video controls src={videoPrefix + videoSrc} className={styles.video} />
            </div>
            <div className={styles.card}>
                <h2>{videoTitle}</h2>
                <div className={styles.userInfo}>
                    <img src={pfp} alt="Profile" className={styles.profilePic} />
                    <span className={styles.username}>{username}</span>
                </div>
                <h3>Description</h3>
                <p className={styles.description}>{videoDescription}</p>
            </div>
        </div>
    );


}