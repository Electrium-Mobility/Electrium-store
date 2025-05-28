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

export default function ShippingForm({ onChange }: ShippingFormProps) {
  const [email, setEmail] = React.useState("");
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [selectedCountry, setSelectedCountry] = React.useState<any>(null);
  const [selectedProvince, setSelectedProvince] = React.useState<any>(null);
  const [city, setCity] = React.useState("");
  const [postalCode, setPostalCode] = React.useState("");
  const [phone, setPhone] = React.useState("");

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
      <p className="font-bold text-xl pb-2">Shipping Information</p>
      <div className="mt-6">
        <label className="lg:flex lg:flex-row items-center">
          <p className="font-medium w-36">Email Address</p>
          <input
            className="flex-1 w-full border border-gray-200 rounded-md py-2 px-4"
            type={"email"}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter Email"
          />
        </label>
      </div>
      <div className="mt-6">
        <label className="lg:flex lg:flex-row items-center my-2">
          <p className="font-medium w-36">First Name</p>
          <input
            className="flex-1 w-full border border-gray-200 rounded-md py-2 px-4"
            type={"text"}
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Enter First Name"
          />
        </label>
      </div>
      <div className="mt-6">
        <label className="lg:flex lg:flex-row items-center my-2">
          <p className="font-medium w-36">Last Name</p>
          <input
            className="flex-1 w-full border border-gray-200 rounded-md py-2 px-4"
            type={"text"}
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Enter Last Name"
          />
        </label>
      </div>
      <div className="mt-6">
        <label className="lg:flex lg:flex-row items-center my-2">
          <p className="font-medium w-36">Street Address</p>
          <input
            className="flex-1 w-full border border-gray-200 rounded-md py-2 px-4"
            type={"text"}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter Street Address"
          />
        </label>
      </div>
      <div className="mt-6">
        <label className="lg:flex lg:flex-row items-center">
          <p className="font-medium w-36">Country</p>
          <Select
            className="flex-1"
            options={countryOptions}
            value={selectedCountry}
            onChange={handleCountryChange}
            placeholder="Select a country"
            isSearchable
          />
        </label>
      </div>
      {selectedCountry?.value === "CA" && (
        <div className="mt-6">
          <label className="lg:flex lg:flex-row items-center">
            <p className="font-medium w-36">Province</p>
            <Select
              className="flex-1"
              options={provinceOptions}
              value={selectedProvince}
              onChange={setSelectedProvince}
              placeholder="Select a province"
              isSearchable
            />
          </label>
        </div>
      )}
      <div className="mt-6">
        <label className="lg:flex lg:flex-row items-center my-2">
          <p className="font-medium w-36">City</p>
          <input
            className="flex-1 w-full border border-gray-200 rounded-md py-2 px-4"
            type={"text"}
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter City"
          />
        </label>
      </div>
      <div className="mt-6">
        <label className="lg:flex lg:flex-row items-center my-2">
          <p className="font-medium w-36">Zip/Postal Code</p>
          <input
            className="flex-1 w-full border border-gray-200 rounded-md py-2 px-4"
            type={"text"}
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            placeholder="Enter Zip/Postal Code"
          />
        </label>
      </div>
      <div className="mt-6">
        <label className="lg:flex lg:flex-row items-center">
          <p className="font-medium w-36">Phone Number</p>
          <input
            className="flex-1 w-full border border-gray-200 rounded-md py-2 px-4"
            type={"text"}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Enter Phone Number"
          />
        </label>
      </div>
    </form>
  );
}
