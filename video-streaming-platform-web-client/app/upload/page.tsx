'use client';

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { uploadVideo } from "../firebase/functions";
import { useRef, useState } from 'react';
import styles from "./page.module.css";


export default function Upload() {
    const [video, setVideo] = useState<File | null>(null);
    const [image, setImage] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [imagePreviewUrl, setImagePreviewUrl] = useState('');
    const [title, setTitle] = useState<string>('');

    const [description, setDescription] = useState<string>('');

    const fileInputRefVideo = useRef<HTMLInputElement>(null);
    const fileInputRefImage = useRef<HTMLInputElement>(null);

    const handleChangeTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log(title)
        setTitle(event.target.value)
    }

    const handleChangeDescription = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        console.log(description)
        setDescription(event.target.value)
    }

    const handleFileChangeVideo = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.item(0);
        if (file) {
            setVideo(file);
        }
    }

    const handleFileChangeImage = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.item(0);
        if (file) {
            setImage(file);
            const fileUrl = URL.createObjectURL(file);
            setImagePreviewUrl(fileUrl);
        }
    };

    const handleUpload = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setIsUploading(true);
        try {
            if (video == null) {
                throw new Error('No video selected');
            }
            if (title == null || title == '') {
                throw new Error('No title inputted');
            }


            const response = await uploadVideo(video, title, description,image);
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

        if (fileInputRefVideo.current) {
            fileInputRefVideo.current.value = ""; 
        }
        if (fileInputRefImage.current) {
            fileInputRefImage.current.value = ""; 
        }
        setImagePreviewUrl("")
        setTitle("")
        setDescription("")
        setVideo(null);
        setImage(null)
        setIsUploading(false);
    }


    return (
        <div className={styles.uploadContainer}>
            <ToastContainer />
            {
                isUploading ? (
                    <div className={styles.loadingContainer}>
                        <img src="loading.gif" alt="loading" />
                        <div>Uploading...</div>
                    </div>
                ) : (
                    <>
                        <h1>Upload Page</h1>
                        <form onSubmit={handleUpload} className={styles.uploadForm}>
                            <label htmlFor="title" className={styles.label}>Title</label>
                            <input id="title" onChange={handleChangeTitle} type='text' value={title} className={styles.input} />

                            <label htmlFor="videoDescription" className={styles.label}>Description</label>
                            <textarea onChange={handleChangeDescription} id="videoDescription" name="videoDescription" value={description} className={styles.textarea}></textarea>

                            <label htmlFor="uploadVideo" className={styles.label}>Select Video</label>
                            <input ref={fileInputRefVideo} id="uploadVideo" type='file' accept="video/*"
                                onChange={handleFileChangeVideo} className={styles.input}
                            />
                            <label htmlFor="uploadImage" className={styles.label}>Select Thumbnail</label>
                            <input ref={fileInputRefImage} id="uploadImage" type='file' accept="image/*"
                                onChange={handleFileChangeImage} className={styles.input}
                            />
                             {imagePreviewUrl && <img src={imagePreviewUrl} alt="Thumbnail preview" className={styles.imagePreview} width="100" height="100"/>}
                            <button type='submit' className={styles.button}>Upload Video</button>
                        </form>
                    </>
                )}
        </div>
    );
}