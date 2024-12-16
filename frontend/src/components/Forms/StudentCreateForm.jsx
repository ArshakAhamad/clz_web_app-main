import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useStudents } from '@/hooks/useStudent';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { QrScanner } from '@/components/Views/QrScanner';
import * as RadixSelect from '@radix-ui/react-select';

// Custom Select Component
const ForwardedSelect = React.forwardRef(({ options, value, onChange, placeholder }, ref) => (
  <RadixSelect.Root value={value} onValueChange={onChange}>
    <RadixSelect.Trigger ref={ref} className="SelectTrigger">
      <RadixSelect.Value placeholder={placeholder} />
    </RadixSelect.Trigger>
    <RadixSelect.Content>
      <RadixSelect.Viewport>
        {options.map((option) => (
          <RadixSelect.Item key={option.value} value={option.value} className="SelectItem">
            {option.label}
          </RadixSelect.Item>
        ))}
      </RadixSelect.Viewport>
    </RadixSelect.Content>
  </RadixSelect.Root>
));
ForwardedSelect.displayName = 'ForwardedSelect';

const formatDate = (date) => (date ? new Date(date).toISOString().split('T')[0] : '');

// Validation Schema
const studentSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  gender: z.enum(['male', 'female'], { message: 'Gender is required' }),
  addressDistrict: z.string().min(1, 'District is required'),
  addressCity: z.string().min(1, 'City is required'),
  addressRoad: z.string().min(1, 'Road is required'),
  registeredDate: z.string().refine((val) => !isNaN(Date.parse(val)), 'Invalid date'),
  birthDay: z.string().refine((val) => !isNaN(Date.parse(val)), 'Invalid date'),
  phoneNumber1: z.string().regex(/^\d{10}$/, 'Phone number must be 10 digits'),
  phoneNumber2: z.string().regex(/^\d{10}$/, 'Phone number must be 10 digits').optional(),
  classId: z.number().int().positive('Class ID must be a positive number'),
  studentQRCode: z.string(),
  freeCard: z.boolean(),
});

export function StudentCreateForm({ classId = 1, onSuccess = () => {} }) {
  const navigate = useNavigate();
  const { createNewStudent, isLoading } = useStudents();
  const [submitError, setSubmitError] = useState(null);
  const [showScanner, setShowScanner] = useState(false); // For QR scanner

  const form = useForm({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      name: '',
      email: '',
      gender: 'male',
      addressDistrict: '',
      addressCity: '',
      addressRoad: '',
      registeredDate: formatDate(new Date()),
      birthDay: formatDate(new Date('2000-01-01')),
      phoneNumber1: '',
      phoneNumber2: '',
      classId: classId,
      studentQRCode: '',
      freeCard: false,
    },
  });

  const onSubmit = async (data) => {
    setSubmitError(null);
    try {
      const formattedData = { ...data, freeCard: data.freeCard ? 1 : 0 };
      const result = await createNewStudent(formattedData);

      if (result && result.studentId) {
        alert('Student created successfully!');
        onSuccess(result);
        navigate('/students');
      } else {
        throw new Error('Unexpected API response format');
      }
    } catch (err) {
      console.error('Error creating student:', err);

      if (err.message === 'Student is already enrolled in this class') {
        setSubmitError('This student is already enrolled in the selected class.');
      } else {
        setSubmitError(err.message || 'Failed to create student.');
      }
    }
  };

  const handleScanComplete = (decodedText) => {
    form.setValue('studentQRCode', decodedText); // Auto-fill QR code field
    setShowScanner(false); // Close QR scanner modal
  };

  return (
    <>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Name */}
        <Input
          label="Name"
          {...form.register('name')}
          placeholder="Enter name"
          error={form.formState.errors.name?.message}
        />

        {/* Email */}
        <Input
          label="Email"
          type="email"
          {...form.register('email')}
          placeholder="Enter email"
          error={form.formState.errors.email?.message}
        />

        {/* Gender */}
        <Controller
          control={form.control}
          name="gender"
          render={({ field }) => (
            <ForwardedSelect
              {...field}
              options={[
                { value: 'male', label: 'Male' },
                { value: 'female', label: 'Female' },
              ]}
              placeholder="Select gender"
            />
          )}
        />

        {/* Address */}
        <Input
          label="District"
          {...form.register('addressDistrict')}
          placeholder="Enter district"
          error={form.formState.errors.addressDistrict?.message}
        />
        <Input
          label="City"
          {...form.register('addressCity')}
          placeholder="Enter city"
          error={form.formState.errors.addressCity?.message}
        />
        <Input
          label="Road"
          {...form.register('addressRoad')}
          placeholder="Enter road"
          error={form.formState.errors.addressRoad?.message}
        />

        {/* Birthday */}
        <Input
          label="Birthday"
          type="date"
          {...form.register('birthDay')}
          error={form.formState.errors.birthDay?.message}
        />

        {/* Phone Numbers */}
        <Input
          label="Phone Number 1"
          {...form.register('phoneNumber1')}
          placeholder="10 digits"
          error={form.formState.errors.phoneNumber1?.message}
        />
        <Input
          label="Phone Number 2"
          {...form.register('phoneNumber2')}
          placeholder="10 digits (optional)"
          error={form.formState.errors.phoneNumber2?.message}
        />

        {/* QR Code */}
        <div>
          <label>QR Code</label>
          <div className="flex items-center space-x-2">
            <Input
              {...form.register('studentQRCode')}
              placeholder="Scan or enter QR code"
              error={form.formState.errors.studentQRCode?.message}
            />
            <Button type="button" onClick={() => setShowScanner(true)}>
              Scan QR
            </Button>
          </div>
        </div>

        {/* Free Card */}
        <Checkbox
          label="Free Card"
          {...form.register('freeCard')}
          error={form.formState.errors.freeCard?.message}
        />

        {/* Buttons */}
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={() => navigate('/students')}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Submitting...' : 'Create Student'}
          </Button>
        </div>

        {/* Error Message */}
        {submitError && <p className="text-red-500">{submitError}</p>}
      </form>

      {/* QR Scanner Modal */}
      {showScanner && <QrScanner onScanComplete={handleScanComplete} onClose={() => setShowScanner(false)} />}
    </>
  );
}
