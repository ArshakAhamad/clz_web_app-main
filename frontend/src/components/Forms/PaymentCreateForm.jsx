import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { usePayment } from '@/hooks/usePayment'

const paymentSchema = z.object({
  studentId: z.number().int().positive(),
  classId: z.number().int().positive(),
  studentQRCode: z.string(),
  paymentType: z.enum(['registration', 'monthly']),
  amount: z.number().positive(),
  paymentDate: z.date(),
  paymentMonth: z.enum(['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december']),
})

export function PaymentCreateForm({ studentId, classId, studentQRCode, onSuccess }) {
  const { createNewPayment, loading, error } = usePayment()
  const [submitError, setSubmitError] = useState(null)

  const form = useForm({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      studentId,
      classId,
      studentQRCode,
      paymentType: 'monthly',
      amount: 0,
      paymentDate: new Date(),
      paymentMonth: new Date().toLocaleString('default', { month: 'long' }).toLowerCase(),
    },
  })

  const onSubmit = async (data) => {
    try {
      await createNewPayment(data)
      onSuccess()
    } catch (err) {
      setSubmitError('Failed to create payment. Please try again.')
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input type="number" {...field} onChange={(e) => field.onChange(parseFloat(e.target.value))} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="paymentType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payment Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="registration">Registration</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="paymentMonth"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payment Month</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment month" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'].map((month) => (
                    <SelectItem key={month} value={month}>
                      {month.charAt(0).toUpperCase() + month.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        {submitError && <p className="text-red-500">{submitError}</p>}
        <Button type="submit" disabled={loading}>
          {loading ? 'Creating Payment...' : 'Create Payment'}
        </Button>
      </form>
    </Form>
  )
}