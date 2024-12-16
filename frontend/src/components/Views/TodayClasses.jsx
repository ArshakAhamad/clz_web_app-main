import React, { useState } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useClasses } from '@/hooks/useClasses'
import { useStudents } from '@/hooks/useStudent'
import { useAttendance } from '@/hooks/useAttendance'
import { usePayment } from '@/hooks/usePayment'
import { QrScanner } from '@/components/Views/QrScanner'
import { PaymentDialog } from '@/components/Views/PaymentDialog'
import { PaymentCreateForm } from '@/components/Forms/PaymentCreateForm'
import { StudentCreateForm } from '@/components/Forms/StudentCreateForm'
import { useToast } from '@/hooks/use-toast'

export function TodayClasses() {
  const { classes, loading: classesLoading, error: classesError } = useClasses()
  const { toast } = useToast()
  const { fetchStudentByQRCode } = useStudents()
  const { markStudentAttendance } = useAttendance()
  const { fetchPaymentsByStudent } = usePayment()
  const [selectedClass, setSelectedClass] = useState(null)
  const [showScanner, setShowScanner] = useState(false)
  const [showPaymentDialog, setShowPaymentDialog] = useState(false)
  const [showPaymentForm, setShowPaymentForm] = useState(false)
  const [showStudentForm, setShowStudentForm] = useState(false)
  const [lastPaymentDetails, setLastPaymentDetails] = useState(null)
  const [scannedQRCode, setScannedQRCode] = useState(null)

  if (classesLoading) return <div>Loading classes...</div>
  if (classesError) return <div>Error loading classes: {classesError.message}</div>

  const handleMarkAttendance = (classId) => {
    setSelectedClass(classId)
    setShowScanner(true)
  }

  const handleScanComplete = async (qrCode) => {
    setScannedQRCode(qrCode); // Save scanned QR code
    setShowScanner(false); // Close scanner dialog
  
    try {
      // Attempt to fetch the student
      const student = await fetchStudentByQRCode(qrCode);
  
      if (student) {
        await processExistingStudent(student);
      } else {
        // This condition may never hit as `fetchStudentByQRCode` throws errors
        toast({
          title: "Error",
          description: "Student not found for this QR code.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error processing QR code:", error);
  
      // Check for 404 errors specifically
      if (error.message.includes("Student not found")) {
        toast({
          title: "Error",
          description: "No student found for the scanned QR code. Please try again.",
          variant: "destructive",
        });
      } else {
        // Handle other errors
        toast({
          title: "Error",
          description: "Failed to process the QR code. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      resetState(); // Ensure state is reset to avoid issues
    }
  };  

  const processExistingStudent = async (student) => {
    try {
      await markStudentAttendance(student.id, selectedClass)
      const payments = await fetchPaymentsByStudent(student.id)
      const lastPayment = payments[0] // Assuming payments are sorted by date
      if (isPaymentRequired(lastPayment)) {
        setLastPaymentDetails(lastPayment)
        setShowPaymentDialog(true)
      } else {
        await sendAttendanceConfirmation(student)
        resetState()
      }
    } catch (error) {
      console.error('Error processing existing student:', error)
      toast({
        title: "Error",
        description: "Failed to process student attendance. Please try again.",
        variant: "destructive",
      })
    }
  }

  const isPaymentRequired = (lastPayment) => {
    // Implement logic to check if payment is required
    // For example, check if the last payment was more than a month ago
    return true // Placeholder
  }

  const handlePayNow = () => {
    setShowPaymentDialog(false)
    setShowPaymentForm(true)
  }

  const handlePayLater = async () => {
    setShowPaymentDialog(false)
    const student = await fetchStudentByQRCode(scannedQRCode)
    await sendPaymentReminder(student, lastPaymentDetails)
    resetState()
  }

  const handlePaymentSuccess = async () => {
    setShowPaymentForm(false)
    const student = await fetchStudentByQRCode(scannedQRCode)
    await sendPaymentConfirmation(student)
    resetState()
  }

  const handleStudentCreated = async (studentId) => {
    setShowStudentForm(false)
    setShowPaymentForm(true)
  }

  const sendAttendanceConfirmation = async (student) => {
    // Implement SMS sending logic here
    console.log(`Attendance marked for ${student.name} in class ${selectedClass}.`)
  }

  const sendPaymentReminder = async (student, lastPayment) => {
    // Implement SMS sending logic here
    console.log(`Payment reminder for ${student.name}. Last payment: $${lastPayment.amount} on ${new Date(lastPayment.date).toLocaleDateString()}.`)
  }

  const sendPaymentConfirmation = async (student) => {
    // Implement SMS sending logic here
    console.log(`Payment received for ${student.name}. Thank you!`)
  }

  const resetState = () => {
    setSelectedClass(null)
    setScannedQRCode(null)
    setLastPaymentDetails(null)
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Today's Classes</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {classes.map((classItem) => (
          <Card key={classItem.classId}>
            <CardHeader>
              <CardTitle>{classItem.className}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Date: {classItem.classDate}</p>
              <p>Teacher: {classItem.accessHaveUserId}</p>
            </CardContent>
            <CardFooter>
              <Button onClick={() => handleMarkAttendance(classItem.id)}>Mark Attendance</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      {showScanner && (
        <QrScanner
          onScanComplete={handleScanComplete}
          onClose={() => setShowScanner(false)}
        />
      )}
      {showPaymentDialog && (
        <PaymentDialog
          isOpen={showPaymentDialog}
          onClose={() => setShowPaymentDialog(false)}
          onPayNow={handlePayNow}
          onPayLater={handlePayLater}
          lastPaymentDetails={lastPaymentDetails}
        />
      )}
      {showPaymentForm && (
        <PaymentCreateForm
          studentId={scannedQRCode}
          classId={selectedClass}
          studentQRCode={scannedQRCode}
          onSuccess={handlePaymentSuccess}
        />
      )}
      {showStudentForm && (
        <StudentCreateForm
          classId={selectedClass}
          onSuccess={handleStudentCreated}
        />
      )}
    </div>
  )
}