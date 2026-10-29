"use client";

import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

export function WhatsAppFloat({ phone }: { phone: string }) {
  return (
    <motion.a
      href={`https://wa.me/${phone}?text=${encodeURIComponent(
        "Olá! Vi o site da Real Móveis Eletro e quero falar com a loja.",
      )}`}
      target="_blank"
      rel="noreferrer"
      aria-label="Falar no WhatsApp"
      initial={{ opacity: 0, scale: 0, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 1.2, type: "spring", stiffness: 260, damping: 18 }}
      className="fixed bottom-5 right-5 z-40 grid h-14 w-14 place-items-center rounded-full bg-leaf text-white shadow-[0_16px_36px_-10px_rgba(31,122,61,0.75)] animate-pulse-soft"
    >
      <MessageCircle className="h-7 w-7" />
      <span className="absolute -left-1 -top-1 h-3.5 w-3.5 rounded-full border-2 border-paper bg-brand" />
    </motion.a>
  );
}
