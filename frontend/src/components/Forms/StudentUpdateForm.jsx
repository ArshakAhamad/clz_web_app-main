import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { updateStudent } from '@/lib/APIServices/Student/api';
import { QrScanner } from '@/components/Views/QrScanner';

const studentSchema = z.object({
  studentId: z.number(),
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  gender: z.enum(['male', 'female', 'other'], {
    errorMap: () => ({ message: 'Invalid gender' }),
  }),
  addressDistrict: z.string().min(3, 'District must be at least 3 characters').max(100, 'District must be 100 characters or less'),
  addressCity: z.string().min(3, 'City must be at least 3 characters').max(100, 'City must be 100 characters or less'),
  addressRoad: z.string().min(3, 'Road must be at least 3 characters').max(100, 'Road must be 100 characters or less'),
  registeredDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Invalid date format',
  }),
  birthDay: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Invalid date format',
  }),
  phoneNumber1: z.string().min(10, 'Phone number must be at least 10 characters').max(20, 'Phone number must be 20 characters or less'),
  phoneNumber2: z.string().max(20, 'Phone number must be 20 characters or less').optional(),
  studentQRCode: z.string(),
  freeCard: z.boolean(),
});

export function StudentUpdateForm({ studentData = {}, onUpdate, onCancel }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showQrScanner, setShowQrScanner] = useState(false);

  const form = useForm({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      ...studentData,
      registeredDate: studentData?.registeredDate?.split('T')[0] || '',
      birthDay: studentData?.birthDay?.split('T')[0] || '',
      freeCard: studentData?.freeCard === 1,
    },
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      console.log('Submitting updated data:', data); // Debugging
      const updatedStudent = await updateStudent({
        ...data,
        freeCard: data.freeCard ? 1 : 0,
      });
      console.log('Update successful:', updatedStudent); // Debugging
      if (onUpdate) {
        onUpdate(updatedStudent);
      } else {
        console.error('onUpdate callback not provided');
      }
    } catch (error) {
      console.error('Failed to update student:', error);
      form.setError('root', { type: 'manual', message: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQrCodeScanned = (qrCode) => {
    form.setValue('studentQRCode', qrCode);
    setShowQrScanner(false);
  };

  return (
    <ScrollArea className="h-[80vh] pr-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Name Field */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email Field */}
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

          {/* Gender Field */}
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gender</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value || ''}>
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

          {/* Address Fields */}
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

          {/* Registered Date */}
          <FormField
            control={form.control}
            name="registeredDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Registered Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Birthday */}
          <FormField
            control={form.control}
            name="birthDay"
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

          {/* Phone Number 1 */}
          <FormField
            control={form.control}
            name="phoneNumber1"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number 1</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Phone Number 2 (Optional) */}
          <FormField
            control={form.control}
            name="phoneNumber2"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number 2</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* QR Code */}
          <FormField
            control={form.control}
            name="studentQRCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Student QR Code</FormLabel>
                <div className="flex items-center space-x-2">
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <Button type="button" onClick={() => setShowQrScanner(true)}>
                    Scan QR
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Free Card */}
          <FormField
            control={form.control}
            name="freeCard"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Free Card</FormLabel>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Error Message */}
          {form.formState.errors.root && (
            <p className="text-sm font-medium text-destructive">{form.formState.errors.root.message}</p>
          )}

          {/* Submit and Cancel Buttons */}
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Updating...' : 'Update Student'}
            </Button>
          </div>
        </form>
      </Form>

      {/* QR Scanner */}
      {showQrScanner && (
        <QrScanner onScanComplete={handleQrCodeScanned} onClose={() => setShowQrScanner(false)} />
      )}
    </ScrollArea>
  );
}
