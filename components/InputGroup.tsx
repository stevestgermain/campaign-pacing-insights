import React, { useRef, useState } from "react";
import { LucideIcon } from "lucide-react";

interface InputGroupProps {
  label: string;
  type?: "text" | "number" | "date";
  value: string | number;
  onChange: (value: string) => void;
  prefix?: string;
  placeholder?: string;
  icon?: LucideIcon;
}

export const InputGroup: React.FC<InputGroupProps> = ({
  label,
  type = "text",
  value,
  onChange,
  prefix,
  placeholder,
  icon: Icon
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  // If it's a date input, currently empty, and not focused, render as text to show the placeholder
  const effectiveType = type === "date" && !value && !isFocused ? "text" : type;

  const handleContainerClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
      // If it's a date input (or will become one), try to open picker
      if (type === "date" && "showPicker" in inputRef.current) {
        try {
          setTimeout(() => {
            (inputRef.current as any).showPicker();
          }, 0);
        } catch (e) {
          // Ignore
        }
      }
    }
  };

  return (
    <div className="flex flex-col gap-1.5 w-full group">
      <label className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider transition-colors group-focus-within:text-blue-600">
        {label}
      </label>

      <div className="relative cursor-pointer" onClick={handleContainerClick}>
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
          {Icon ? (
            <Icon className="w-5 h-5" />
          ) : prefix ? (
            <span className="font-medium">{prefix}</span>
          ) : null}
        </div>

        <input
          ref={inputRef}
          type={effectiveType}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className={`w-full rounded-2xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white text-base placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:bg-white dark:focus:bg-zinc-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 py-3 ${
            Icon || prefix ? "pl-11" : "px-4"
          } ${type === "date" ? "cursor-pointer min-h-[50px]" : ""} shadow-sm hover:border-gray-300 dark:hover:border-zinc-600 outline-none`}
        />
      </div>
    </div>
  );
};

