import Image from "next/image";
import playstore from "@/assets/playstore.svg";
import bgpattern from "@/assets/livenowbgpattern.svg";
import twophone from "@/assets/livenowtwophone.svg";
import lefttopcorner from "@/assets/lefttopcorner.svg";
import Link from "next/link";

export default function LiveNow() {
    return (
        <section className="w-full max-w-[1320px] mx-auto px-4 md:px-0 py-10 md:py-20 overflow-hidden">
            <div className="relative w-full overflow-hidden rounded-[28px] sm:rounded-[38px] md:rounded-[48px] lg:rounded-[56px] border border-[#C0612B]/40 bg-gradient-to-br from-[#FFF7F0] via-[#FFF9F5] to-[#FFFFFF] p-6 sm:p-10 md:p-14 lg:p-16 shadow-[0_10px_30px_rgba(192,97,43,0.05)]">

                <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
                    <Image
                        src={lefttopcorner}
                        alt=""
                        width={500}
                        height={400}
                        className="absolute -top-16 -left-16 w-[360px] md:w-[520px] h-auto opacity-70"
                    />
                    <Image
                        src={lefttopcorner}
                        alt=""
                        width={450}
                        height={350}
                        className="absolute -bottom-28 left-[35%] md:left-[45%] w-[320px] md:w-[460px] h-auto opacity-40 rotate-180"
                    />
                    <Image
                        src={bgpattern}
                        alt=""
                        fill
                        className="object-cover object-center opacity-60"
                    />
                </div>

                {/* Content Grid */}
                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center">

                    {/* Left Text Column */}
                    <div className="lg:col-span-7 flex flex-col items-center text-center lg:items-start lg:text-left">
                        <h2 className="font-audiowide font-normal text-2xl sm:text-3xl md:text-4xl lg:text-[44px] xl:text-[52px] leading-tight tracking-normal">
                            <span className="text-[#C0612B]">GOBAADI</span>{" "}
                            <span className="text-[#231F20]">App Is</span>
                        </h2>

                        <h1 className="font-audiowide font-normal text-5xl sm:text-6xl md:text-7xl lg:text-[80px] xl:text-[92px] text-[#C0612B] leading-[1.05] mt-1 sm:mt-2 mb-6 sm:mb-8 tracking-tight">
                            Live Now!
                        </h1>

                        <p className="font-inter text-base sm:text-lg md:text-xl lg:text-[22px] text-[#2C2C2C] font-normal leading-relaxed md:leading-[1.45] max-w-[540px] mb-8 sm:mb-10">
                            Use AI-powered{" "}
                            <span className="font-bold italic text-[#C0612B]">GOBAADI</span>{" "}
                            mobile app &amp; know what your cattle actually need!
                        </p>

                        {/* Google Play Button */}
                        <Link
                            href="#"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block transition-transform duration-300 hover:scale-105 active:scale-95 focus:outline-none"
                        >
                            <Image
                                src={playstore}
                                alt="Get it on Google Play"
                                width={220}
                                height={72}
                                className="w-[180px] sm:w-[200px] md:w-[220px] h-auto drop-shadow-sm"
                                priority
                            />
                        </Link>
                    </div>

                    {/* Right Phone Mockups Column */}
                    <div className="lg:col-span-5 flex justify-center lg:justify-end items-center mt-6 lg:mt-0">
                        <div className="relative w-full max-w-[360px] sm:max-w-[420px] md:max-w-[460px] lg:max-w-[500px] aspect-[459/506]">
                            <Image
                                src={twophone}
                                alt="GOBAADI Mobile App Preview"
                                fill
                                priority
                                className="object-contain drop-shadow-2xl"
                            />
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}

