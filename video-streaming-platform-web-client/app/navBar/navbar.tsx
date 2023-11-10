'use client';

import Image from "next/image";
import Link from "next/link";
import styles from "./navbar.module.css";
import SignIn from "./sign-in";
import { onAuthStateChangedHelper } from "../firebase/firebase";
import {useEffect, useState } from "react";
import { User } from "firebase/auth";

export default function Navbar() {
    //init user state
    const [user,setUser]= useState<User|null>(null);
    useEffect(()=>{
        const unsubscribe=onAuthStateChangedHelper((user)=>{
            setUser(user);
        });
        //cleanup subscription on unmount
        return()=>unsubscribe();
    });

    return (
        <nav className={styles.nav}>
            <Link href="/">
                <Image
                    src="/sbbj.png" alt="SBBJ" width={90} height={90}
                />
            </Link>
            <SignIn user={user}/>
        </nav>
    );
}