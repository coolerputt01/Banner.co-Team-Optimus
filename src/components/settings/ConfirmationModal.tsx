import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  icon: LucideIcon;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: "danger" | "warning" | "info";
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  icon: Icon,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmVariant = "danger",
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  const variantBg = {
    danger: "bg-red-500",
    warning: "bg-yellow-500",
    info: "bg-primary",
  };

  const variantIconBg = {
    danger: "bg-red-500/10",
    warning: "bg-yellow-500/10",
    info: "bg-primary/10",
  };

  const variantText = {
    danger: "text-red-500",
    warning: "text-yellow-500",
    info: "text-primary",
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-surface rounded-2xl border border-border-subtle p-6 max-w-sm w-full shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={`w-12 h-12 rounded-full ${variantIconBg[confirmVariant]} flex items-center justify-center mx-auto mb-4`}
        >
          <Icon size={24} className={variantText[confirmVariant]} />
        </div>
        <h3 className="text-lg font-black text-text-main italic uppercase tracking-tight text-center mb-2">
          {title}
        </h3>
        <p className="text-sm text-text-sub text-center mb-6">{message}</p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 text-sm font-black text-text-sub hover:text-text-main border border-border-subtle rounded-xl transition-colors uppercase tracking-wider"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 py-3 text-sm font-black ${variantBg[confirmVariant]} text-white rounded-xl hover:opacity-90 transition-opacity uppercase tracking-wider`}
          >
            {confirmText}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
