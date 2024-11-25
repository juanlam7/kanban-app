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
    <section className="relative flex min-h-screen items-center justify-center bg-white">
      <div className="absolute inset-0 flex justify-center items-center">
        <div className="relative grid grid-cols-4 gap-4 w-full h-full p-4 bg-gray-300/20 backdrop-blur-lg rounded-lg shadow-inner">
          {Array(4)
            .fill(0)
            .map((_, columnIndex) => (
              <div
                key={columnIndex}
                className="bg-slate-200 flex flex-col p-4"
              ></div>
            ))}
        </div>
      </div>
      <div className="relative w-full max-w-md bg-slate-200 backdrop-blur-md p-6 text-center">
        <h2 className="text-3xl font-bold text-gray-800">{title}</h2>
        <p className="text-gray-600">{subtitle}</p>
        {children}
      </div>
    </section>
  );
}
