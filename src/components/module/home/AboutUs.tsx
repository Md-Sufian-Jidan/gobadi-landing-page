import Image from "next/image";
import image1 from '@/assets/aboutUs.png';
import image2 from '@/assets/aboutUsChicken.png';
import image3 from '@/assets/aboutUsCow.png';
import image4 from '@/assets/aboutUsSheep.png';
import aboutShape from '@/assets/aboutShape.png';
import ResuableTitleDescription from "@/components/shared/ResuableTitleDescription";

export default function AboutUs() {
    return (
        <section
            id="about"
            aria-labelledby="about-heading"
            className="w-full relative lg:h-[1250px] h-[750px]"
        >
            <div className="absolute inset-0 h-full w-full">
                <Image
                    src={image1}
                    alt=""
                    fill
                    className=""
                />
            </div>
            <div className="absolute inset-0 lg:h-[743px] h-[440px] w-full">
                <Image
                    src={aboutShape}
                    alt=""
                    fill
                    className=""
                />
            </div>
            <div className="max-w-7xl mx-auto px-6 lg:pt-20 py-10s absolute z-10 inset-0">
                <div className="max-w-5xl mx-auto pt-10 ">
                    <ResuableTitleDescription
                        subTitle="ABOUT US"
                        subTitleClassName="inline-flex items-center gap-2 bg-sub-title-bg py-1.5 px-4 md:py-2 md:px-5 rounded-full border border-accent "
                        title="Who we are"
                        titleClassName="md:text-[56px] text-[36px] font-semibold font-display tracking-tight text-primary leading-[1.15] "
                        description="Our platform enables farmers to access veterinary care, book services from licensed veterinarians, receive AI-assisted health insights, and generate personalized livestock management content. Veterinarians can also use AI to create educational content, share expert knowledge, and provide digital consultations more efficiently."
                        descriptionClassName="text-description font-normal md:text-[32px] text-base leading-relaxed"
                        align="center"
                    />
                </div>

                <div className="px-4 md:px-8  z-10 mt-10 lg:mt-30">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6 lg:gap-8 items-center">
                        <div
                            className="relative w-full lg:aspect-[4/5] aspect-[3/3] rounded-[32px] overflow-hidden shadow-2xl"
                        >
                            <Image
                                src={image4}
                                alt="Farmer smiling holding a fluffy lamb"
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, 30vw"
                            />
                        </div>
                        <div className="relative w-full lg:aspect-[4/5] aspect-[3/3] rounded-[32px] overflow-hidden shadow-2xl md:-translate-y-8 lg:-translate-y-12">
                            <Image
                                src={image3}
                                alt="Veterinarian examining cows inside a barn"
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, 30vw"
                            />
                        </div>

                        <div className="relative w-full lg:aspect-[4/5] aspect-[3/3] rounded-[32px] overflow-hidden shadow-2xl md:translate-y-8 lg:translate-y-12">
                            <Image
                                src={image2}
                                alt="Farmer holding white turkey poultry"
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, 30vw"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
