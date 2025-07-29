// ApplicantForm.tsx or wherever you're loading the form
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function ApplicantFormModal() {
  const [showModal, setShowModal] = useState(true);

  const handleContinue = () => {
    setShowModal(false);
  };

  return (
    <Dialog open={showModal} onOpenChange={setShowModal}>
      <DialogContent className="max-w-[90%] sm:max-w-lg rounded-2xl shadow-xl border bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Important Notice
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm mt-2">
            Please read carefully before proceeding.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 text-sm text-gray-700">
          <p>
            Your information is kept strictly confidential and handled in
            accordance with data protection regulations. We are committed to
            protecting your privacy and will never share your data without your
            consent.
          </p>
          <p>
            Any false or misleading information provided during the application
            process will result in immediate disqualification and forfeiture of
            your assigned spot.
          </p>
          <p>
            By continuing, you agree to be truthful and understand the
            importance of accurate data submission.
          </p>
        </div>

        <DialogFooter className="mt-4">
          <Button variant="ghost" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button onClick={handleContinue}>I Understand & Continue</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
