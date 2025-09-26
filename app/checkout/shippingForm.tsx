"use client";
import React from "react";
import Select from "react-select";
import { countries } from "countries-list";

interface ShippingFormProps {
  onChange: (info: {
    email: string;
    firstName: string;
    lastName: string;
    address: string;
    country: string | null;
    province: string | null;
    city: string;
    postalCode: string;
    phone: string;
  }) => void;
  userProfile?: {
    email: string;
    first_name: string;
    last_name: string;
    phone: string;
    address: string;
  } | null;
}

// Convert countries object to array format for react-select
const countryOptions = Object.entries(countries).map(([code, country]) => ({
  value: code,
  label: country.name,
}));

// Canadian provinces
const provinceOptions = [
  { value: "AB", label: "Alberta" },
  { value: "BC", label: "British Columbia" },
  { value: "MB", label: "Manitoba" },
  { value: "NB", label: "New Brunswick" },
  { value: "NL", label: "Newfoundland and Labrador" },
  { value: "NS", label: "Nova Scotia" },
  { value: "NT", label: "Northwest Territories" },
  { value: "NU", label: "Nunavut" },
  { value: "ON", label: "Ontario" },
  { value: "PE", label: "Prince Edward Island" },
  { value: "QC", label: "Quebec" },
  { value: "SK", label: "Saskatchewan" },
  { value: "YT", label: "Yukon" },
];

type CountryOption = {
  value: string;
  label: string;
};

type ProvinceOption = {
  value: string;
  label: string;
};

export default function ShippingForm({ onChange, userProfile }: ShippingFormProps) {
  const [email, setEmail] = React.useState("");
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [selectedCountry, setSelectedCountry] = React.useState<any>(null);
  const [selectedProvince, setSelectedProvince] = React.useState<any>(null);
  const [city, setCity] = React.useState("");
  const [postalCode, setPostalCode] = React.useState("");
  const [phone, setPhone] = React.useState("");

  // Auto-fill form when userProfile is available
  React.useEffect(() => {
    if (userProfile) {
      setEmail(userProfile.email || "");
      setFirstName(userProfile.first_name || "");
      setLastName(userProfile.last_name || "");
      setPhone(userProfile.phone || "");
      
      // Parse address if it exists (assuming it's a full address string)
      if (userProfile.address) {
        setAddress(userProfile.address);
        // You could add more sophisticated address parsing here
        // For now, we'll just set the full address string
      }
    }
  }, [userProfile]);

  const handleCountryChange = (option: any) => {
    setSelectedCountry(option);
    setSelectedProvince(null);
  };

  React.useEffect(() => {
    onChange({
      email,
      firstName,
      lastName,
      address,
      country: selectedCountry ? selectedCountry.value : null,
      province: selectedProvince ? selectedProvince.value : null,
      city,
      postalCode,
      phone,
    });
  }, [
    email,
    firstName,
    lastName,
    address,
    selectedCountry,
    selectedProvince,
    city,
    postalCode,
    phone,
    onChange,
  ]);

  return (
    <form>
      <p className="font-bold text-xl pb-2 text-[hsl(var(--text-primary))]">
        Shipping Information
        {userProfile && (
          <span className="text-sm font-normal text-[hsl(var(--text-secondary))] ml-2">
            (Auto-filled from your profile)
          </span>
        )}
      </p>
      <div className="mt-6">
        <label className="lg:flex lg:flex-row items-center">
          <p className="font-medium w-36 text-[hsl(var(--text-primary))]">Email Address</p>
          <input
            className="flex-1 w-full border border-[hsl(var(--border))] rounded-md py-2 px-4 bg-[hsl(var(--surface))] text-[hsl(var(--text-primary))] focus:ring-2 focus:ring-[hsl(var(--border-focus))] focus:border-[hsl(var(--border-focus))]"
            type={"email"}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter Email"
          />
        </label>
      </div>
      <div className="mt-6">
        <label className="lg:flex lg:flex-row items-center my-2">
          <p className="font-medium w-36 text-[hsl(var(--text-primary))]">First Name</p>
          <input
            className="flex-1 w-full border border-[hsl(var(--border))] rounded-md py-2 px-4 bg-[hsl(var(--surface))] text-[hsl(var(--text-primary))] focus:ring-2 focus:ring-[hsl(var(--border-focus))] focus:border-[hsl(var(--border-focus))]"
            type={"text"}
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Enter First Name"
          />
        </label>
      </div>
      <div className="mt-6">
        <label className="lg:flex lg:flex-row items-center my-2">
          <p className="font-medium w-36 text-[hsl(var(--text-primary))]">Last Name</p>
          <input
            className="flex-1 w-full border border-[hsl(var(--border))] rounded-md py-2 px-4 bg-[hsl(var(--surface))] text-[hsl(var(--text-primary))] focus:ring-2 focus:ring-[hsl(var(--border-focus))] focus:border-[hsl(var(--border-focus))]"
            type={"text"}
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Enter Last Name"
          />
        </label>
      </div>
      <div className="mt-6">
        <label className="lg:flex lg:flex-row items-center my-2">
          <p className="font-medium w-36 text-[hsl(var(--text-primary))]">Street Address</p>
          <input
            className="flex-1 w-full border border-[hsl(var(--border))] rounded-md py-2 px-4 bg-[hsl(var(--surface))] text-[hsl(var(--text-primary))] focus:ring-2 focus:ring-[hsl(var(--border-focus))] focus:border-[hsl(var(--border-focus))]"
            type={"text"}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter Street Address"
          />
        </label>
      </div>
      <div className="mt-6">
        <label className="lg:flex lg:flex-row items-center">
          <p className="font-medium w-36 text-[hsl(var(--text-primary))]">Country</p>
          <Select
            className="flex-1"
            options={countryOptions}
            value={selectedCountry}
            onChange={handleCountryChange}
            placeholder="Select a country"
            isSearchable
            styles={{
              control: (provided, state) => ({
                ...provided,
                backgroundColor: 'hsl(var(--surface))',
                borderColor: state.isFocused ? 'hsl(var(--border-focus))' : 'hsl(var(--border))',
                color: 'hsl(var(--text-primary))',
                boxShadow: state.isFocused ? '0 0 0 2px hsl(var(--border-focus))' : 'none',
                '&:hover': {
                  borderColor: 'hsl(var(--border-focus))'
                }
              }),
              singleValue: (provided) => ({
                ...provided,
                color: 'hsl(var(--text-primary))'
              }),
              placeholder: (provided) => ({
                ...provided,
                color: 'hsl(var(--text-secondary))'
              }),
              input: (provided) => ({
                ...provided,
                color: 'hsl(var(--text-primary))'
              }),
              menu: (provided) => ({
                ...provided,
                backgroundColor: 'hsl(var(--surface))',
                border: '1px solid hsl(var(--border))'
              }),
              option: (provided, state) => ({
                ...provided,
                backgroundColor: state.isSelected 
                  ? 'hsl(var(--primary))' 
                  : state.isFocused 
                    ? 'hsl(var(--surface-hover))' 
                    : 'hsl(var(--surface))',
                color: state.isSelected 
                  ? 'hsl(var(--text-inverse))' 
                  : 'hsl(var(--text-primary))',
                '&:hover': {
                  backgroundColor: state.isSelected 
                    ? 'hsl(var(--primary))' 
                    : 'hsl(var(--surface-hover))'
                }
              })
            }}
          />
        </label>
      </div>
      {selectedCountry?.value === "CA" && (
        <div className="mt-6">
          <label className="lg:flex lg:flex-row items-center">
            <p className="font-medium w-36 text-[hsl(var(--text-primary))]">Province</p>
            <Select
              className="flex-1"
              options={provinceOptions}
              value={selectedProvince}
              onChange={setSelectedProvince}
              placeholder="Select a province"
              isSearchable
              styles={{
                control: (provided, state) => ({
                  ...provided,
                  backgroundColor: 'hsl(var(--surface))',
                  borderColor: state.isFocused ? 'hsl(var(--border-focus))' : 'hsl(var(--border))',
                  color: 'hsl(var(--text-primary))',
                  boxShadow: state.isFocused ? '0 0 0 2px hsl(var(--border-focus))' : 'none',
                  '&:hover': {
                    borderColor: 'hsl(var(--border-focus))'
                  }
                }),
                singleValue: (provided) => ({
                  ...provided,
                  color: 'hsl(var(--text-primary))'
                }),
                placeholder: (provided) => ({
                  ...provided,
                  color: 'hsl(var(--text-secondary))'
                }),
                input: (provided) => ({
                  ...provided,
                  color: 'hsl(var(--text-primary))'
                }),
                menu: (provided) => ({
                  ...provided,
                  backgroundColor: 'hsl(var(--surface))',
                  border: '1px solid hsl(var(--border))'
                }),
                option: (provided, state) => ({
                  ...provided,
                  backgroundColor: state.isSelected 
                    ? 'hsl(var(--primary))' 
                    : state.isFocused 
                      ? 'hsl(var(--surface-hover))' 
                      : 'hsl(var(--surface))',
                  color: state.isSelected 
                    ? 'hsl(var(--text-inverse))' 
                    : 'hsl(var(--text-primary))',
                  '&:hover': {
                    backgroundColor: state.isSelected 
                      ? 'hsl(var(--primary))' 
                      : 'hsl(var(--surface-hover))'
                  }
                })
              }}
            />
          </label>
        </div>
      )}
      <div className="mt-6">
        <label className="lg:flex lg:flex-row items-center my-2">
          <p className="font-medium w-36 text-[hsl(var(--text-primary))]">City</p>
          <input
            className="flex-1 w-full border border-[hsl(var(--border))] rounded-md py-2 px-4 bg-[hsl(var(--surface))] text-[hsl(var(--text-primary))] focus:ring-2 focus:ring-[hsl(var(--border-focus))] focus:border-[hsl(var(--border-focus))]"
            type={"text"}
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter City"
          />
        </label>
      </div>
      <div className="mt-6">
        <label className="lg:flex lg:flex-row items-center my-2">
          <p className="font-medium w-36 text-[hsl(var(--text-primary))]">Zip/Postal Code</p>
          <input
            className="flex-1 w-full border border-[hsl(var(--border))] rounded-md py-2 px-4 bg-[hsl(var(--surface))] text-[hsl(var(--text-primary))] focus:ring-2 focus:ring-[hsl(var(--border-focus))] focus:border-[hsl(var(--border-focus))]"
            type={"text"}
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            placeholder="Enter Postal Code"
          />
        </label>
      </div>
      <div className="mt-6">
        <label className="lg:flex lg:flex-row items-center">
          <p className="font-medium w-36 text-[hsl(var(--text-primary))]">Phone Number</p>
          <input
            className="flex-1 w-full border border-[hsl(var(--border))] rounded-md py-2 px-4 bg-[hsl(var(--surface))] text-[hsl(var(--text-primary))] focus:ring-2 focus:ring-[hsl(var(--border-focus))] focus:border-[hsl(var(--border-focus))]"
            type={"tel"}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Enter Phone Number"
          />
        </label>
      </div>
    </form>
  );
}
