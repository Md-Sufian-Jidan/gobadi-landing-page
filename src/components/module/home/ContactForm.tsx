"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { FiSend } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { contactSchema, type ContactFormData } from "@/lib/contact";

const GENERIC_SUBMIT_ERROR = "Could not send your message. Please try again.";

export default function ContactForm() {
    const {
        register,
        handleSubmit,
        reset,
        setError,
        trigger,
        formState: { errors, isSubmitting },
    } = useForm<ContactFormData>({
        resolver: zodResolver(contactSchema),
        defaultValues: { email: "", message: "" },
        mode: "onBlur",
    });

    const emailField = register("email");

    const checkEmailDomain = async (raw: string) => {
        if (!raw.trim()) return;
        // Wait for the schema check so this result can't be wiped by it.
        if (!(await trigger("email"))) return;

        try {
            const res = await fetch("/api/validate-email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: raw.trim() }),
            });
            const json = await res.json().catch(() => null);
            if (!res.ok || json?.ok !== true) {
                setError("email", {
                    type: "server",
                    message: json?.error ?? "Please enter a valid email address",
                });
            }
        } catch {
            // Network hiccup: the server re-checks on submit anyway.
        }
    };

    const onSubmit = async (data: ContactFormData) => {
        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: data.email.trim(), message: data.message.trim() }),
            });

            const json = await res.json().catch(() => null);
            if (!res.ok) {
                const message = json?.error ?? GENERIC_SUBMIT_ERROR;
                if (res.status === 400 && (json?.field === "email" || json?.field === "message")) {
                    setError(json.field, { type: "server", message });
                }
                toast.error(message);
                return;
            }

            toast.success("Message sent! We'll get back to you soon.");
            reset();
        } catch (error) {
            console.error("Contact form error:", error);
            toast.error(GENERIC_SUBMIT_ERROR);
        }
    };

    return (
        <form
            noValidate
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-5"
            aria-label="Contact form"
            aria-busy={isSubmitting}
        >

            <div className="flex flex-col">
                <Label htmlFor="form-email" className="text-sm font-bold text-slate-800 font-display mb-2">
                    Email
                </Label>
                <Input
                    id="form-email"
                    type="email"
                    autoComplete="email"
                    placeholder="Your email"
                    disabled={isSubmitting}
                    aria-invalid={!!errors.email}
                    className="h-12 rounded-xl px-4 text-base text-slate-900 placeholder:text-slate-400"
                    {...emailField}
                    onBlur={(event) => {
                        emailField.onBlur(event);
                        void checkEmailDomain(event.target.value);
                    }}
                />
                {errors.email && (
                    <p className="text-xs text-red-500 mt-1" role="alert">
                        {errors.email.message}
                    </p>
                )}
            </div>

            <div className="flex flex-col">
                <Label htmlFor="form-message" className="text-sm font-bold text-slate-800 font-display mb-2">
                    Message
                </Label>
                <Textarea
                    id="form-message"
                    placeholder="Your message..."
                    rows={4}
                    disabled={isSubmitting}
                    aria-invalid={!!errors.message}
                    className="rounded-xl px-4 py-3 text-base text-slate-900 placeholder:text-slate-400 resize-none min-h-[140px]"
                    {...register("message")}
                />
                {errors.message && (
                    <p className="text-xs text-red-500 mt-1" role="alert">
                        {errors.message.message}
                    </p>
                )}
            </div>

            <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 rounded-xl bg-accent hover:bg-[#A34E1F] text-white font-bold text-base shadow-md shadow-accent/15 mt-2 cursor-pointer font-display"
            >
                {isSubmitting ? (
                    <>
                        <Loader2 className="animate-spin" aria-hidden />
                        <span>Sending...</span>
                    </>
                ) : (
                    <>
                        <FiSend aria-hidden />
                        <span>Send Message</span>
                    </>
                )}
            </Button>
        </form>
    );
}
