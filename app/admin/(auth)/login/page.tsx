import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <main className="relative min-h-screen w-full flex items-center justify-center p-4 overflow-hidden">
      {/* Background with multiple layers for a premium feel */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {/* Abstract Mesh Gradients */}
        <div
          className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full opacity-60 mix-blend-multiply filter blur-[80px] animate-pulse"
          style={{
            background: "radial-gradient(circle, #F9A0C4 0%, transparent 70%)",
            animationDuration: "8s",
          }}
        />
        <div
          className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full opacity-60 mix-blend-multiply filter blur-[80px] animate-pulse"
          style={{
            background: "radial-gradient(circle, #fe4a19 0%, transparent 70%)",
            animationDuration: "12s",
          }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] rounded-full opacity-30 mix-blend-screen filter blur-[100px]"
          style={{
            background: "radial-gradient(circle, #4F46E5 0%, transparent 70%)",
          }}
        />

        {/* Base Gradient */}
        <div className="absolute inset-0 bg-neutral-50" />

        {/* Grid Pattern Overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* Content wrapper for better centering and responsiveness */}
      <div className="w-full max-w-md z-10">
        <LoginForm />

        {/* Footer links or additional info */}
        <div className="mt-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300 fill-mode-both">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} FincasYa. Todos los derechos
            reservados.
          </p>
        </div>
      </div>
    </main>
  );
}
