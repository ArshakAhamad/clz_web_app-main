import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { fetchUserData } from "@/lib/APIServices/User/api"
import { useAuth } from '@/contexts/AuthContext'

const userSchema = z.object({
  userId: z.number(),
  username: z.string().min(3).max(50),
  email: z.string().email(),
  phoneNumber1: z.string().min(10).max(20),
  addressDistrict: z.string().min(3).max(100),
  addressCity: z.string().min(3).max(100),
  addressRoad: z.string().min(3).max(100),
  gender: z.enum(['male', 'female', 'other']),
  birthday: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date format"
  }),
})

export function UpdateProfile() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { user, updateUser } = useAuth()

  const form = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: {
      userId: 0,
      username: '',
      email: '',
      phoneNumber1: '',
      addressDistrict: '',
      addressCity: '',
      addressRoad: '',
      gender: 'male',
      birthday: '',
      active: 1,
    },
  })
  useEffect(() => {
    const loadUserData = async () => {
      setIsLoading(true)
      try {
        const response = await fetchUserData()
        const userData = response?.data // Assuming response contains { data: {...} }
        console.log("Fetched user data:", userData)
  
        if (userData) {
          form.reset({
            userId: userData.userId || 0,
            username: userData.username || '',
            email: userData.email || '',
            phoneNumber1: userData.phoneNumber1 || '',
            addressDistrict: userData.addressDistrict || '',
            addressCity: userData.addressCity || '',
            addressRoad: userData.addressRoad || '',
            gender: userData.gender || 'male',
            birthday: userData.birthday ? new Date(userData.birthday).toISOString().split('T')[0] : '',
          })
          console.log("Form reset with user data:", form.getValues())
        } else {
          console.error("No user data received")
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
      } finally {
        setIsLoading(false)
      }
    }
    loadUserData()
  }, [form])
  
/*
  useEffect(() => {
    const loadUserData = async () => {
      setIsLoading(true)
      try {
        const userData = await fetchUserData()
        console.log("Fetched user data:", userData)
        if (userData) {
          form.reset({
            userId: userData.userId,
            username: userData.username || '',
            email: userData.email || '',
            phoneNumber1: userData.phoneNumber1 || '',
            addressDistrict: userData.addressDistrict || '',
            addressCity: userData.addressCity || '',
            addressRoad: userData.addressRoad || '',
            gender: userData.gender || 'male',
            birthday: userData.birthday ? new Date(userData.birthday).toISOString().split('T')[0] : '',
          })
          console.log("Form reset with user data:", form.getValues())
        } else {
          console.error("No user data received")
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
      } finally {
        setIsLoading(false)
      }
    }
    loadUserData()
  }, [form])
*/
  const onSubmit = async (data) => {
    setIsSubmitting(true)
    try {
      const response = await fetch(`${import.meta.env.VITE_SERVER_API}/user/update/${data.userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        throw new Error('Failed to update profile')
      }

      const updatedUser = await response.json()
      updateUser(updatedUser)
      alert('Profile updated successfully')
    } catch (error) {
      console.error("Failed to update profile:", error)
      form.setError('root', { type: 'manual', message: error.message })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return <div>Loading user data...</div>
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phoneNumber1"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="addressDistrict"
          render={({ field }) => (
            <FormItem>
              <FormLabel>District</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="addressCity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>City</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="addressRoad"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Road</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Gender</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="birthday"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Birthday</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {form.formState.errors.root && (
          <p className="text-sm font-medium text-destructive">{form.formState.errors.root.message}</p>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Updating...' : 'Update Profile'}
        </Button>
      </form>
    </Form>
  )
}