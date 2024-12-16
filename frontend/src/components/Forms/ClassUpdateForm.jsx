/*
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MultiSelect } from "@/components/ui/multi-select"
import { updateClass, fetchUsers, fetchRoles } from "@/lib/APIServices/Class/api"

const classSchema = z.object({
  classId: z.number(),
  className: z.string().min(1, "Class name is required").max(100, "Class name must be 100 characters or less"),
  classDate: z.enum(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'], {
    errorMap: () => ({ message: "Invalid class date" })
  }),
  classStartDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date format"
  }),
  classDescription: z.string().max(100, "Description must be 100 characters or less").optional(),
  location: z.string().min(1, "Location is required"),
  classYear: z.number().int().min(2000).max(9999),
  type: z.enum(['individual', 'group', 'hall'], {
    errorMap: () => ({ message: "Invalid class type" })
  }),
  classFee: z.number().positive("Class fee must be positive"),
  freeCard: z.number().int().min(0).max(1),
  registrationFee: z.number().nonnegative("Registration fee must be non-negative"),
  maxStudentCount: z.number().int().positive("Max student count must be positive"),
  accessHaveUsersId: z.array(z.string()).nonempty("At least one user must be selected"),
  active: z.number().int().min(0).max(1),
})

export function ClassUpdateForm({ classData, onUpdate, onCancel }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [users, setUsers] = useState([])
  const [roles, setRoles] = useState([])

  const form = useForm({
    resolver: zodResolver(classSchema),
    defaultValues: {
      ...classData,
      classStartDate: classData.classStartDate.split('T')[0],
      accessHaveUsersId: classData.accessHaveUsersId.map(id => id.toString()),
      active: classData.active ? 1 : 0,
    },
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersData, rolesData] = await Promise.all([fetchUsers(), fetchRoles()])
        setUsers(usersData)
        setRoles(rolesData)
      } catch (error) {
        console.error("Error fetching data:", error)
        setUsers([])
        setRoles([])
      }
    }
    fetchData()
  }, [])

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    try {
      const transformedData = {
        ...data,
        active: data.active ? 1 : 0,
      }
      const updatedClass = await updateClass(transformedData)
      onUpdate(updatedClass)
    } catch (error) {
      console.error("Failed to update class:", error)
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
            name="className"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Class Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="classDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Class Date</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a day" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => (
                      <SelectItem key={day} value={day}>
                        {day.charAt(0).toUpperCase() + day.slice(1)}
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
            name="classStartDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Class Start Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="classDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Class Description</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="classYear"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Class Year</FormLabel>
                <FormControl>
                  <Input type="number" {...field} onChange={e => field.onChange(+e.target.value)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {['individual', 'group', 'hall'].map((type) => (
                      <SelectItem key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
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
            name="classFee"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Class Fee</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} onChange={e => field.onChange(+e.target.value)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="freeCard"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Free Card</FormLabel>
                <FormControl>
                  <Input type="number" {...field} onChange={e => field.onChange(+e.target.value)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="registrationFee"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Registration Fee</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} onChange={e => field.onChange(+e.target.value)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="maxStudentCount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Max Student Count</FormLabel>
                <FormControl>
                  <Input type="number" {...field} onChange={e => field.onChange(+e.target.value)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="accessHaveUsersId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Access Have Users</FormLabel>
                <MultiSelect
                  options={users.map(user => ({
                    label: `${user.username} (${roles.find(role => role.roleId === user.roleId)?.roleName || 'Unknown Role'})`,
                    value: user.userId.toString()
                  }))}
                  value={field.value}
                  onChange={field.onChange}
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="active"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Active</FormLabel>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value === 1}
                    onCheckedChange={(checked) => field.onChange(checked ? 1 : 0)}
                  />
                </FormControl>
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
              {isSubmitting ? 'Updating...' : 'Update Class'}
            </Button>
          </div>
        </form>
      </Form>
    </ScrollArea>
  )
}
  */
 /**
  * !New ClassUpdateForm from Dilshan
  */

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { updateClass, fetchUsers, fetchRoles } from "@/lib/APIServices/Class/api"
import React from 'react'
import SelectNew from 'react-select'
import makeAnimated from 'react-select/animated'



const classSchema = z.object({
  classId: z.number(),
  className: z.string().min(1, "Class name is required").max(100, "Class name must be 100 characters or less"),
  classDate: z.enum(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'], {
    errorMap: () => ({ message: "Invalid class date" })
  }),
  classStartDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date format"
  }),
  classDescription: z.string().max(100, "Description must be 100 characters or less").optional(),
  location: z.string().min(1, "Location is required"),
  classYear: z.number().int().min(2000).max(9999),
  type: z.enum(['individual', 'group', 'hall'], {
    errorMap: () => ({ message: "Invalid class type" })
  }),
  classFee: z.number().positive("Class fee must be positive"),
  freeCard: z.number().int().min(0).max(1),
  registrationFee: z.number().nonnegative("Registration fee must be non-negative"),
  maxStudentCount: z.number().int().positive("Max student count must be positive"),
  accessHaveUsersId: z.array(z.string()).nonempty("At least one user must be selected"),

  active: z.number().int().min(0).max(1),
})

export function ClassUpdateForm({ classData, onUpdate, onCancel }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [users, setUsers] = useState([])
  const [roles, setRoles] = useState([])
  const animatedComponents = makeAnimated()
  const form = useForm({
    resolver: zodResolver(classSchema),
    defaultValues: {
      ...classData,
      classStartDate: classData.classStartDate.split('T')[0],
      accessHaveUsersId: classData.accessHaveUsersId, // Already an array
      active: classData.active ? 1 : 0,
    },
  });


  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersData, rolesData] = await Promise.all([fetchUsers(), fetchRoles()])
        setUsers(usersData)
        setRoles(rolesData)
      } catch (error) {
        console.error("Error fetching data:", error)
        setUsers([])
        setRoles([])
      }
    }
    fetchData()
    console.log(classData);
  }, [])


  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const transformedData = {
        ...data,
        active: data.active ? 1 : 0,
      };
      const updatedClass = await updateClass(transformedData);
      onUpdate(updatedClass);
    } catch (error) {
      console.error("Failed to update class:", error);
      form.setError('root', { type: 'manual', message: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <ScrollArea className="h-[80vh] pr-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="className"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Class Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="classDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Class Date</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a day" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => (
                      <SelectItem key={day} value={day}>
                        {day.charAt(0).toUpperCase() + day.slice(1)}
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
            name="classStartDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Class Start Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="classDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Class Description</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="classYear"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Class Year</FormLabel>
                <FormControl>
                  <Input type="number" {...field} onChange={e => field.onChange(+e.target.value)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {['individual', 'group', 'hall'].map((type) => (
                      <SelectItem key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
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
            name="classFee"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Class Fee</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} onChange={e => field.onChange(+e.target.value)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="freeCard"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Free Card</FormLabel>
                <FormControl>
                  <Input type="number" {...field} onChange={e => field.onChange(+e.target.value)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="registrationFee"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Registration Fee</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} onChange={e => field.onChange(+e.target.value)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="maxStudentCount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Max Student Count</FormLabel>
                <FormControl>
                  <Input type="number" {...field} onChange={e => field.onChange(+e.target.value)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="accessHaveUsersId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Access Have Users</FormLabel>
                <SelectNew
                  components={animatedComponents}
                  isMulti
                  options={users.map((user) => ({
                    label: `${user.username} (${roles.find((role) => role.roleId === user.roleId)?.roleName || 'Unknown Role'
                      })`,
                    value: user.userId.toString(),
                  }))}
                  value={
                    field.value
                      ? field.value.map(v => ({
                        label: users.find(u => u.userId.toString() === v)?.username || v,
                        value: v
                      }))
                      : []
                  }
                  onChange={(selectedOptions) => {
                    field.onChange(
                      selectedOptions
                        ? selectedOptions.map(option => option.value)
                        : []
                    )
                  }}
                  placeholder="Select users..."
                  closeMenuOnSelect={false}
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="active"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Active</FormLabel>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value === 1}
                    onCheckedChange={(checked) => field.onChange(checked ? 1 : 0)}
                  />
                </FormControl>
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
              {isSubmitting ? 'Updating...' : 'Update Class'}
            </Button>
          </div>
        </form>
      </Form>
    </ScrollArea>
  )
}
