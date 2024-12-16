import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { updateUser, fetchRoles } from "@/lib/APIServices/User/api"

const staffSchema = z.object({
  userId: z.number(),
  username: z.string().min(3, "Username must be at least 3 characters").max(50, "Username must be 50 characters or less"),
  email: z.string().email("Invalid email address"),
  roleId: z.number().int().positive("Role is required"),
  phoneNumber1: z.string().min(10, "Phone number must be at least 10 characters").max(20, "Phone number must be 20 characters or less"),
  addressDistrict: z.string().min(3, "District must be at least 3 characters").max(100, "District must be 100 characters or less"),
  addressCity: z.string().min(3, "City must be at least 3 characters").max(100, "City must be 100 characters or less"),
  addressRoad: z.string().min(3, "Road must be at least 3 characters").max(100, "Road must be 100 characters or less"),
  gender: z.enum(['male', 'female', 'other'], {
    errorMap: () => ({ message: "Invalid gender" })
  }),
  birthday: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date format"
  }),
})

export function StaffUpdateForm({ staffData, onUpdate, onCancel }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [roles, setRoles] = useState([])

  const form = useForm({
    resolver: zodResolver(staffSchema),
    defaultValues: {
      ...staffData,
      birthday: staffData.birthday.split('T')[0],
    },
  })

  useEffect(() => {
    const fetchRolesData = async () => {
      try {
        const rolesData = await fetchRoles()
        setRoles(rolesData)
      } catch (error) {
        console.error("Error fetching roles:", error)
        setRoles([])
      }
    }
    fetchRolesData()
  }, [])

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    try {
      const updatedStaff = await updateUser(data)
      onUpdate(updatedStaff)
    } catch (error) {
      console.error("Failed to update staff:", error)
      form.setError('root', { type: 'manual', message: error.message })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <ScrollArea className="h-[80vh] pr-4">
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
            name="roleId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <Select onValueChange={(value) => field.onChange(Number(value))} defaultValue={field.value.toString()}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role.roleId} value={role.roleId.toString()}>
                        {role.roleName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Updating...' : 'Update Staff'}
            </Button>
          </div>
        </form>
      </Form>
    </ScrollArea>
  )
}