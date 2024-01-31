'use client'
import styles from './page.module.css'
import Link from "next/link";
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import algoliasearch from 'algoliasearch';

const client = algoliasearch('SD3OQZN9EQ', '5b7bae4cf6ec1f185422b0bdacbfc9c9')
const index = client.initIndex('videos');

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

export default function Page() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [key, setKey] = useState("");
  const [page, setPage] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const [isDisabledNext, setIsDisableNext] = useState(false);
  const [isDisabledPrevious, setIsDisablePrevious] = useState(false);
  const val = useSearchParams().get('query');

  useEffect(() => {
    if (val != null) {
      setKey(val);
    }

    const fetchVideos = async () => {
      const result = await index.search(key, { hitsPerPage: 8, page,filters: 'status:processed'});
      console.log(result)
      setTotalPage(result.nbPages)
      const videoArray = result.hits as Video[]

      setVideos(videoArray)
    };

    fetchVideos();
  }, [key, page]);

  useEffect(()=>{
    if(page>=totalPage-1){
      setIsDisableNext(true);
    }else{
      setIsDisableNext(false);
    }

    if(page<=0){
      setIsDisablePrevious(true);
    }else{
      setIsDisablePrevious(false);
    }
  },[page,totalPage])

  const handleNext = () => {
      setPage(page + 1);
  }
  const handlePrevious = () => {
    setPage(page - 1);
  }

  const imagePrefix = 'https://storage.googleapis.com/sbbj-platform-thumbnails/';


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

