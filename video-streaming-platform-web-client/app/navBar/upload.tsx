'use client';

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { uploadVideo } from "../firebase/functions";

import styles from "./upload.module.css";


export default function Upload() {
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.item(0);
        if (file) {
            handleUpload(file);
        }
    }

    const handleUpload = async (file: File) => {
        try {
            const response = await uploadVideo(file);
            // Display a success toast
            toast.success('File uploaded successfully!', {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                progress: undefined,

            });
        } catch (err) {
            // Display an error toast
            toast.error(`Failed to upload file: ${err}`, {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                progress: undefined,

            });
        }

    }

    return (
        <div className="pageContainer">
            <ToastContainer />
            <input id="upload" className={styles.uploadInput} type='file' accept="video/*"
                onChange={handleFileChange}
            />
            <label htmlFor="upload" className={styles.uploadButton}>
                <img
                    src="/sbbjUpload.png" alt="SBBJ Upload" width={150} height={150}
                />
            </label>
        </div>
    )
}