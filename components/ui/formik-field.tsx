"use client";

import * as React from "react";
import { Field, FieldProps } from "formik";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff } from "lucide-react";

interface FormikFieldProps {
  name: string;
  label?: string;
  type?: "text" | "email" | "password" | "checkbox";
  placeholder?: string;
  className?: string;
  showPasswordToggle?: boolean;
  required?: boolean;
  children?: React.ReactNode;
}

export function FormikField({
  name, label, type = "text", placeholder, className, showPasswordToggle = false, required = false, children
}: FormikFieldProps) {
  const [showPassword, setShowPassword] = React.useState(false);

  if (type === "checkbox") {
    return (
      <Field name={name}>
        {({ field, meta }: FieldProps) => (
          <div className={cn("space-y-3", className)}>
            <div className="flex items-start space-x-3">
              <Checkbox
                id={name}
                checked={field.value}
                onCheckedChange={field.onChange}
                className="mt-1"
              />
              {label && (
                <Label htmlFor={name} className="text-sm text-gray-300 leading-relaxed">
                  {label}
                  {required && <span className="text-red-400 ml-1">*</span>}
                </Label>
              )}
            </div>
            {meta.touched && meta.error && (
              <p className="text-red-400 text-xs mt-2">{meta.error}</p>
            )}
          </div>
        )}
      </Field>
    );
  }

  return (
    <Field name={name}>
      {({ field, meta }: FieldProps) => (
        <div className={cn("space-y-3", className)}>
          {label && (
            <Label htmlFor={name} className="text-sm font-medium text-gray-300">
              {label}
              {required && <span className="text-red-400 ml-1">*</span>}
            </Label>
          )}
          
          <div className="relative">
            {children || (
              <Input
                {...field}
                id={name}
                type={type === "password" && showPassword ? "text" : type}
                placeholder={placeholder}
                className={cn(
                  "bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-300 py-3",
                  meta.touched && meta.error && "border-red-500 focus:border-red-500",
                  showPasswordToggle && type === "password" && "pr-10"
                )}
              />
            )}
            
            {showPasswordToggle && type === "password" && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            )}
          </div>
          
          {meta.touched && meta.error && (
            <p className="text-red-400 text-xs mt-2">{meta.error}</p>
          )}
        </div>
      )}
    </Field>
  );
} 