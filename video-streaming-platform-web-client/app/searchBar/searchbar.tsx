'use client';
import { useEffect, useState } from "react";
import styles from "./searchbar.module.css";
import algoliasearch from 'algoliasearch';
import Link from "next/link";

export interface Video {
    id?: string,
    uid?: string,
    filename?: string,
    status?: "processing" | "processed",
    title?: string,
    description?: string,
    thumbnail?: string
}

const client = algoliasearch('SD3OQZN9EQ', '5b7bae4cf6ec1f185422b0bdacbfc9c9')
const index = client.initIndex('videos');


export default function Searchbar() {
    const [videos, setVideos] = useState<Video[]>([]);
    const [search, setSearch] = useState("");
    const [show, setShow] = useState(false);

    useEffect(() => {

        const fetchVideos = async () => {
            const result = await index.search(search, { hitsPerPage: 4, page: 0,filters: 'status:processed' });
            console.log(result)

            const videoArray = result.hits as Video[]

            setVideos(videoArray)
        };

        fetchVideos();
    }, [search]);

    useEffect(() => {
        if (!search) {
            setShow(false);
        } else {
            setShow(true);
        }

    }, [search]);

    // Function to handle search input changes
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        // You can implement what should happen when the user types something

        console.log(event.target.value);
        setSearch(event.target.value);
    }

    // Function to handle the submission of the search
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log(search)
        window.location.href = `/searchPage?query=${search}`;
        console.log("Search submitted");
    }
    const handleLink = () => {
        setSearch("")
    }

    return (
        <div className={styles.container}>
            <form onSubmit={handleSubmit} className={styles.searchbar}>
                <input
                    type="text"
                    placeholder="Search..."
                    onChange={handleInputChange}
                    className={styles.searchinput}
                    value={search}
                />
                <button type="submit" className={styles.searchbutton}><img src="/search.png" width="10px"></img></button>
            </form>
            {
                show ?
                    <div className={styles.searchContainer}>
                        {
                            videos.map((video) => (
                                <Link href={`/watch?v=${video.filename}&uid=${video.uid}`} key={video.id}>
                                    <img className={styles.blackSearch} src="/blackSearch.png" width="20"></img>
                                    {video.title}
                                </Link>
                            ))
                        }
                    </div>
                    :
                    <></>
            }

        </div>
    );
}
