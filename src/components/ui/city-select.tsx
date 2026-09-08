import { FLIGHT_CITY_GROUPS } from "@/lib/flight-cities";

type CitySelectProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  className: string;
  required?: boolean;
};

export function CitySelect({ value, onChange, placeholder, className, required }: CitySelectProps) {
  return (
    <select required={required} value={value} onChange={(e) => onChange(e.target.value)} className={className}>
      <option value="">{placeholder}</option>
      {FLIGHT_CITY_GROUPS.map((group) => (
        <optgroup key={group.country} label={group.country}>
          {group.cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </optgroup>
      ))}
    </select>
  );
}
