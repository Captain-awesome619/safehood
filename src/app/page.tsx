'use client';
import React, { useEffect, useState,useRef } from 'react';
import Image from "next/image";
import logo from '../assets/logo.svg'
import info from '../assets/informationsafetybacked.svg'
import { Dialog } from 'radix-ui';
import line from '../assets/line.svg'
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useGlobalContext } from './context/GlobalProvider';
import { createUser, getCurrentUser, signIn } from './lib/appwrite';
import { ClipLoader } from 'react-spinners';
import { FaCloudDownloadAlt } from "react-icons/fa";
import { FaWhatsappSquare } from "react-icons/fa";
import { SiGmail } from "react-icons/si";
export default function Home() {
  const navigate = useRouter()
  const [count, setCount] = useState<boolean>(false);
  const { loading, isLogged,setUser,setIsLogged,user } = useGlobalContext()
  const [isSubmitting, setSubmitting] = useState(false);;
  
 
  interface FormState {
    username: string;
    email: string;
    password: string;
    confirmpassword : string
    category : string
    categoryid :  File | null,
  }
  interface FormState2 {
   
    email: string;
    password: string;

  }
  const [form, setForm] = useState<FormState>({
    username: "",
    email: "",
    password: "",
    confirmpassword: "",
    category : "",
    categoryid : null
  });
  const [form2, setForm2] = useState<FormState2>({
   
    email: "",
    password: "",
   
  });

  const [errors, setErrors] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [errors2, setErrors2] = useState({
    email: '',
    password: '',
  });

const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };


 const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setForm((prev:FormState) => ({ ...prev, categoryid : file }));
    }
  };


  const validateAllFields2 = () => {
    setErrors2({
      email: !form2.email.includes('@') ? 'Enter your mail' : '',
    
      password:
        form2.password.length < 8 ? ' Enter your password(it is at least 8 characters)' : '',
    });
  };
  useEffect(() => {
    validateAllFields2();
  }, [form2]);
  const isFormInvalid2 = Object.values(errors2).some((e) => e !== '');

  // Validation runs every time the form changes
  useEffect(() => {
    validateAllFields();
  }, [form]);

  const validateAllFields = () => {
    setErrors({
      email: !form.email.includes('@') ? 'Enter your email address' : '',
      username: form.username.trim() === '' ? 'Username is required' : '',
      password:
        form.password.length < 8 ? 'Password must be at least 8 characters' : '',
      confirmPassword:
        form.confirmpassword !== form.password ? 'Passwords do not match' : '',
    });
  };

  const isFormInvalid = Object.values(errors).some((e) => e !== '');


  const submit = async () => {
    if (form.username === "" || form.email === "" || form.password === "" || form.category === "" || form.categoryid === null) {
      alert("Error: Please fill in all fields");
      return; 
    }

      setSubmitting(true);
      try {
        console.log('started')
        const result = await createUser(form.email, form.password, form.username, form.category, form.categoryid);
        console.log('here')
        console.log(form);
        console.log(result);
        setUser(result);
        setIsLogged(true);
        alert('user successfully signed in')
        navigate.push("/dashboard");
      } catch (error) {
        console.log(error);
        alert("There was an error signing in");
      } finally {
        setSubmitting(false);
      }
    
  };
  
  const submit2 = async () => {
    if (form2.email === "" || form2.password === "") {
      alert("Please fill in all fields");
    }
    setSubmitting(true);
    try {
      await signIn(form2.email, form2.password);
      const result = await getCurrentUser();
      setUser(result);
      setIsLogged(true);

      alert("Success User signed in successfully");
      navigate.push("/dashboard");
    } catch (error) {
      alert("Error signing in");
    } finally {
      setSubmitting(false);
    }
  };


  function Account() {
    setCount(!count)
  }
  
  function Move() {
    navigate.push('/dashboard')
  }
  useEffect(() => {
    if (isLogged && !loading) {
      navigate.push("/dashboard");
    }
  }, [isLogged,loading]); 

  const categories = ['Student', 'Resident', 'Staff'];

  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, category: e.target.value });
  };
  
 


  return (
    
    <div className="lg:grid flex-col  gap-[1.5rem] overflow-x-hidden p-0 pb-[1rem]  lg:px-[2rem] bg-primary1   h-screen  ">
 
     <div className="flex justify-between items-center p-[1rem] lg:px-0 pb-[5rem] lg:pb-0  ">
     <div className="lg:pl-[4rem] pl-0   ">
     <Image 
     src={logo}
     height={50}
     width={50}
     alt="logo"
     className="lg:w-[200px] lg:h-[100px] w-[100px] h-[50px]"
     />
 </div>
     <div className="flex gap-[1rem]  lg:gap-[2rem] justify-center  ">
     <h3 className="lg:text-[24px] text-[17px] cursor-pointer font-[400] text-primary2 duration-500 hover:text-secondary">About</h3>
  <Dialog.Root>
    <Dialog.Trigger>
     <h3  className="lg:text-[24px] text-[17px] cursor-pointer font-[400]  text-primary2 duration-500 hover:text-secondary">Contact</h3>

<Dialog.Overlay >
     <motion.div
   className="fixed w-screen inset-0 duration-1000 backdrop-blur-md   "
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.5 }}
  />
     </Dialog.Overlay>
</Dialog.Trigger>
 <Dialog.Content aria-description='form' className='  h-max p-[2rem] lg:py-[1rem] lg:px-[3rem]   fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  flex flex-col items-center justify-center gap-[1.5rem] bg-secondary  rounded-3xl ' >
<Dialog.Title className='hidden'>Settings</Dialog.Title>
<div className='px-[2rem] py-[1rem] flex flex-row lg:gap-[3rem] gap-[2rem] items-center justify-center'>
     <a  href="mailto:Anjieroja@gmail.com" target="_blank" rel='noreferrer'><SiGmail   size={25} className=' cursor-pointer '  /> </a>
 <a href="https://Wa.me/+2347068597323" target="_blank" rel='noreferrer'><FaWhatsappSquare size={25}  className=' cursor-pointer'/></a>
</div>
</Dialog.Content>
</Dialog.Root>
     </div>
     </div>
     <div className="flex lg:flex-row flex-col items-center justify-center ">
     <div className="bg-[url('/images/background1.svg')] bg-no-repeat lg:w-[1065px] lg:h-[620px] mr-[1rem] m-auto w-screen h-[500px]">
     </div>
     <div className="flex flex-col gap-[1rem] lg:gap-[0.2rem]  lg:ml-[-26%] mt-[-90%] md:mt-[-50%] lg:mt-0">
    
     <Image
     src={info}
     width={50}
     height={50}
     alt="info"
     className="lg:w-[600px] lg:h-[300px] w-[250px] h-[150px] lg:flex hidden"
     />

<h3 className="lg:hidden flex flex-col text-primary2 text-[50px] font-[600] text-center">
Information<br></br> Backed<br></br> Safety.
</h3>

<Dialog.Root>
    <div className="flex justify-center items-center pl-[0rem] lg:pl-[7rem] lg:items-center">
    <Dialog.Trigger asChild>

     <button className="px-[2rem] hover:text-secondary hover:bg-primary1 duration-500 py-[1rem] text-primary1 rounded-4xl bg-secondary cursor-pointer">
     <h4 className="lg:text-[24px]  font-[500]">Sign up/Log in</h4>
     </button>
     </Dialog.Trigger>
    
     <Dialog.Overlay >
     <motion.div
   className="fixed w-screen inset-0 duration-1000 backdrop-blur-md   "
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.5 }}
  />
     </Dialog.Overlay>
     
    
  
     <motion.div
     initial={{ opacity: 0 }}
     animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
     >
     { count === false ?
       
     <Dialog.Content aria-description='form' className='  h-max p-[2rem] lg:py-[1rem] lg:px-[3rem]   fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  flex flex-col items-center justify-center gap-[1.5rem] bg-secondary  rounded-3xl ' >
     
          <Dialog.Title className='hidden'>Settings</Dialog.Title>
     <div className='flex flex-col gap-[0.5rem] py-[0.5rem] lg:py-0'>
     <div>
          <input
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            value={form.email}
            placeholder='Email Address'
            type='email'
        
            className='text-primary2 focus:ring-0 outline-none border-[1px] px-[1rem] rounded-2xl bg-primary1 h-[65px] w-[300px]'
          />
            {errors.email && <p className='text-red-500 text-sm'>{errors.email}</p>}
        </div>

        <div>
          <input
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            value={form.username}
            placeholder='Username'
       
            type='text'
            className='text-primary2 focus:ring-0 outline-none border-[1px] px-[1rem] rounded-2xl bg-primary1 h-[65px] w-[300px]'
          />
             {errors.username && <p className='text-red-500 text-sm'>{errors.username}</p>}
        </div>

<div className='flex flex-col gap-[0.5rem]'>
  <h2 className='text-[14px] lg:text-[16px] text-primary1 font-[500]'>Select your category</h2>
  <div className="flex gap-[2rem]">
    {categories.map((cat) => (
      <label key={cat} className="flex items-center gap-2  text-primary1">
        <input
          type="radio"
          name="category"
          value={cat}
          checked={form.category === cat}
          onChange={handleCategoryChange}
          className='text-primary1 cursor-pointer'
        />
        {cat}
      </label>
    ))}
  </div>
</div>

{
  form.category ?
    <div className=' border-[2px]  flex flex-col gap-[0.5rem] lg:gap-[0.5rem] rounded-3xl border-primary1'>
       <div className='p-[0.5rem] flex flex-col gap-[0.5rem] items-center justify-center'> 
        <FaCloudDownloadAlt size={30} className='text-primary1' />
        <div className='w-max'>
          {form.category === 'Student' ? <h4 className= '  text-[13px] font-[600px] text-primary1'> Upload a clear picture of your student id card</h4>
        :
        ''  
        }
          {form.category === 'Resident' ? <h4 className='text-[13px] font-[600px] text-primary1'> Upload a clear picture of a recent Tenancy Bill</h4>
        :
        ''  
        }
          {form.category === 'Staff' ? <h4 className='text-[13px] font-[600px] text-primary1'> Upload a clear picture of your ID</h4>
        :
        ''  
        }
        </div>
        </div>  
  <div className='flex flex-col items-center justify-center pb-[0.5rem]'>
     <h3 className=" text-[13px] font-medium text-primary1">
          Selected File: {form?.categoryid?.name}
        </h3>
       
     <input
        type="file"
          accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
<button className='px-[1.2rem] py-[0.5rem] text-[14px] cursor-pointer rounded-2xl bg-primary1 text-secondary'
 onClick={handleButtonClick}
>Upload
</button>
    </div>
    </div>
    :
    ''
}

        <div>
          <input
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            value={form.password}
            placeholder='Create a password'
            type='password'
           
            className='text-primary2 focus:ring-0 outline-none border-[1px] px-[1rem] rounded-2xl bg-primary1 h-[65px] w-[300px]'
          />
          {errors.password && <p className='text-red-500 text-sm'>{errors.password}</p>}
        </div>

        <div>
          <input
            onChange={(e) => setForm({ ...form, confirmpassword: e.target.value })}
            value={form.confirmpassword}
        
            placeholder='Confirm your password'
            type='password'
            className='text-primary2 focus:ring-0 outline-none border-[1px] px-[1rem] rounded-2xl bg-primary1 h-[65px] w-[300px]'
          />
         {errors.confirmPassword && (
          <p className='text-red-500 text-sm'>{errors.confirmPassword}</p>
        )}
        </div>
     </div>
    
     <button onClick={submit} disabled={isFormInvalid} className={`  rounded-2xl px-[1.5rem] py-[0.5rem] text-white 
     ${
    isFormInvalid ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary1 cursor-pointer'
  }
      `}>
 {isSubmitting ?  <ClipLoader size={25} color='white'  className='text-primary1' /> : "Sign up"}
     </button>
     <Image 
     src={line}
     height={50}
     width={320}
     alt="logo"
     />
     <h3 className='text-primary1 font-[500] '>Or already have an account? <span className='text-primary1 font-[700] cursor-pointer' onClick={Account}>Sign in</span></h3>
     </Dialog.Content>
   
     :
    
     <Dialog.Content aria-description='form' className=' h-max p-[2rem] lg:p-[3rem]  fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center gap-[1.5rem] bg-secondary  rounded-3xl ' >
     
     <Dialog.Title className='hidden'>Settings</Dialog.Title>
<div className='flex flex-col gap-[0.5rem] py-[0.5rem] lg:py-0'>
<input onChange={(e) => setForm2({ ...form2, email: e.target.value })} value={form2.email} placeholder='Email Address' type='email' className='text-primary2 focus:ring-0 outline-none border-[1px] px-[1rem] rounded-2xl bg-primary1 h-[65px] w-[300px]' />
{errors2.email && <p className='text-red-500 text-sm'>{errors2.email}</p>}
<input  onChange={(e) => setForm2({ ...form2, password: e.target.value })} value={form2.password} placeholder='Enter your password' type='password' className='text-primary2 focus:ring-0 outline-none border-[1px] px-[1rem] rounded-2xl bg-primary1 h-[65px] w-[300px]' />
{errors2.password && <p className='text-red-500 text-sm'>{errors2.password}</p>}
</div>
<button  disabled={isFormInvalid2}  className={`  rounded-2xl px-[1.5rem] py-[0.5rem] text-white 
     ${
    isFormInvalid2 ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary1 cursor-pointer'
  }
      `} onClick={submit2}>
{isSubmitting ?  <ClipLoader size={25}  color='white' className='text-primary1' /> : "Sign in"}
</button>
<Image 
src={line}
height={50}
width={320}
alt="logo"
/>
<h3 className='text-primary1 font-[500]'>Dont have an account? <span className='text-primary1 font-[700] cursor-pointer' onClick={Account}>Sign up</span></h3>

</Dialog.Content>

}
</motion.div>

     </div>
     </Dialog.Root>
     </div>
    
     </div>
    </div>
  );
}
