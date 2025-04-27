import React, { useState, useEffect, useRef } from 'react';
import { RxAvatar } from "react-icons/rx";
import { storage, databases, appwriteConfig } from '../lib/appwrite';
import { ID } from "appwrite";
import Image from 'next/image';

interface Props {
  user: any;
  id: string;
  pic: string;
}

const Profile = ({ user, id, pic }: Props) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [PicUrl, setPicUrl] = useState<string>('');

  // Fetch the profile picture URL from Appwrite Storage
  const getProfilePictureUrl = async (fileId: string) => {
    try {
      // Use getFileView to get the actual file URL for the image
      const file = await storage.getFileView(appwriteConfig.storageId, fileId);
      setPicUrl(file.href); // Set the image URL for rendering
      return file.href;
    } catch (error) {
      console.error("Error fetching profile picture URL:", error);
      return null;
    }
  };

  useEffect(() => {
    if (user?.picture ) {
      // Only try to fetch the picture if a pic ID exists
      getProfilePictureUrl(pic);
    }
  }, [pic ]); // Re-run when the `pic` prop changes

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Trigger file input
    }
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select a file first!");
    try {
      setUploading(true);
      const uploadedFile = await storage.createFile(
        appwriteConfig.storageId,
        ID.unique(),
        file
      );
      // Update the user profile with the new picture
      await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        id,
        {
          picture: uploadedFile.$id, // Store the file ID in the `picture` field
        }
      );
      window.location.reload()
      setFile(null); // Reset file input
      alert("Profile picture uploaded successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to upload profile picture.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className='flex flex-col'>
   
      <div className='p-[1rem] lg:p-[0.5rem] lg:gap-0 gap-[1rem] flex flex-col bg-primary1 items-center rounded-3xl lg:w-[600px] lg:h-[300px]'>
        <div className="bg-[url('/images/profilebg.svg')] bg-cover bg-bottom w-full h-[180px] rounded-2xl"></div>
        <div className='flex w-full pb-[0.5rem] lg:pb-0 items-center m-auto justify-between'>
          <div className='flex flex-col ml-[1rem] mt-[-3.5rem] lg:mt-[-4rem] items-center justify-center'>
            <div className='rounded-[50%] border-[8px] lg:mb-[1rem] flex items-center justify-center border-primary1'>
              {user?.picture && PicUrl? (
                <Image
                  width={50}
                  height={50}
                  src={PicUrl}
                  alt='avatar'
                  className='w-[100px] h-[90px] rounded-[50%] items-center justify-center'
                />
              ) : (
                <RxAvatar size={70} color='white' />
              )}
            </div>
            <h3 className='font-[600] text-primary2 text-[17px] lg:text-[20px]'>{user?.username}</h3>
          </div>
          <div className='lg:mt-[-2.2rem]'>
            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className='hidden' />
            {!file ? (
              <button
                className='cursor-pointer font-[600] bg-secondary rounded-2xl px-[1rem] lg:px-[1.5rem] py-[0.5rem] text-primary1'
                onClick={handleButtonClick}
              >
                Change picture
              </button>
            ) : (
              <button
                className='cursor-pointer font-[600] bg-secondary rounded-2xl px-[1rem] lg:px-[1.5rem] py-[0.5rem] text-primary1'
                onClick={handleUpload}
                disabled={uploading}
              >
                {uploading ? "Uploading..." : "Upload Picture"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
