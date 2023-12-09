'use client';

import { useSearchParams } from "next/navigation";
import { getPFP } from "../firebase/functions";
import { useEffect, useState } from "react";
import styles from "./page.module.css";
import algoliasearch from 'algoliasearch';
import Link from "next/link";

const client = algoliasearch('SD3OQZN9EQ', '5b7bae4cf6ec1f185422b0bdacbfc9c9')
const index = client.initIndex('videos');

export interface Video {
    id?: string,
    uid?: string,
    filename?: string,
    status?: "processing" | "processed",
    title?: string,
    description?: string
    thumbnail?: string
    username?: string,
    photoUrl?: string,
}
const imagePrefix = 'https://storage.googleapis.com/sbbj-platform-thumbnails/';
export default function Watch() {
    const [photoUrlFinal, setPhotoUrlFinal] = useState('');
    const [nameFinal, setNameFinal] = useState('');
    const [videos, setVideos] = useState<Video[]>([]);
    const [page, setPage] = useState(0);
    const [totalPage, setTotalPage] = useState(0);
    const [isDisabledNext, setIsDisableNext] = useState(false);
    const [isDisabledPrevious, setIsDisablePrevious] = useState(false);
    const uid = useSearchParams().get('uid') as string;

    useEffect(() => {

        const fetchVideos = async () => {
            const result = await index.search('', { hitsPerPage: 6, page, filters: `status:processed AND uid:${uid}` });
            setTotalPage(result.nbPages)
            const videoArray = result.hits as Video[]


            setVideos(videoArray)
        };

        fetchVideos();
    }, [page]);

    useEffect(() => {
        async function getImage() {

            if (uid) {
                const { photoUrl, name } = await getPFP(uid);

                if (photoUrl) {
                    setPhotoUrlFinal(photoUrl)
                }
                if (name) {
                    setNameFinal(name)
                }
            }

        }
        getImage();
    }, [uid]);
    useEffect(() => {
        if (page >= totalPage - 1) {
            setIsDisableNext(true);
        } else {
            setIsDisableNext(false);
        }

        if (page <= 0) {
            setIsDisablePrevious(true);
        } else {
            setIsDisablePrevious(false);
        }
    }, [page, totalPage])

    const handleNext = () => {
        setPage(page + 1);
    }
    const handlePrevious = () => {
        setPage(page - 1);
    }
    return (
        <div className={styles.container}>
            <div className={styles.creatorContainer}>
                <header className={styles.creatorHeader}>
                    <img src={photoUrlFinal || '/default-profile.png'} alt={nameFinal} className={styles.profileImage} />
                    <h1 className={styles.creatorName}>{nameFinal}</h1>
                </header>
                <div className={styles.videosContainer}>
                    {
                        videos.map((video) => (
                            <Link href={`/watch?v=${video.filename}&uid=${video.uid}`} key={video.id} className={styles.videoItem}>
                                <img src={video.thumbnail ? imagePrefix + video.thumbnail : '/thumbnail.png'} alt='video'
                                    className={styles.thumbnail} />
                                <div className={styles.title}>{video.title}</div>
                                <Link href={`/creator?uid=${video.uid}`} className={styles.vidInfoProfile}>
                                    <img src={video.photoUrl} alt="Profile" className={styles.vidInfoPic} />
                                    {video.username}
                                </Link>
                            </Link>
                        ))
                    }

                </div>
                <div >
                    <button onClick={handlePrevious} disabled={isDisabledPrevious} className={isDisabledPrevious ? styles.disabled : styles.paginate}>Previous</button>
                    <button onClick={handleNext} disabled={isDisabledNext} className={isDisabledNext ? styles.disabled : styles.paginate}>Next</button>
                </div>
            </div>
        </div>
    )
}