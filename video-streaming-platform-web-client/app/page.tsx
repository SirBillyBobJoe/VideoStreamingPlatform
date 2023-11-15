import styles from './page.module.css'
import { getVideos } from './firebase/functions'
import Link from 'next/link';
import Image from 'next/image';

export default async function Home() {
  const videos = await getVideos();
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
