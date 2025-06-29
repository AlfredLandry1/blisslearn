"use client";

import React, { useState } from "react";
import { Field, ErrorMessage } from "formik";
import { Label } from "./label";
import { Button } from "../button";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface FormikFieldWithIconProps {
  name: string;
  label?: string;
  type?: string;
  placeholder?: string;
  icon?: React.ComponentType<{ className?: string }>;
  showPasswordToggle?: boolean;
  required?: boolean;
  className?: string;
  [key: string]: any;
}

export function FormikFieldWithIcon({
  name,
  label,
  type = "text",
  placeholder,
  icon: Icon,
  showPasswordToggle = false,
  required = false,
  className,
  ...props
}: FormikFieldWithIconProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [inputType, setInputType] = useState(type);

  const togglePassword = () => {
    setShowPassword(!showPassword);
    setInputType(showPassword ? "password" : "text");
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label
          htmlFor={name}
          className="text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <Icon className="w-4 h-4" aria-hidden="true" />
          </div>
        )}
        <Field
          id={name}
          name={name}
          type={inputType}
          placeholder={placeholder}
          className={cn(
            "flex h-10 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm ring-offset-white dark:ring-offset-gray-950 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 dark:placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            Icon && "pl-10",
            showPasswordToggle && "pr-10"
          )}
          aria-describedby={name + "-error"}
          aria-invalid={false}
          {...props}
        />
        {showPasswordToggle && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
            onClick={togglePassword}
            aria-label={
              showPassword
                ? "Masquer le mot de passe"
                : "Afficher le mot de passe"
            }
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4" aria-hidden="true" />
            ) : (
              <Eye className="w-4 h-4" aria-hidden="true" />
            )}
          </Button>
        )}
      </div>
      <ErrorMessage
        name={name}
        component="div"
        id={name + "-error"}
        className="text-sm text-red-500"
      />
    </div>
  );
}
