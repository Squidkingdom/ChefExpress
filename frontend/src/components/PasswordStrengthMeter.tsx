import React, { useState, useEffect } from "react";
import zxcvbn from "zxcvbn";

interface PasswordStrengthMeterProps {
  password: string;
}

const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({ password }) => {
  const [strength, setStrength] = useState(0);

  useEffect(() => {
    const result = zxcvbn(password);
    setStrength(result.score);
  }, [password]);

  return (
    <div className="mt-2">
      <div className="h-2 rounded-full bg-gray-700 overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ${
            strength === 0
              ? "bg-red-500"
              : strength === 1
              ? "bg-orange-500"
              : strength === 2
              ? "bg-yellow-500"
              : strength === 3
              ? "bg-green-500"
              : "bg-green-500"
          }`}
          style={{ width: `${(strength / 4) * 100}%` }}
        />
      </div>
      <p className="mt-1 text-sm text-gray-400">
        Password strength: {["Weak", "Fair", "Good", "Strong", "Very Strong"][strength]}
      </p>
    </div>
  );
};

export default PasswordStrengthMeter;