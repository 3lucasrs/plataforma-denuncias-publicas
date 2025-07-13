"use client";

import { DeveloperCard } from "@/components/credits/DeveloperCard";
import { Github, Instagram, Linkedin, Mail, Phone } from "lucide-react";
import Image from "next/image";

const lucasData = {
  name: "Lucas Rafael da Silva",
  role: "Desenvolvedor",
  imageUrl: "https://github.com/3lucasrs.png",
  socialLinks: [
    {
      href: "https://www.linkedin.com/in/3lucasrs/",
      icon: <Linkedin />,
      label: "LinkedIn",
    },
    { href: "https://github.com/3lucasrs", icon: <Github />, label: "Github" },
    {
      href: "https://www.instagram.com/3lucasrs/",
      icon: <Instagram />,
      label: "Instagram",
    },
    { href: "mailto:3lucasrs@gmail.com", icon: <Mail />, label: "Email" },
    { href: "https://wa.me/5549988057622", icon: <Phone />, label: "Whatsapp" },
  ],
};

const leticiaData = {
  name: "Leticia Grassmann Dallacosta",
  role: "Desenvolvedora",
  imageUrl: "/leticia.jpg",
  socialLinks: [
    {
      href: "https://github.com/LeticiaGrassmannDallacosta",
      icon: <Github />,
      label: "Github",
    },
    {
      href: "https://www.instagram.com/leticiagrassmanndallacosta/",
      icon: <Instagram />,
      label: "Instagram",
    },
    { href: "mailto:legrassmann@gmail.com", icon: <Mail />, label: "Email" },
    { href: "https://wa.me/5549989187698", icon: <Phone />, label: "Whatsapp" },
  ],
};

export default function CreditsPage() {
  return (
    <div className="p-6 md:p-8 lg:p-10 bg-gray-50 min-h-full">
      <header className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900">Créditos</h1>
        <p className="text-gray-500 mt-2">
          Pessoas que tornaram o projeto Cuida+ uma realidade.
        </p>
      </header>

      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        <DeveloperCard {...lucasData} />
        <DeveloperCard {...leticiaData} />
      </div>

      <section className="text-center mt-10 border-t">
        <div className="flex justify-center">
          <Image
            src="/unoesc.svg"
            alt="Logo da Universidade Unoesc"
            width={200}
            height={80}
            className="opacity-70"
          />
        </div>
        <p className="mt-4 text-gray-500 max-w-2xl mx-auto">
          Este projeto foi desenvolvido como parte das Práticas Extensionistas do curso de
          Análise e Desenvolvimento de Sistemas e Ciências de Dados e IA da Universidade
          do Oeste de Santa Catarina - Unoesc.
        </p>
      </section>
    </div>
  );
}
