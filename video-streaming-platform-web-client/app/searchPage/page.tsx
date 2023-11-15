'use client'
import styles from './page.module.css'
import Link from "next/link";
import { getSearch } from '../firebase/functions'
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
export interface Video {
    id?: string,
    uid?: string,
    filename?: string,
    status?: "processing" | "processed",
    title?: string,
    description?: string,
    thumbnail?: string
  }
export default function Page() {
    const [videos, setVideos] = useState<Video[]>([]);
    const [key, setKey] = useState("");
    const val = useSearchParams().get('query');

    useEffect(() => {
        if (val != null) {
            setKey(val);
        }

        const fetchVideos = async () => {
            const fetchedVideos = await getSearch(key);
            setVideos(fetchedVideos);
        };

        fetchVideos();
    }, );

    const imagePrefix = 'https://storage.googleapis.com/sbbj-platform-thumbnails/';


    return (
      <main className={styles.videosContainer}>
      {
        videos.map((video) => (
          <Link href={`/watch?v=${video.filename}`} key={video.id} >
            <img src={video.thumbnail ? imagePrefix + video.thumbnail : '/thumbnail.png'} alt='video' width={480} height={360}
              className={styles.thumbnail}/>
              <div className={styles.title}>{video.title}</div>
          </Link>
        ))
      }
    </main>
    )
  }
  
  export const revalidate=30;
  
