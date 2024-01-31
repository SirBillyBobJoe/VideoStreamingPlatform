'use client';

import { useSearchParams } from 'next/navigation'
import { getPFP, getVideoData } from '../firebase/functions';
import { useEffect, useState } from 'react';
import styles from "./page.module.css";
import '../globals.css';
import algoliasearch from 'algoliasearch';
import Link from 'next/link';

export interface Video {
    id?: string,
    uid?: string,
    filename?: string,
    res720?: string,
    status?: "processing" | "processed",
    title?: string,
    description?: string
    thumbnail?: string
    username?: string,
    photoUrl?: string,
}

export interface userInfo {
    uid?: string,
    email?: string,
    photoUrl?: string,
    name?: string,
};

const client = algoliasearch('SD3OQZN9EQ', '5b7bae4cf6ec1f185422b0bdacbfc9c9')
const index = client.initIndex('videos');

export default function Watch() {
    const [videoTitle, setVideoTitle] = useState('');
    const [videoDescription, setVideoDescription] = useState('');
    const [pfp, setPFP] = useState('');
    const [username, setUserName] = useState('');
    const [videos, setVideos] = useState<Video[]>([]);
    const [res360, setRes360] = useState<string>("");
    const [res720, setRes720] = useState<string>("");
    const [is360, setIs360] = useState<boolean>(true);

    const videoSrc = useSearchParams().get('v');
    const uid = useSearchParams().get('uid');
    const imagePrefix = 'https://storage.googleapis.com/sbbj-platform-thumbnails/';

    useEffect(() => {

        const fetchVideos = async () => {
            const result = await index.search('', { hitsPerPage: 8, page: 0, filters: 'status:processed' });

            const videoArray = result.hits as Video[]


            setVideos(videoArray)
        };

        fetchVideos();
    }, []);

    useEffect(() => {
        async function getData() {
            if (videoSrc != null) {

                const videoData = await getVideoData(videoSrc);

                if (videoData && videoData.title) {
                    setVideoTitle(videoData.title);
                }
                if (videoData && videoData.description) {
                    setVideoDescription(videoData.description)
                }

                if (videoData && videoData.filename) {
                    setRes360(videoData.filename)
                }else{
                    setRes360("")
                    setIs360(false)
                }

                if (videoData && videoData.res720) {
                    setRes720(videoData.res720)
                }else{
                    setRes720("")
                    setIs360(true)
                }
            }
        }
        getData();
    }, [videoSrc]);

    useEffect(() => {
        async function getImage() {
            if (uid != null) {

                const { photoUrl, name } = await getPFP(uid);

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

    const handle360 = () => {
        setIs360(true)
    }
    const handle720 = () => {
        setIs360(false)
    }

    const videoPrefix = 'https://storage.googleapis.com/sbbj-platform-processed-videos/';


    return (
        <div className={styles.entireContainer}>
            <div className={styles.container}>
                <div className={styles.card}>
                    <video controls src={is360 ? videoPrefix + videoSrc : videoPrefix + res720} className={styles.video} />
                    <div className={styles.resolutionContainer}>
                        {res360 && <button className={is360 ? styles.resolutionChose : styles.resolution} onClick={handle360}>360p</button>}
                        {res720 && <button className={is360 ? styles.resolution : styles.resolutionChose} onClick={handle720}>720p</button>}
                    </div>
                </div>
                <div className={styles.card}>
                    <h2>{videoTitle}</h2>
                    <Link href={`/creator?uid=${uid}`} className={styles.userInfo}>
                        <img src={pfp} alt="Profile" className={styles.profilePic} />
                        <span className={styles.username}>{username}</span>
                    </Link>
                    <h3>Description</h3>
                    <p className={styles.description}>{videoDescription}</p>
                </div>
            </div>
            <div className={styles.moreVideosContainer}>
                {
                    videos.map((video) => (
                        <Link href={`/watch?v=${video.filename}&uid=${video.uid}`} key={video.id} className={styles.moreVideos}>
                            <img src={video.thumbnail ? imagePrefix + video.thumbnail : '/thumbnail.png'} alt='video'
                                className={styles.thumbnail} />
                            <div className={styles.vidInfo}>
                                <div className={styles.vidInfoTitle}>
                                    {video.title}
                                </div>
                                <Link href={`/creator?uid=${video.uid}`} className={styles.vidInfoProfile}>
                                    <img src={video.photoUrl} alt="Profile" className={styles.vidInfoPic} />
                                    {video.username}
                                </Link>


                            </div>
                        </Link>
                    ))
                }

            </div>
        </div>
    );


}