import { AlertCircle } from "lucide-react";
import { Button } from "./ui/button";

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

const ErrorMessage = ({ message, onRetry }: ErrorMessageProps) => (
  <div className="flex flex-col items-center justify-center py-20 text-center">
    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
      <AlertCircle className="h-7 w-7 text-destructive" />
    </div>
    <h3 className="mt-4 text-lg font-semibold text-foreground">Something went wrong</h3>
    <p className="mt-1 max-w-md text-sm text-muted-foreground">{message}</p>
    {onRetry && (
      <Button onClick={onRetry} variant="outline" className="mt-4">
        Try Again
      </Button>
    )}
  </div>
);

export default ErrorMessage;
