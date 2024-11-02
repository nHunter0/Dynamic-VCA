import React, { useState } from "react";
import { TrendingUp, ChevronDown, Search } from "lucide-react";
import STOCK_OPTIONS from "../StockOptions";

const Header = ({
  ticker,
  setTicker,
  monthlyTarget,
  setMonthlyTarget,
  totalTarget,
  setTotalTarget,
  fetchData,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredOptions = STOCK_OPTIONS.filter(
    (option) =>
      option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      option.value.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectStock = (option) => {
    setTicker(option.value);
    setDropdownOpen(false);
    fetchData(option.value);
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-blue-400" />
            Market Analytics
          </h1>
          <p className="text-gray-400">Professional Trading Dashboard</p>
        </div>

        {/* Stock Selector Dropdown */}
        <div className="relative w-full md:w-96">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-full px-4 py-2 bg-gray-700 rounded-lg flex items-center justify-between hover:bg-gray-650 transition-colors"
          >
            <span>
              {STOCK_OPTIONS.find((opt) => opt.value === ticker)?.label ||
                ticker}
            </span>
            <ChevronDown
              className={`w-5 h-5 transition-transform ${
                dropdownOpen ? "transform rotate-180" : ""
              }`}
            />
          </button>

          {dropdownOpen && (
            <div className="absolute mt-2 w-full bg-gray-800 rounded-lg shadow-lg z-50 border border-gray-700">
              <div className="p-2">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search stocks..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <Search className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
                </div>
              </div>
              <div className="max-h-60 overflow-y-auto">
                {filteredOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleSelectStock(option)}
                    className="w-full px-4 py-2 text-left hover:bg-gray-700 focus:outline-none focus:bg-gray-700"
                  >
                    <div className="font-medium">{option.label}</div>
                    <div className="text-sm text-gray-400">
                      {option.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <div className="flex flex-col gap-1">
            <label htmlFor="monthly-target" className="text-sm text-gray-400">
              Monthly Investment ($)
            </label>
            <input
              id="monthly-target"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={monthlyTarget}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, "");
                setMonthlyTarget(value ? Number(value) : 0);
              }}
              className="px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="total-target" className="text-sm text-gray-400">
              Total Target ($)
            </label>
            <input
              id="total-target"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={totalTarget}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, "");
                setTotalTarget(value ? Number(value) : 0);
              }}
              className="px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            />
          </div>

          <button
            onClick={() => fetchData(ticker)}
            className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors mt-auto"
          >
            Refresh
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;
