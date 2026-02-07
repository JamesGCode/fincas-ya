import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { CTAVideo } from "@/components/landing/cta-video";
import { FincaList } from "@/components/landing/finca-list";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-[#131313] overflow-x-hidden">
      <div className="relative z-10">
        <Navbar />
        <FincaList />
        <CTAVideo />
        <Footer />
      </div>
    </main>
  );
}
