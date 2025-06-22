"use client";

import React from "react";
import { Field, ErrorMessage } from "formik";
import { Label } from "./label";
import { cn } from "@/lib/utils";

interface FormikFieldProps {
  name: string;
  label?: string | React.ReactNode;
  type?: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
  [key: string]: any;
}

export function FormikField({
  name,
  label,
  type = "text",
  placeholder,
  required = false,
  className,
  ...props
}: FormikFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label htmlFor={name} className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}
      <Field
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        className={cn(
          "flex h-10 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm ring-offset-white dark:ring-offset-gray-950 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 dark:placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        aria-describedby={name + "-error"}
        aria-invalid={false}
        {...props}
      />
      <ErrorMessage
        name={name}
        component="div"
        id={name + "-error"}
        className="text-sm text-red-500"
        // role="alert"
      />
    </div>
  );
}