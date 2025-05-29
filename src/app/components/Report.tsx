'use client'
import React from 'react'
import { useState } from 'react'
import { useGlobalContext } from '../context/GlobalProvider'
import { useRef } from 'react'
import { IoIosArrowRoundBack } from "react-icons/io";

import { ClipLoader } from 'react-spinners'
import { createPost } from '../lib/appwrite'
import { storage } from '../lib/appwrite'
import { appwriteConfig } from '../lib/appwrite'
import { ID} from "appwrite";
const Report = () => {
  interface FormState {
    category: string; 
    color: string;
    thumbnail: File[];
description : string;
report : string;
location : string;
userId : '';
  }
 const [uploading, setUploading] = useState(false);
  const [step, setstep] = useState<number>(1);
  const { user} = useGlobalContext();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  const files = event.target.files;
  if (files) {
    const newFiles = Array.from(files).slice(0, 3);
    setform((prev) => {
      const combinedFiles = [...prev.thumbnail, ...newFiles].slice(0, 3);
      return { ...prev, thumbnail: combinedFiles };
    });
  }
  // Reset input so user can select same file again if needed
  event.target.value = '';
};


  const [form, setform] = useState<FormState>({ 
    category: '', 
    color: '',
thumbnail: [],
description : '',
report : '',
location : '',
userId : user?.$id
   })
   const handleClick = (category: string, color: string) => {
    setform((prev) => ({
      ...prev,
      category,
      color,
    }));
    console.log({ category, color });
    setstep(2);
  };
  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setform((prev) => ({ ...prev, location: e.target.value }));
  };
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setform((prev) => ({ ...prev, [name]: value }));
  };
  
 const submit = async () => {
  if (
    form.color === '' ||
    form.category === '' ||
    form.description === '' ||
    form.thumbnail.length === 0 ||
    form.report === '' ||
    form.location === ''
  ) {
    alert('Error: Please fill in all fields');
    return;
  }

  setUploading(true);

  try {
    console.log('Started uploading...');

    // 1. Upload each thumbnail and get the URLs
    const uploadedThumbnailUrls = await Promise.all(
      form.thumbnail.map(async (file) => {
        const uploadedFile = await storage.createFile(
          appwriteConfig.storageId,
          ID.unique(),
          file
        );
        return storage.getFileView(appwriteConfig.storageId, uploadedFile.$id).href;
      })
    );

    // 2. Create the post with the array of image URLs
   const result = await createPost(
  {
    ...form,
  },
  uploadedThumbnailUrls // ✅ This is the second required argument
);


    console.log(result);
    alert('Post uploaded successfully');
    window.location.reload();
  } catch (error) {
    console.log(error);
    alert('There was an error uploading your post');
  } finally {
    setUploading(false);
  }
};

  return (
    <div className='grid gap-[2rem]'>
{console.log(form.thumbnail)}
     <h3 className='lg:text-[30px] text-[27px] text-primary1 font-[600]'>
     Make a Report
     </h3>
     <div className='lg:h-max h-max p-[1rem] lg:px-[2rem] lg:py-[3rem] grid gap-[2rem] w-[100%] lg:w-[80%] bg-primary1 rounded-3xl'>
{ step === 1?
<div className='grid gap-[2rem]'>
     <h4 className='lg:text-[20px] text-[17px] text-secondary font-[600]'>
     What are you reporting on?
     </h4>
     <div className='grid gap-[1rem]'>
     <div className='flex gap-[1.5rem] items-center'>  
     <div className='h-[20px] w-[20px] bg-red-500 shadow-[0_0_10px_4px_rgba(239,68,68,0.6)] rounded-[50%]'>  </div>
     <h2 className='text-[20px] lg:text-[30px] text-primary2 font-[600] cursor-pointer' onClick={() => handleClick('Safety Hazard', 'red')}>Safety Hazard </h2>
     </div>
     <div className='flex gap-[1.5rem] items-center '>  
     <div className='h-[20px] w-[20px] bg-amber-500 shadow-[0_0_10px_4px_rgba(245,158,11,0.6)] rounded-[50%]'>  </div>
     <h2 className='text-[20px] lg:text-[30px] text-primary2 font-[600] cursor-pointer'  onClick={() => handleClick('Crime', 'amber')}>Crime</h2>
     </div>
     <div className='flex gap-[1.5rem] items-center '>  
     <div className='h-[20px] w-[20px] bg-yellow-500 shadow-[0_0_10px_4px_rgba(234,179,8,0.6)] rounded-[50%]'>  </div>
     <h2 className='text-[20px] lg:text-[30px] text-primary2 font-[600] cursor-pointer' onClick={() => handleClick('Suspicious Activity', 'yellow')}>Suspicious Activity</h2>
     </div>
     <div className='flex gap-[1.5rem] items-center '>  
     <div className='h-[20px] w-[20px] bg-pink-500 shadow-[0_0_10px_4px_rgba(236,72,153,0.6)] rounded-[50%]'>  </div>
     <h2 className='text-[20px] lg:text-[30px] text-primary2 font-[600] cursor-pointer'  onClick={() => handleClick('Others', 'pink')}>Others</h2>
     </div>

     </div>
     </div>
     :
     ''
}
{
  step === 2 ?
  <div className='flex justify-between flex-col'>
    <div className='grid gap-[1rem]'>
       <IoIosArrowRoundBack onClick={()=>setstep(1)} className='text-white cursor-pointer ' size={30} />
    <h4 className='lg:text-[20px] text-[17px] text-primary2 font-[600]'>
    Describe The Incident.
     </h4>
     <div className="">
  <input
    type="text"
      name="description"
    value={form.description}
        onChange={handleChange}
    placeholder="Subject"
    className="w-full bg-transparent border-b  focus:outline-none  placeholder-gray-400  text-lg text-secondary font-semibold py-2"
  />

  <textarea
    placeholder="What Happened and what did you notice?"
    className="w-full mt-4 bg-transparent duration-500 ease-in focus:outline-none focus:border-secondary placeholder-gray-400 text-base text-secondary py-2 resize-none h-32"
      name="report"
    value={form.report}
    onChange={handleChange}
 ></textarea>
 {form.thumbnail.length && (
        <h3 className="mt-4 text-lg font-medium text-secondary">
          Selected File: <ul className="list-disc list-inside">
      {form.thumbnail.map((file, index) => (
        <li key={index}>{file.name}</li>
      ))}
    </ul>
        </h3>
      )}
       <input
        type="file"
          accept="image/*"
        multiple
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
</div>
    </div>
    <div className='flex justify-between items-center'>
    <div> 
    <button className='bg-transparent border-0 text-[20px] lg:text-[25px] font-[600] opacity-[0.6] text-secondary cursor-pointer'  onClick={handleButtonClick}>
Add Media
    </button>
    </div>
    <div>
    <button
                className='cursor-pointer font-[600] bg-secondary rounded-2xl px-[1rem] lg:px-[1.5rem] py-[0.5rem] text-primary1'
                onClick={()=>setstep(3)}
             >
               Next
              </button>
              </div>
    </div>
     </div>
  :
  ''
}
{ step === 3 ?
       <div className='grid gap-[2rem] '>    
            <IoIosArrowRoundBack onClick={()=>setstep(2)} className='text-white cursor-pointer ' size={30} />
              {uploading === true ?
<div className='flex items-center justify-center'>
               <ClipLoader size={40} className='text-primary1 flex items-center justify-center' />
               </div>
               :
               ''
            }
            <select
      value={form.location}  // Bind the selected value to state
      onChange={handleLocationChange}  // Update state on change
      className="w-full cursor-pointer flex flex-col pl-[1rem] items-center justify-center appearance-none bg-primary1 text-secondary  focus:outline-none focus:ring-0 focus:border-secondary text-lg leading-none"
    >
      <option value="" disabled  className='lg:text-[20px] text-[17px] text-primary2 font-[600]'>
        Select a location
      </option>
      <option value="UI Main Gate">UI Main Gate</option>
      <option value="Faculty of Science">Faculty of Science</option>
      <option value="Faculty of Arts">Faculty of Arts</option>
      <option value="Faculty of Socialsciences">Faculty of Social Sciences</option>
      <option value="Faculty of Engineering">Faculty of Engineering</option>
      <option value="University Library">University Library</option>
      <option value="Sports Center">Sports Center</option>
      <option value="University Chapel">University Chapel</option>
      <option value="International Conferencecenter">International Conference Center</option>
      <option value="University Guesthouse">University Guest House</option>
      <option value="Student Affairs">Student Affairs</option>
      <option value="Nnamdiazikiwe Foodcourt">Nnamdi Azikiwe Food Court</option>
      <option value="Studentunion Building">Student Union Building</option>
      <option value="Independence Hall">Independence Hall</option>
      <option value="Mellanby Hall">Mellanby Hall</option>
      <option value="Tedder Hall">Tedder Hall</option>
      <option value="Kuti Hall">Kuti Hall</option>
      <option value="Sultan Bello Hall">Sultan Bello Hall</option>
      <option value="Nnamdi Azikiwe Hall">Nnamdi Azikiwe Hall</option>
      <option value="Queen Elizabeth hall">Queen Elizabeth Hall</option>
      <option value="Queen Idia Hall">Queen Idia Hall</option>
      <option value="Obafemi Awolowo Hall">Obafemi Awolowo Hall</option>
      <option value="Abdul Salami Abubakar Hall">Abdulsalami Abubakar Hall</option>
      <option value="Adetowun Ogunsheye Hall">Adetowun Ogunsheye Hall</option>
    </select>
    <div className='ml-auto'>
    <button 
                className='cursor-pointer font-[600] bg-secondary rounded-2xl px-[1rem] lg:px-[1.5rem] py-[0.5rem] text-primary1'
                onClick={submit}
             >
               Upload post
              </button>
    </div>
         </div>


         :
         ''
}
     </div>
    </div>
  )
}
export default Report
