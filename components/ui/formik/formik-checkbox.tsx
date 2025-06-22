"use client";

import React from "react";
import { Field, ErrorMessage } from "formik";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "./label";
import { cn } from "@/lib/utils";

interface FormikCheckboxProps {
  name: string;
  label?: string | React.ReactNode;
  required?: boolean;
  className?: string;
  [key: string]: any;
}

export function FormikCheckbox({
  name,
  label,
  required = false,
  className,
  ...props
}: FormikCheckboxProps) {
  return (
    <div className={cn("flex items-start space-x-3", className)}>
      <Field name={name}>
        {({ field, form }: any) => (
          <Checkbox
            id={name}
            checked={field.value}
            onCheckedChange={(checked) => {
              form.setFieldValue(name, checked);
            }}
            className="mt-1"
            {...props}
          />
        )}
      </Field>
      {label && (
        <div className="flex-1">
          <Label htmlFor={name} className="text-sm text-gray-300 leading-relaxed cursor-pointer">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </Label>
        </div>
      )}
      <ErrorMessage
        name={name}
        component="div"
        className="text-sm text-red-500 mt-1"
      />
    </div>
  );
} 