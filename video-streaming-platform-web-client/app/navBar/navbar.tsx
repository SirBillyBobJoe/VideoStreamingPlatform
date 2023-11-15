'use client';

import Image from "next/image";
import Link from "next/link";
import styles from "./navbar.module.css";
import SignIn from "./sign-in";
import { onAuthStateChangedHelper } from "../firebase/firebase";
import { useEffect, useState } from "react";
import { User } from "firebase/auth";
import Upload from "./upload";

export default function Navbar() {
    //init user state
    const [user, setUser] = useState<User | null>(null);
    useEffect(() => {
        const unsubscribe = onAuthStateChangedHelper((user) => {
            setUser(user);
        });
        //cleanup subscription on unmount
        return () => unsubscribe();
    });

    const handleRefresh = () => {
        window.location.href = '/';
    }

    return (
        <nav className={styles.nav}>
            <Image className={styles.home}
                src="/sbbj.png" alt="SBBJ" width={90} height={90} onClick={handleRefresh}
            />

            {user && <Upload />}
            <div>
                <SignIn user={user} />
            </div>
        </nav>
    );
}