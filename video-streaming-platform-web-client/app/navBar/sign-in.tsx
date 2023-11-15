'use client';

import styles from './sign-in.module.css'
import { signInWithProvider, signOut } from "../firebase/firebase";
import { User } from "firebase/auth";
import Image from 'next/image';
import { useState } from "react";
interface SignInProps {
    user: User | null;
}



export default function SignIn({ user }: SignInProps) {
    const [showSignInOptions, setShowSignInOptions] = useState(true);

    const toggleSignInOptions = () => {
        setShowSignInOptions(!showSignInOptions);
    };
    
    const handleClick = () => {
        signOut();
        toggleSignInOptions();
    }

    return (
        <div className={user ? styles.signInContainer : styles.signInContainerMultiple}>
            {user ?
                (
                    <button className={styles.signin} onClick={handleClick}>
                        Sign Out
                    </button>
                ) : (
                    <div>
                        {
                            showSignInOptions ? (
                                <button className={styles.signin} onClick={toggleSignInOptions}>
                                    Sign In
                                </button>
                            ) : (
                                <div>
                                    <button className={styles.signin} onClick={() => signInWithProvider('GitHub')}>
                                        Sign In
                                        <span style={{ display: 'flex', alignItems: 'center', marginLeft: '8px' }}>
                                            <Image src="/github.png" alt="GitHub" width={20} height={20} />
                                        </span>
                                    </button>
                                    <button className={styles.signin} onClick={() => signInWithProvider('Google')}>
                                        Sign In
                                        <span style={{ display: 'flex', alignItems: 'center', marginLeft: '8px' }}>
                                            <Image src="/google.png" alt="Google" width={20} height={20} />
                                        </span>
                                    </button>
                                </div>
                            )
                        }
                    </div>
                )
            }
        </div>
    )
}

