"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, ArrowLeft, Mail, Lock, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Footer from "@/components/landing-page/Footer";
import ThemeAndScroll from "@/components/landing-page/ThemeAndScroll";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [email, setEmail] = useState("");

  const otpRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const handleOtpChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    if (value && index < 3) {
      otpRefs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs[index - 1].current?.focus();
    }
  };

  const handleSendCode = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const userEmail = formData.get('email') as string;
    setEmail(userEmail);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userEmail,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || 'Reset code sent to your email!');
        setStep(2);
      } else {
        toast.error(data.error || 'Failed to send reset code');
      }
    } catch (error) {
      console.error('Send code error:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const resetCode = otp.join('');

    try {
      const response = await fetch('/api/auth/verify-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          resetCode,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Code verified! Please set your new password.');
        setStep(3);
      } else {
        toast.error(data.error || 'Invalid or expired code');
      }
    } catch (error) {
      console.error('Verify code error:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;
    const resetCode = otp.join('');

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          resetCode,
          password,
          confirmPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || 'Password reset successfully!');
        setTimeout(() => {
          router.push('/auth-page/login');
        }, 1500);
      } else {
        toast.error(data.error || 'Failed to reset password');
      }
    } catch (error) {
      console.error('Reset password error:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    if (step === 1) {
      handleSendCode(e as React.FormEvent<HTMLFormElement>);
    } else if (step === 2) {
      handleVerifyCode(e);
    } else if (step === 3) {
      handleResetPassword(e as React.FormEvent<HTMLFormElement>);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground py-10 md:py-10 transition-colors duration-300">
      <ThemeAndScroll />

      <div className="w-full max-w-sm md:max-w-[450px] overflow-hidden mb-20">
        <Card className="overflow-hidden bg-card border border-border rounded-3xl shadow-lg">
          <CardContent className="p-0">
            <form className="p-6 md:p-8" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-6">
                
                {/* Header Section */}
                <div className="flex flex-col items-center text-center">
                  <Link 
                    href="/auth-page/login" 
                    className="flex items-center text-xs text-muted-foreground hover:text-foreground mb-4 transition-colors"
                  >
                    <ArrowLeft className="h-3 w-3 mr-1" /> Back to Login
                  </Link>
                  <h1 className="text-2xl font-bold">
                    {step === 1 && "Forgot Password"}
                    {step === 2 && "Verify Code"}
                    {step === 3 && "Reset Password"}
                  </h1>
                  <p className="text-balance text-muted-foreground text-sm mt-1">
                    {step === 1 && "Enter your email to receive a reset code."}
                    {step === 2 && "Enter the 4-digit code sent to your email."}
                    {step === 3 && "Enter and confirm your new password."}
                  </p>
                </div>

                {/* STEP 1: EMAIL */}
                {step === 1 && (
                  <div className="grid gap-2">
                    <Label htmlFor="email">User Email</Label>
                    <div className="relative">
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        className="p-5 pl-10 text-[15px]"
                        placeholder="secure@example.com"
                        required
                        disabled={isLoading}
                      />
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    </div>
                  </div>
                )}

                {/* STEP 2: OTP BOXES */}
                {step === 2 && (
                  <div className="flex justify-center gap-4 py-2">
                    {otp.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={otpRefs[idx]}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(idx, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(idx, e)}
                        className="w-12 h-14 text-center text-xl font-bold border border-border rounded-xl bg-background focus:ring-2 focus:ring-primary outline-none transition-all"
                      />
                    ))}
                  </div>
                )}

                {/* STEP 3: NEW PASSWORD */}
                {step === 3 && (
                  <div className="flex flex-col gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="password">New Password</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          className="pr-10 p-5 text-[15px]"
                          required
                          disabled={isLoading}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          className="pr-10 p-5 text-[15px]"
                          required
                          disabled={isLoading}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <Button 
                  type="submit" 
                  className="w-full cursor-pointer p-5 text-[15px] font-semibold" 
                  disabled={isLoading}
                >
                  {isLoading ? "Processing..." : step === 3 ? "Reset Password" : "Continue"}
                </Button>

              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}