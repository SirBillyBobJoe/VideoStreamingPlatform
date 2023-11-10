'use client';

import{useSearchParams} from 'next/navigation'

export default function Watch(){
    const videoSrc=useSearchParams().get('v');
    const videoPrefix = 'https://storage.googleapis.com/sbbj-platform-processed-videos/';

    return(
        <div>
            <h1>Watch Page</h1>
            <video controls src={videoPrefix+videoSrc} height="600" width="1000"/>
        </div>
    );
}