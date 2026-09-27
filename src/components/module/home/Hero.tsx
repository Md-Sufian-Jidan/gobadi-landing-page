import Image from 'next/image';
import Link from 'next/link';
import heroCard from '@/assets/hero_card.png';
import rocket_icon from "@/assets/rocket.gif";
import heroTextOverCow from "@/assets/herotextovercowbg.png";
import gobadiLogo from "@/assets/hero_gobadi_logo.png";
import heroShape from '@/assets/hero_shape_card.png';
import heroShape2 from '@/assets/hero_shape_2.png';
import heroCow from '@/assets/hero_cow.webp';
import playstore from '@/assets/heroplaystore.svg';
import { motion, Variants } from "framer-motion";

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.1,
        },
    },
};

const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
};

const scaleUp: Variants = {
    hidden: { opacity: 0, scale: 0.85 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
    },
};

const textLineVariants: Variants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.5, ease: "easeOut" },
    },
};

export default function Hero() {
    return (
        <section
            id="hero"
            aria-label="Gobadi hero"
            className="relative mx-auto max-w-[1350px] px-4 sm:px-6 lg:px-0 mt-10 lg:mt-20 "
        >
            <div className="space-y-4 lg:space-y-8 px-0 lg:px-6">
                <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-0 lg:gap-6">
                    <div className="relative grid flex-[1.6] grid-cols-1 grid-rows-1">
                        <Image
                            src={heroShape}
                            alt="Hero Shape Behind The Main Title"
                            priority
                            className=" h-full w-full"
                            sizes="(min-width: 1024px) 100vw, 60vw"
                        />
                        <div className="absolute inset-0 flex items-center md:p-6 p-3 sm:p-10 lg:p-14">
                            <h1 className="font-display font-black leading-[1.05] text-[30px] md:text-[72px]">
                                <span className="text-primary">Where</span>{" "}
                                <span className="text-accent">Livestock</span>{" "}
                                <br />
                                <span className="text-primary">Meets</span>{" "}
                                <br />
                                <span className="text-accent">Intelligence.</span>
                            </h1>
                        </div>
                    </div>

                    <div className="md:flex flex-col hidden relative aspect-[4/5] sm:aspect-[5/6] lg:aspect-auto lg:min-h-[470px] overflow-visible">
                        <Image
                            src={heroShape2}
                            alt="Cow standing shape"
                            fill
                            className="object-contain"
                            priority
                        />
                        <Image
                            src={heroCow}
                            alt="Cow standing for the Gobadi livestock platform"
                            className="absolute z-10 lg:h-[550px] h-[390px] w-full lg:-mt-23 mt-1.5"
                            sizes="(min-width: 1024px) 32vw, 100vw"
                            priority
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-4 lg:flex-row lg:gap-6">
                    <div className="flex flex-col gap-4 sm:gap-6 lg:w-[26%] justify-between">
                        {/* Download Now Card */}
                        <div className="flex flex-1 flex-col justify-between rounded-[28px] sm:rounded-[32px] bg-[#C0612B] p-6 shadow-sm">
                            <h2 className="font-display font-semibold uppercase leading-[1.05] text-[32px] md:text-[44px] lg:text-[50px] text-white tracking-tight">
                                DOWNLOAD
                                <br />
                                NOW...
                            </h2>
                            <Link
                                href="#"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-4 sm:mt-5 inline-block transition-transform duration-300 hover:scale-105 active:scale-95 focus:outline-none"
                            >
                                <Image
                                    src={playstore}
                                    alt="Get it on Google Play"
                                    width={180}
                                    height={56}
                                    className="w-[150px] sm:w-[170px] lg:w-[185px] h-auto drop-shadow-md"
                                />
                            </Link>
                        </div>

                        {/* We are: Live Now Card */}
                        <div className="rounded-[28px] sm:rounded-[32px] border border-[#C0612B]/70 bg-white p-5 sm:p-6 relative flex flex-col justify-between min-h-[140px] sm:min-h-[150px] shadow-sm">
                            <div className="flex items-center justify-between">
                                <span className="text-base sm:text-lg md:text-xl font-bold text-primary">
                                    We are :
                                </span>
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded border border-[#FF9B9B] bg-[#FFF5F5] text-[#E02424] text-xs sm:text-sm font-bold tracking-wider">
                                    <span className="w-2 h-2 rounded-full bg-[#E02424] animate-pulse" />
                                    LIVE
                                </span>
                            </div>
                            <h3 className="font-display font-extrabold text-4xl sm:text-5xl md:text-[54px] text-[#C0612B] leading-none mt-3 sm:mt-4 tracking-tight">
                                Live Now
                            </h3>
                        </div>
                    </div>

                    <div className="relative lg:w-[22%]">
                        <Image
                            src={heroCard}
                            alt="Gobadi mobile app shown on a smartphone"
                            className="lg:h-full h-[450px] w-full rounded-[30px] object-cover"
                            sizes="(min-width: 1024px) 22vw, 100vw"
                        />
                    </div>

                    <div className="relative flex-1">
                        <Image
                            src={heroTextOverCow}
                            alt=""
                            className="w-full rounded-[20px] lg:rounded-[30px] object-cover"
                            sizes="(max-width:768px)100vw,(max-width:1024px)50vw,32vw"
                        />

                        <div className="absolute inset-0 flex items-start justify-center pt-6 sm:pt-8 lg:pt-10 px-4 sm:px-6">
                            <p className="w-full text-right lg:text-left text-[14px] md:text-xl lg:text-[28px] font-bold text-primary leading-relaxed">
                                <span className="block lg:pl-50">AI-powered digital platform</span>
                                <span className="block lg:pl-48">transforming the livestock</span>
                                <span className="block lg:pl-40">eco-system by connecting</span>
                                <span className="block lg:pl-24">farmers, veterinarians, and also</span>
                                <span className="block">trusted providers in one place.</span>
                            </p>
                        </div>
                    </div>
                </div>

                <div className="absolute z-30 hidden lg:flex items-center justify-center rounded-full bg-white border-4 lg:border-[6px] border-accent w-36 h-36 md:w-44 md:h-44 lg:w-60 lg:h-60 xl:w-72 xl:h-72 2xl:w-80 2xl:h-80 top-[50.5%] left-[51%] -translate-x-1/2 -translate-y-1/2">
                    <Image
                        src={gobadiLogo}
                        alt="Gobadi icon"
                        className="w-full h-full rounded-full object-contain"
                    />
                </div>
            </div>
        </section>
    )
}