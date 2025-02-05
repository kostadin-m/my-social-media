import { Dispatch, SetStateAction, Suspense, useEffect, useState } from "react"

//icons
import { ChooseImage } from '@assets'

//components
import { ImagePreview, ImageInput, FormInput, FormWrapper } from '@features/ui'

import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

//custom hooks
import { useThemeContext, useAuthContext, useEditUser } from "@features/hooks"
import { useNavigate } from "react-router-dom"
import { Spinner } from "react-chat-engine-advanced"


export default function EditProfile() {
  const { user } = useAuthContext()
  const { theme } = useThemeContext()
  const { isPending, editUser, error } = useEditUser()
  const navigate = useNavigate()

  const [firstName, setFirstName] = useState<string>(user?.displayName?.split(' ')[0]!)
  const [lastName, setLastName] = useState<string>(user?.displayName?.split(' ')[1]!)
  const [location, setLocation] = useState<string>(user?.location!)
  const [email, setEmail] = useState<string>(user?.email!)

  const [image, setImage] = useState<File | null>(null)
  const [imageError, setImageError] = useState<string | null>(null)

  const doc = { firstName, lastName, location, email, image }

  const changeImageError = (value: string | null) => setImageError(value)
  const changeImage = (value: File | null) => setImage(value)

  const handleChange = (setValue: Dispatch<SetStateAction<string>>, value: string) => {
    setValue(value)
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    await editUser(doc)

    if (!error) navigate('/')
  }

  useEffect(() => {
    if (error) {
      toast.error(error)
    }
    if (imageError) {
      toast.error(imageError)
    }
  })

  return (
    <>
      <FormWrapper theme={theme} title="Edit Profile">
        <form onSubmit={submit}>
          <label htmlFor='img' className={`form-img ${theme}`}>
            <ImageInput onImageChange={changeImage} onImageErrorChange={changeImageError} />
            {image ?
              <ImagePreview image={image} style='image' />
              :
              <img className='image' src={user?.photoURL!} alt='user icon' />
            }
            <img className='choose-img' src={ChooseImage} alt='choose img' />
          </label>
          <FormInput value={firstName} onChange={handleChange.bind(null, setFirstName)} label='First name' />
          <FormInput value={lastName} onChange={handleChange.bind(null, setLastName)} label='Last name' />
          <FormInput value={location} onChange={handleChange.bind(null, setLocation)} label='Location - 𝘰𝘱𝘵𝘪𝘰𝘯𝘢𝘭' optional={true} />
          <FormInput value={email} onChange={handleChange.bind(null, setEmail)} label='Email' type='email' />
          {isPending && <div className="loader" />}
          <button
            disabled={isPending}
            className={`form-btn btn ${theme}`}>
            {isPending ? 'Loading...' : 'Edit Profile'}
          </button>
        </form>
      </FormWrapper>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={theme} />
    </>
  )
}
