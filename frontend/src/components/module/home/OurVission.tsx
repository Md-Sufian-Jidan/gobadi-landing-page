import ResuableTitleDescription from "@/components/shared/ResuableTitleDescription";
import Image from "next/image";
import iconEcosystem from "@/assets/AnimalCareEcosystem.png";
import iconConsultation from "@/assets/DoctorConsultationNetwork.png";
import iconInsights from "@/assets/Al-PoweredInsights&Marketplace.png";
import imageDoctorCow from "@/assets/ourVissionDoctorCow.png";
import imageCowFarm from "@/assets/ourVissionCowFarm.png";
import imageHandShake from "@/assets/ourVissionHandShake.png";
import imageCowCare from "@/assets/ourVissionCowCare.png";

const features = [
    {
        icon: iconEcosystem,
        iconAlt: "Animal Care Ecosystem",
        title: "Animal Care Ecosystem",
        description: "A complete platform for pet health, care guidance, and daily wellbeing support.",
        className: "",
    },
    {
        icon: iconConsultation,
        iconAlt: "Doctor Consultation Network",
        title: "Doctor Consultation Network",
        description: "Instant access to veterinary professionals for reliable diagnosis and treatment advice.",
        className: "",
    },
    {
        icon: iconInsights,
        iconAlt: "AI-Powered Insights and Marketplace",
        title: "AI-Powered Insights & Marketplace",
        description: "Smart AI results for better decisions, plus a marketplace for services, products, and care solutions.",
        className: "md:col-span-2",
    },
] as const;

export default function OurVission() {
    return (
        <section id="our-visions" aria-labelledby="our-vision-heading" className="w-full py-16 md:py-24 bg-white overflow-hidden">
            <div className="max-w-[1440px] mx-auto px-6 lg:px-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
                    <div className="lg:col-span-6 flex flex-col gap-10">
                        <ResuableTitleDescription
                            subTitle="OUR VISIONS"
                            subTitleClassName="inline-flex items-center gap-2 bg-accent/10 py-1.5 px-4 md:py-2 md:px-5 rounded-full border border-accent/20"
                            title="Empowering Smarter Animal Care Through AI"
                            titleClassName="text-[24px] md:text-[56px] font-semibold font-display tracking-tight text-primary leading-[1.15]"
                            description="Gobadi is building a unified digital ecosystem where animal care becomes faster, smarter, and more accessible. Our goal is to improve animal wellbeing through AI-driven insights, expert consultation, and trusted marketplace solutions."
                            descriptionClassName="text-secondary font-normal text-base md:text-[20px] leading-relaxed text-justify"
                            align="left"
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10 pt-4 border-t border-accent/10">
                            {features.map((feature) => (
                                <div key={feature.title} className={`flex gap-4 items-start ${feature.className}`}>
                                    <div className="flex-shrink-0 mt-1">
                                        <Image
                                            src={feature.icon}
                                            alt={feature.iconAlt}
                                            width={24}
                                            height={24}
                                            className="object-contain"
                                        />
                                    </div>
                                    <div className="space-y-1.5 max-w-xl">
                                        <h3 className="text-base font-semibold text-primary font-display">
                                            {feature.title}
                                        </h3>
                                        <p className="text-secondary text-sm md:text-base font-medium leading-relaxed">
                                            {feature.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="lg:col-span-6 relative w-full aspect-square md:aspect-[4/3] lg:aspect-square flex items-center justify-center max-w-4xl mx-auto mt-8 lg:mt-0">
                        <div className="absolute top-[8%] left-[8%] w-[426px] md:h-[338px] h-[280px] bg-[#FFF6F3] rounded-tl-[140px] z-10" />

                        <div className="absolute top-[7%] md:left-[16%] md:w-[35%] w-[40%] left-[8%] aspect-square rounded-full shadow-lg overflow-hidden z-20 -mt-10">
                            <Image
                                src={imageDoctorCow}
                                alt="Veterinarian checking cow"
                                fill
                                sizes="(max-width: 768px) 50vw, 30vw"
                                className="object-cover"
                                priority
                            />
                        </div>

                        <div className="absolute bottom-[10%] left-[10%] md:w-[42%] w-[45%] aspect-square rounded-full shadow-lg overflow-hidden z-40">
                            <Image
                                src={imageHandShake}
                                alt="Farmers shaking hands at farm"
                                fill
                                sizes="(max-width: 768px) 50vw, 35vw"
                                className="object-cover"
                            />
                        </div>

                        <div className="absolute md:top-[38%] md:right-[10%] md:w-[33%] w-[40%] right-[2%] top-[25%] aspect-square rounded-full shadow-lg overflow-hidden z-30">
                            <Image
                                src={imageCowCare}
                                alt="Farmer feeding sheep in barn"
                                fill
                                sizes="(max-width: 768px) 30vw, 20vw"
                                className="object-cover"
                            />
                        </div>

                        <div className="absolute top-[0.5%] md:right-[30%] md:w-[10%] w-[15%] right-[9%] aspect-square rounded-full shadow-md overflow-hidden z-20">
                            <Image
                                src={imageCowFarm}
                                alt="Cow looking over fence"
                                fill
                                sizes="(max-width: 768px) 15vw, 10vw"
                                className="object-cover"
                            />
                        </div>

                        <div className="absolute bottom-[40%] left-[10%] md:w-[13%] w-[18%] aspect-square rounded-full bg-border z-10 shadow-md" />
                        <div className="absolute top-[0%] md:right-[28%] md:w-[7%] w-[10%] right-[5%] aspect-square rounded-full bg-accent-light-50 z-10 shadow-sm" />
                    </div>
                </div>
            </div>
        </section>
    );
}
