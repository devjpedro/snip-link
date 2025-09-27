/** biome-ignore-all lint/style/noMagicNumbers: <Necessary> */
"use client";

import { Button } from "@snip-link/ui/components/button";
import { motion } from "framer-motion";
import { Home } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function NotFoundPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="relative flex h-[calc(100vh-4rem)] flex-col items-center justify-center overflow-hidden p-4">
      <div className="-z-10 absolute inset-0">
        <div className="absolute inset-0 bg-background" />
      </div>

      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md text-center"
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          animate={{ scale: 1, opacity: 1 }}
          className="relative mx-auto mb-8"
          initial={{ scale: 0.8, opacity: 0 }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 15,
            delay: 0.2,
          }}
        >
          <div className="bg-primary bg-clip-text font-bold text-[120px] text-transparent leading-none sm:text-[150px]">
            404
          </div>
          <motion.div
            animate={{
              y: [0, -10, 0],
              rotate: [0, 5, 0],
            }}
            className="-right-4 -top-4 absolute h-16 w-16 animate-float rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20"
            transition={{
              duration: 4,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
          <motion.div
            animate={{
              y: [0, -8, 0],
              rotate: [0, -5, 0],
            }}
            className="-bottom-4 -left-4 absolute h-12 w-12 animate-float rounded-full bg-gradient-to-r from-pink-500/20 to-orange-500/20"
            transition={{
              duration: 3.5,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: 0.5,
            }}
          />
        </motion.div>

        <h1 className="mb-4 font-bold text-2xl sm:text-3xl">
          Página Não Encontrada
        </h1>

        <p className="mb-8 text-neutral-600 dark:text-neutral-400">
          A página que você está procurando não existe ou foi movida.{" "}
        </p>

        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Button
            asChild
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
          >
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Voltar para o Início
            </Link>
          </Button>
        </div>
      </motion.div>

      <div className="-z-10 absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            x: [0, 30, 0],
            y: [0, -30, 0],
          }}
          className="absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-purple-500/5 dark:bg-purple-500/10"
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
        <motion.div
          animate={{
            x: [0, -40, 0],
            y: [0, 40, 0],
          }}
          className="absolute right-1/4 bottom-1/4 h-80 w-80 rounded-full bg-blue-500/5 dark:bg-blue-500/10"
          transition={{
            duration: 10,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
        <motion.div
          animate={{
            x: [0, 50, 0],
            y: [0, 50, 0],
          }}
          className="absolute top-1/2 right-1/3 h-40 w-40 rounded-full bg-pink-500/5 dark:bg-pink-500/10"
          transition={{
            duration: 9,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      </div>
    </div>
  );
}
