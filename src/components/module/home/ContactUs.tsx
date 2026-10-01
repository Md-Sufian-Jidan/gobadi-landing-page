import { FiMail, FiPhone, FiMapPin } from "react-icons/fi";
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import ContactForm from "./ContactForm";

export default function ContactUs() {
    return (
        <section
            id="contact"
            className="px-4 relative bg-accent py-12 md:py-24 mt-6 md:mt-24"
            style={{
                backgroundImage: `
                    linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)
                `,
                backgroundSize: "24px 24px",
            }}
        >
            <div className="max-w-[1440px] mx-auto px-4 lg:px-0">
                <div className="absolute top-0 left-0 w-full overflow-hidden leading-none -translate-y-[99%]">
                    <svg
                        viewBox="0 0 1440 90"
                        className="block w-full h-[30px] md:h-[100px] fill-accent"
                        preserveAspectRatio="none"
                        aria-hidden
                    >
                        <path d="
      M0,90
      C120,35 320,20 520,28
      C760,38 900,70 1120,70
      L1440,70
      L1440,90
      L0,90
      Z
    " />
                    </svg>
                </div>

                <div className="relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
                        <div className="lg:col-span-7 flex flex-col gap-10">
                            <div className="flex flex-col items-start gap-4">
                                <p className="inline-flex items-center gap-2 bg-[#FFF6F3] py-1.5 px-4 md:py-2 md:px-5 rounded-full border border-white/10">
                                    <span className="text-xs md:text-sm font-bold font-display uppercase tracking-widest text-accent">
                                        CONTACT US
                                    </span>
                                </p>
                                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display tracking-tight text-white leading-tight mt-2">
                                    Let&apos;s stay connected
                                </h2>
                                <p className="text-white/80 font-normal text-base md:text-lg leading-relaxed max-w-xl">
                                    Join the Gobaadi community and be part of <br /> a smarter future for animal care.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 pt-4 border-t border-white/10">
                                <div className="space-y-4">
                                    <div className="flex-shrink-0 w-11 h-11 flex items-center justify-center rounded-full bg-white/10 border border-white/20 text-white">
                                        <FiMail className="w-5 h-5" aria-hidden />
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="md:text-[30px] text-xl font-semibold text-white font-display">Email</h3>
                                        <a href="mailto:ceo.gobaadi@gmail.com" target="_blank" className="text-white md:text-lg text-base font-normal break-all">
                                            ceo.gobaadi@gmail.com
                                        </a>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex-shrink-0 w-11 h-11 flex items-center justify-center rounded-full bg-white/10 border border-white/20 text-white">
                                        <FiPhone className="w-5 h-5" aria-hidden />
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="md:text-[30px] text-xl font-semibold text-white font-display">Phone</h3>
                                        <a href="tel:+01911418977" target="_blank" className="text-white md:text-lg text-base font-normal">
                                            +8801911418977
                                        </a>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex-shrink-0 w-11 h-11 flex items-center justify-center rounded-full bg-white/10 border border-white/20 text-white">
                                        <FiMapPin className="w-5 h-5" aria-hidden />
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="md:text-[30px] text-xl font-semibold text-white font-display">Office</h3>
                                        <p className="text-white md:text-lg text-base font-normal leading-relaxed max-w-md">
                                            Road# 9 , house# 5 , Lane#3, Mirpur 11/a, Dhaka, 1216, Bangladesh.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-5 w-full flex flex-col items-stretch lg:items-end">
                            <div className="flex flex-col items-start lg:items-end gap-2 mb-6 px-1">
                                <span className="text-white/90 font-semibold text-sm tracking-wide">Follow Us On</span>
                                <div className="flex gap-3">
                                    <a href="https://www.facebook.com/profile.php?id=61591434551881" target="_blank" aria-label="Facebook" className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-accent hover:bg-white/90 transition-all shadow-sm">
                                        <FaFacebookF className="w-4 h-4" aria-hidden />
                                    </a>
                                    {/* <a href="#" aria-label="Instagram" className="w-9 h-9 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all">
                                        <FaInstagram className="w-4 h-4" aria-hidden />
                                    </a> */}
                                    {/* <a href="#" aria-label="X" className="w-9 h-9 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all">
                                        <FaXTwitter className="w-4 h-4" aria-hidden />
                                    </a> */}
                                    <a href="https://www.linkedin.com/company/gobaadi" target="_blank" aria-label="LinkedIn" className="w-9 h-9 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all">
                                        <FaLinkedinIn className="w-4 h-4" aria-hidden />
                                    </a>
                                </div>
                            </div>

                            <div className="bg-white rounded-[32px] p-6 md:p-8 shadow-2xl w-full max-w-[480px] mx-auto lg:mx-0">
                                <ContactForm />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </section>
    );
}
