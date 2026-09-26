import Image from "next/image";
import imgComingSoon from "@/assets/coomingSoon.png";
import imgComingSoonShape from "@/assets/coomingSoonShape.png";
import coomingSoonImage from '@/assets/coomingSoonImage.png'

const SOON_LETTERS = ["S", "O", "O", "N"] as const;

export default function ComingSoon() {
    return (
        <section className="w-full py-12 md:py-24 overflow-hidden">
            <div className="max-w-[1440px] mx-auto px-6 lg:px-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-16 items-center">
                    <div className="lg:col-span-7 flex flex-col gap-4 md:gap-6 items-start">
                        <h2 className="font-audiowide font-normal text-[36px] md:text-[87px] text-primary tracking-tight leading-[1.1] uppercase">
                            Something <br /> New Is
                        </h2>

                        <div className="bg-accent rounded-3xl p-3 md:p-4 inline-block max-w-fit shadow-lg shadow-accent/15">
                            <p className="text-4xl sm:text-5xl md:text-6xl font-black tracking-[0.08em] text-white uppercase">
                                Coming
                            </p>
                            <div className="flex items-center justify-between gap-2 pt-3">
                                {SOON_LETTERS.map((letter, index) => (
                                    <span
                                        key={index}
                                        className="bg-white p-2 md:p-3 rounded-3xl inline-flex items-center justify-center min-w-[3rem] md:min-w-[4.5rem]"
                                    >
                                        <span className="text-4xl sm:text-5xl md:text-6xl font-black tracking-[0.08em] text-border">
                                            {letter}
                                        </span>
                                    </span>
                                ))}
                            </div>
                        </div>

                        <p className="text-xl md:text-2xl lg:text-3xl font-semibold text-primary leading-snug mt-2 max-w-2xl">
                            Our new and improved <br className="hidden sm:inline" /> digital livestock platform.
                        </p>
                    </div>
                    <div className="lg:col-span-5 flex justify-center">
                        <div className="relative w-full max-w-[520px] aspect-[0.88]">
                            {/* Shape */}
                            <Image
                                src={coomingSoonImage}
                                alt="Gobadi mobile application dashboard preview"
                                fill
                                priority
                                className="object-contain z-20 pointer-events-none"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
