'use client';
import { useState } from "react";
import styles from "./searchbar.module.css";



export default function Searchbar() {
    const [search,setSearch]=useState("");
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

    return (
        <form onSubmit={handleSubmit} className={styles.searchbar}>
            <input
                type="text"
                placeholder="Search..."
                onChange={handleInputChange}
                className={styles.searchinput}
                value={search}
            />
            <button type="submit" className={styles.searchbutton}><img src="/search.png" width="10"></img></button>
        </form>
    );
}
