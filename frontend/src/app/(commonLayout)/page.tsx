import AboutUs from "@/components/module/home/AboutUs";
import ComingSoon from "@/components/module/home/ComingSoon";
import ContactUs from "@/components/module/home/ContactUs";
import OurVission from "@/components/module/home/OurVission";
import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar";
import Hero from "@/components/module/home/Hero";
import LiveNow from "@/components/module/home/LiveNow";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <OurVission />
      <AboutUs />
      {/* <ComingSoon /> */}
      <LiveNow />
      <ContactUs />
      <Footer />
    </main>
  );
}
