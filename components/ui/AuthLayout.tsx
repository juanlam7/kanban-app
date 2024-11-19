import Image from "next/image";
import backgroundImage from "../../public/background-image.svg";

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

export default function AuthLayout({
  title,
  subtitle,
  children,
}: AuthLayoutProps) {
  return (
    <section className="flex min-h-screen items-center justify-center bg-gradient-to-br from-cyan-400 via-cyan-500 to-cyan-600">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={backgroundImage}
          alt="Kanban Background"
          className="w-full h-full object-cover opacity-30"
          priority
        />
      </div>

      {/* Centered Content */}
      <div className="relative w-full max-w-md bg-white/90 backdrop-blur-md rounded-lg shadow-xl p-6 text-center">
        <h2 className="text-3xl font-bold text-gray-800">{title}</h2>
        <p className="text-gray-600">{subtitle}</p>
        {children}
      </div>
    </section>
  );
}
