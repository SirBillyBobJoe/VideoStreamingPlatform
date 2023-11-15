'use client';

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import styles from "./upload.module.css";
import Link from 'next/link';


export default function Upload() {
   

    return (
        <div className="pageContainer">
            <ToastContainer />
            <Link href="/upload">
                <label className={styles.uploadButton}>
                    <img
                        src="/sbbjUpload.png" alt="SBBJ Upload" width={150} height={150}
                    />
                </label>
            </Link>
        </div>
    )
}