import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

export function PaymentDialog({ isOpen, onClose, onPayNow, onPayLater, lastPaymentDetails }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Payment Required</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p>The student has not paid the class fees for this month.</p>
          <p>Last payment details:</p>
          <ul>
            <li>Amount: ${lastPaymentDetails.amount}</li>
            <li>Date: {new Date(lastPaymentDetails.date).toLocaleDateString()}</li>
            <li>Month: {lastPaymentDetails.month}</li>
          </ul>
        </div>
        <DialogFooter>
          <Button onClick={onPayLater} variant="outline">Pay Later</Button>
          <Button onClick={onPayNow}>Pay Now</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}