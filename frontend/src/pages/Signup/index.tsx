import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import axios from 'axios'
import { useNavigate,Link } from "react-router-dom"
import { signup } from "@/api/user"
import SingUpAnimation from '../../assets/signup.json'
import Lottie from 'lottie-react'
import { toast } from "sonner"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

interface Error{
    message:string,
    status:string
}
const schema = z.object({
  username: z.string().min(3,"Username must contain at least 3 characters"),
  email: z.string().email("Invalid email address").min(1,"Email is required"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least one special character")
});

const Signup = () => {
  const form = useForm(
    {
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
    resolver:zodResolver(schema)
  }
  )
  
  
  const navigate = useNavigate()
  const [_error,setError] = useState<Error | null>(null)
  const [loading,setLoading] = useState<boolean>(false)

  async function onSubmit(values:any) {
    try {
      setLoading(true)
      setError(null)
      const response = await signup(values)
      if (!response) {
        setLoading(false)
      }
      setError(null)
      setLoading(false)
      toast("User Registered SuccessFully")
      navigate(`/verify/${values.email}`)
    } catch (error:unknown) {
     if (axios.isAxiosError(error)) {
       if (error.response) {
        setLoading(false)
        setError(error.response.data)
        toast("Signup failed!!!")
      }
     }
    }
  }
  
  return (
    <section className="h-auto flex items-center justify-center mt-20">
      <div className="w-full sm:max-w-[60%] mx-auto flex items-center justify-center gap-10">
        <div className="w-1/2">
       <Lottie animationData={SingUpAnimation} />
        </div>
        <div className="w-1/2 p-2">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full sm:max-w-[60%]">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem className="space-y-5">
                      <FormLabel className="text-teal-500 text-lg">Username</FormLabel>
                      <FormControl>
                        <Input placeholder="username" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="space-y-5">
                      <FormLabel className="text-teal-500 text-lg">Email</FormLabel>
                      <FormControl>
                        <Input placeholder="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="space-y-5">
                      <FormLabel className="text-teal-500 text-lg">Password</FormLabel>
                      <FormControl>
                        <Input placeholder="password" type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="w-full flex items-center justify-center">
                    <Button type="submit" className="w-full bg-teal-500 hover:bg-purple-500">{!loading?'Register':'Registering....'}</Button>
                </div>
                <div>
                  <p>Already have a Account? <Link to={'/login'} className="text-teal-500 text-xl underline"> Login</Link></p>
                </div>
              </form>
            </Form>
        </div>
       

      </div>
    </section>
  )
}

export default Signup