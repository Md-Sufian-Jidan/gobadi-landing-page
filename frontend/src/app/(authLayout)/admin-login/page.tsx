import Image from "next/image";
import loginImage from "@/assets/login-image.svg";
import AdminLoginForm from "@/components/module/auth/adminLogin/AdminLoginForm";

export default function AdminLoginPage() {
    return (
        <div className="h-screen w-full p-3 sm:p-5 lg:p-6 bg-[#F3F2EC] flex items-center justify-center font-heading">
            <div className="w-full max-w-[1500px] h-full flex flex-col lg:flex-row gap-4 sm:gap-6">

                {/* Left Form Section */}
                <div className="w-full lg:w-1/2 bg-white rounded p-6 sm:p-12 lg:p-16 flex flex-col items-center justify-center shadow-xs">
                    <div className="w-full max-w-[360px] flex flex-col items-center">
                        <h1 className="mb-8 md:text-3xl text-2xl text-[#1B1B1B] text-center">
                            Sign in to <span className="font-bold">GOBAADI</span>
                        </h1>

                        <AdminLoginForm />
                    </div>
                </div>

                {/* Right Image Section */}
                <div className="relative rounded-[12px] sm:rounded-[28px] overflow-hidden h-full w-full  md:w-[673px]">
                    <Image
                        src={loginImage}
                        alt="Login illustration"
                        fill
                        className="object-contain w-full md:w-[673px]"
                        priority
                    />
                </div>

            </div>
        </div>
    );
}
