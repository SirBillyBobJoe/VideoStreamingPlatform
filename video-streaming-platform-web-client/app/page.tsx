'use client'

import styles from './page.module.css'
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getPFP } from './firebase/functions';
import algoliasearch from 'algoliasearch';

export interface Video {
  id?: string,
  uid?: string,
  filename?: string,
  res720?:string,
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

export default function Home() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [page, setPage] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const [isDisabledNext, setIsDisableNext] = useState(false);
  const [isDisabledPrevious, setIsDisablePrevious] = useState(false);
  const imagePrefix = 'https://storage.googleapis.com/sbbj-platform-thumbnails/';


  useEffect(() => {

    const fetchVideos = async () => {
      const result = await index.search('', { hitsPerPage: 8, page, filters: 'status:processed' });
      console.log(result)
      setTotalPage(result.nbPages)
      const videoArray = result.hits as Video[]


      setVideos(videoArray)
    };

    fetchVideos();
  }, [page]);

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
      <main className={styles.videosContainer}>
        {
          videos.map((video) => (
            <Link href={`/watch?v=${video.filename}&uid=${video.uid}`} key={video.id} className={styles.video}>
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
      </main>
      <div >
        <button onClick={handlePrevious} disabled={isDisabledPrevious} className={isDisabledPrevious ? styles.disabled : styles.paginate}>Previous</button>
        <button onClick={handleNext} disabled={isDisabledNext} className={isDisabledNext ? styles.disabled : styles.paginate}>Next</button>
      </div>
    </div>
  )
}

export const revalidate = 30;
