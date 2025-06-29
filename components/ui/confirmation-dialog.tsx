"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Info, CheckCircle, XCircle } from "lucide-react";
import { useUIStore } from "@/stores/uiStore";
import { motion, AnimatePresence } from "framer-motion";

interface ConfirmationDialogProps {
  id: string;
  title?: string;
  message: string;
  type?: "danger" | "warning" | "info" | "success";
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  id,
  title,
  message,
  type = "warning",
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
}) => {
  const handleConfirm = () => {
    onConfirm();
  };

  const handleCancel = () => {
    if (onCancel) onCancel();
  };

  const getIcon = () => {
    switch (type) {
      case "danger":
        return <XCircle className="w-6 h-6 text-red-400" />;
      case "warning":
        return <AlertTriangle className="w-6 h-6 text-yellow-400" />;
      case "info":
        return <Info className="w-6 h-6 text-blue-400" />;
      case "success":
        return <CheckCircle className="w-6 h-6 text-green-400" />;
      default:
        return <AlertTriangle className="w-6 h-6 text-yellow-400" />;
    }
  };

  const getConfirmButtonVariant = () => {
    switch (type) {
      case "danger":
        return "destructive";
      case "warning":
        return "default";
      case "info":
        return "default";
      case "success":
        return "default";
      default:
        return "default";
    }
  };

  const getDefaultTitle = () => {
    switch (type) {
      case "danger":
        return "Confirmation requise";
      case "warning":
        return "Attention";
      case "info":
        return "Information";
      case "success":
        return "Succès";
      default:
        return "Confirmation";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-gray-900 border border-gray-700 rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl"
      >
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 mt-1">{getIcon()}</div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white mb-2">
              {title || getDefaultTitle()}
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed">{message}</p>
          </div>
        </div>
        
        <div className="flex gap-3 mt-6 justify-end">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="min-w-[80px]"
          >
            {cancelText || "Annuler"}
          </Button>
          <Button
            variant={getConfirmButtonVariant()}
            onClick={handleConfirm}
            className="min-w-[80px]"
          >
            {confirmText || "Confirmer"}
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export const ConfirmationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      {children}
    </>
  );
}; 