"use client";

import { parsePhoneNumberWithError, type PhoneNumber } from "libphonenumber-js";
import { ChevronDown, Phone } from "lucide-react";
import React, { forwardRef, type InputHTMLAttributes } from "react";
import * as RPNInput from "react-phone-number-input";
import flags from "react-phone-number-input/flags";
import { z } from "zod";

import { Input } from "~/components/ui/input";
import { cn, getErrorMessage } from "~/lib/utils";

export default function CustomPhoneInput(props: {
  value: string | undefined;
  setValue: (value: string) => void;
  placeholder: string;
}) {
  const { value, setValue, placeholder } = props;
  return (
    <div className="!w-full space-y-2" dir="ltr">
      <RPNInput.default
        className="flex w-full rounded-lg shadow-sm shadow-black/5"
        international
        flagComponent={FlagComponent}
        countrySelectComponent={CountrySelect}
        inputComponent={PhoneInput}
        id="input-46"
        placeholder={placeholder}
        value={value}
        onChange={(newValue) => setValue(newValue ?? "")}
      />
    </div>
  );
}

export type InputProps = InputHTMLAttributes<HTMLInputElement>;

const PhoneInput = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <div className="!w-full">
        <Input
          className={cn(
            "-ms-px !w-full rounded-s-none bg-input shadow-none focus-visible:z-10",
            className,
          )}
          ref={ref}
          {...props}
        />
      </div>
    );
  },
);

PhoneInput.displayName = "PhoneInput";

interface CountrySelectProps {
  disabled?: boolean;
  value: RPNInput.Country;
  onChange: (value: RPNInput.Country) => void;
  options: Array<{ label: string; value: RPNInput.Country | undefined }>;
}

const CountrySelect = ({
  disabled,
  value,
  onChange,
  options,
}: CountrySelectProps) => {
  const handleSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(event.target.value as RPNInput.Country);
  };

  return (
    <div className="relative inline-flex w-2/12 items-center self-stretch rounded-s-lg border border-input bg-background py-2 pe-2 ps-3 text-muted-foreground ring-offset-background transition-shadow focus-within:z-10 focus-within:border-ring focus-within:text-foreground focus-within:outline-none focus-within:ring-2 focus-within:ring-ring/30 focus-within:ring-offset-2 hover:bg-accent hover:text-foreground has-[:disabled]:pointer-events-none has-[:disabled]:opacity-50">
      <div className="inline-flex items-center gap-1" aria-hidden="true">
        <FlagComponent country={value} countryName={value} aria-hidden="true" />
        <span className="text-muted-foreground/80">
          <ChevronDown size={16} strokeWidth={2} aria-hidden="true" />
        </span>
      </div>
      <select
        disabled={disabled}
        value={value}
        onChange={handleSelect}
        className="absolute inset-0 text-sm opacity-0"
        aria-label="Select country"
      >
        <option key="default" value="">
          Select a country
        </option>
        {options
          .filter((x) => x.value)
          .map((option, i) => (
            <option key={option.value ?? `empty-${i}`} value={option.value}>
              {option.label}{" "}
              {option.value &&
                `+${RPNInput.getCountryCallingCode(option.value)}`}
            </option>
          ))}
      </select>
    </div>
  );
};

const FlagComponent = ({ country, countryName }: RPNInput.FlagProps) => {
  const Flag = flags[country];

  return (
    <span className="w-5 overflow-hidden rounded-sm">
      {Flag ? (
        <Flag title={countryName} />
      ) : (
        <Phone size={16} aria-hidden="true" />
      )}
    </span>
  );
};

type PhoneParseResult =
  | {
      isValid: false;
      error: string;
    }
  | {
      isValid: true;
      phoneNumber: string;
    };

export const phoneSchema = z.preprocess(
  (v) => {
    if (v && typeof v === "string") {
      if (v.startsWith("+")) {
        return v;
      }
      return `+${v}`;
    }
    return undefined;
  },
  z
    .string({ required_error: "Phone number is required" })
    .min(1, "Phone number is required")
    .max(15, "Invalid number. Number shound be less than 15 characters.")
    .regex(/^\+[1-9]\d{1,14}$/, "Invalid number. Enter with country code ")
    .refine(
      (v) => {
        if (!v) return true;
        try {
          const t = parsePhoneNumberWithError(v);
          if (!t) {
            return false;
          }

          if (!t.isValid() || !t.isPossible()) {
            return false;
          }

          return true;
        } catch {
          return false;
        }
      },
      {
        message: "Invalid number. Enter with country code",
      },
    ),
);

export function parsePhone(value: string): PhoneParseResult {
  let phone: PhoneNumber | undefined = undefined;
  try {
    phone = parsePhoneNumberWithError(value);
    if (!phone) {
      return {
        isValid: false,
        error: "Invalid Phone Number",
      };
    }

    if (!phone.isValid() || !phone.isPossible()) {
      return {
        isValid: false,
        error: `Phone Number is not valid for ${phone.country}`,
      };
    }

    return {
      isValid: true,
      phoneNumber: phone.formatInternational().replace(/\s/g, ""),
    };
  } catch (e) {
    const errorMessage = getErrorMessage(e);
    return {
      isValid: false,
      error: errorMessage,
    };
  }
}
