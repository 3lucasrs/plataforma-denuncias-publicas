"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ReactNode } from "react";

type SocialLink = {
  href: string;
  icon: ReactNode;
  label: string;
};

type DeveloperCardProps = {
  name: string;
  role: string;
  imageUrl: string;
  socialLinks: SocialLink[];
};

export const DeveloperCard = ({
  name,
  role,
  imageUrl,
  socialLinks,
}: DeveloperCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white p-6 rounded-lg shadow-md border text-center hover:shadow-xl transition-shadow"
    >
      <Image
        src={imageUrl}
        alt={`Foto de ${name}`}
        width={120}
        height={120}
        className="rounded-full mx-auto border-4 border-indigo-200"
      />
      <h3 className="mt-4 text-2xl font-bold text-gray-800">{name}</h3>
      <p className="text-indigo-500 font-semibold">{role}</p>

      <div className="mt-6 flex justify-center gap-4">
        {socialLinks.map((link) => (
          <motion.a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            title={link.label}
            whileHover={{ scale: 1.2, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            className="text-gray-500 hover:text-indigo-600"
          >
            {link.icon}
          </motion.a>
        ))}
      </div>
    </motion.div>
  );
};
