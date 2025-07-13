/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3030",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
      },
      // --- ADICIONE ESTE NOVO BLOCO PARA O GITHUB ---
      {
        protocol: "https",
        hostname: "github.com",
        pathname: "/**", // Específico para sua foto
      },
      // É uma boa prática adicionar o domínio real de avatares do GitHub também
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      // --- FIM DO NOVO BLOCO ---
    ],
  },
};

module.exports = nextConfig;
