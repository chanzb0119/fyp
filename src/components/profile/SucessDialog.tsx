// SuccessDialog.tsx
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
  } from "@/components/ui/alert-dialog";
  import { CheckCircle2 } from "lucide-react";
  
  interface SuccessDialogProps {
    isOpen: boolean;
    onClose: () => void;
  }
  
  const SuccessDialog = ({ isOpen, onClose }: SuccessDialogProps) => {
    return (
      <AlertDialog open={isOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              Application Submitted Successfully
            </AlertDialogTitle>
            <AlertDialogDescription>
              Your landlord application has been submitted successfully. Our team will review your application and documents. You can track your application status in this tab.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={onClose}>
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  };
  
  export default SuccessDialog;