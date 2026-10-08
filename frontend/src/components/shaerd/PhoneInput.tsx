import PhoneInputLib from "react-phone-number-input";
import "react-phone-number-input/style.css";

interface PhoneInputProps {
  value?: string;
  onChange?: (value?: string) => void;
}

export const PhoneInput = ({ value, onChange }: PhoneInputProps) => {
  return (
    <div
      className="
        w-full

        [&_.PhoneInput]:flex
        [&_.PhoneInput]:h-12
        [&_.PhoneInput]:w-full
        [&_.PhoneInput]:items-center
        [&_.PhoneInput]:rounded-xl
        [&_.PhoneInput]:border
        [&_.PhoneInput]:border-gray-300
        [&_.PhoneInput]:bg-white
        [&_.PhoneInput]:px-3

        [&_.PhoneInputCountry]:flex
        [&_.PhoneInputCountry]:h-full
        [&_.PhoneInputCountry]:items-center
        [&_.PhoneInputCountry]:mr-2

        [&_.PhoneInputInput]:h-full!
        [&_.PhoneInputInput]:min-w-0!
        [&_.PhoneInputInput]:flex-1!
        [&_.PhoneInputInput]:border-0!
        [&_.PhoneInputInput]:bg-white!
        [&_.PhoneInputInput]:text-black!
        [&_.PhoneInputInput]:opacity-100!
        [&_.PhoneInputInput]:outline-none!
        [&_.PhoneInputInput]:shadow-none!
        [&_.PhoneInputInput]:text-base!
        [&_.PhoneInputInput]:placeholder:text-gray-400!
      "
    >
      <PhoneInputLib
        international
        defaultCountry="IN"
        value={value}
        onChange={onChange ?? (() => {})}
        placeholder="Enter mobile number"
      />
    </div>
  );
};
