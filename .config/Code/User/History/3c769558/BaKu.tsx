import * as React from "react";

import { cn } from "@/lib/utils";
import { Label } from "./label";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: React.ReactNode;
  error?: string;
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, ...props }, ref) => {
    return (
      <div className="flex w-full grow flex-col gap-2">
        <Label htmlFor={props.id} hidden={!label}>
          {label}
        </Label>
        <input
          type={type}
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            className,
          )}
          ref={ref}
          {...props}
        />
        {error && <p className="mt-0.5 text-xs text-destructive">{error}</p>}
      </div>
    );
  },
);
Input.displayName = "Input";

export { Input };
