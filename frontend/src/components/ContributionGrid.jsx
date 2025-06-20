// ContributionGrid.js
import React, { useEffect, useState } from "react";
import { useColorModeValue, useColorMode } from "@chakra-ui/react";

const generateRandomContributions = () => {
    const daysInMonth = [31, 28, 31]; // Days for 3 months (Jan, Feb, Mar)
    return daysInMonth.map((days) =>
        Array.from({ length: days }, () =>
            Math.random() > 0.3 ? Math.floor(Math.random() * 5) : 0 // 30% empty
        )
    );
};

const ContributionGrid = () => {
    const [contributions, setContributions] = useState([]);
    const monthNames = ["Jan", "Feb", "Mar"]; // Month labels

    useEffect(() => {
        setContributions(generateRandomContributions());
    }, []);

    const { colorMode, toggleColorMode } = useColorMode();
    const isDark = colorMode === 'dark';


    // Static colors for grid (no change in dark mode)
    const colors = [
        isDark ? "bg-gray-600" : "bg-gray-100", // No contribution
        "bg-indigo-200",
        "bg-indigo-400",
        "bg-indigo-500",
        "bg-indigo-700",
    ];

    return (
        <div
            className={`flex gap-4 p-4 rounded-lg shadow-md overflow-x-auto transition-colors duration-300        ${isDark ? "bg-gray-800 text-white" : "bg-white text-gray-800"}`}
        >
            {contributions.map((month, monthIndex) => (
                <div key={monthIndex} className="flex flex-col items-center mr-2">
                    {/* Month name */}
                    <span className="text-sm font-semibold mb-1">{monthNames[monthIndex]}</span>
                    {/* Grid for each month */}
                    <div className="grid grid-cols-7 gap-1 relative">
                        {month.map((contribution, index) => (
                            <div
                                key={index}
                                className={`w-4 h-4 rounded ${colors[contribution]} relative group`}
                            >
                                {/* Tooltip on hover */}
                                {contribution > 0 && (
                                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden group-hover:flex items-center justify-center bg-black text-white text-xs px-2 py-1 rounded z-10">
                                        {contribution} task{contribution > 1 ? "s" : ""} completed
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ContributionGrid;
