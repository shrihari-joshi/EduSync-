"use client";
import React from "react";
import { useColorModeValue, useColorMode } from "@chakra-ui/react";
import {
    ResponsiveContainer,
    AreaChart,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    Legend,
    Area,
} from "recharts";

const data = [
    {
        name: "Module 1",
        yourScore: 85,
    },
    {
        name: "Module 2",
        yourScore: 78,
    },
    {
        name: "Module 3",
        yourScore: 74,
    },
    {
        name: "Module 4",
        yourScore: 80,
    },
    {
        name: "Module 5",
        yourScore: 85,
    },
];


const PerformanceChart = () => {

    const { colorMode, toggleColorMode } = useColorMode();
    const isDark = colorMode === 'dark';
    return (
        <div className='p-4 rounded-2xl shadow-md ${isDark ? "bg-gray-800 text-white" : "bg-white text-gray-800" }'>
            {/* Header Section */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold">Performance</h2>
                <div className="flex items-center gap-2 text-sm text-gray-500 cursor-pointer">
                    <span>📅 2024 - 2025</span>
                </div>
            </div>

            {/* Chart Section */}
            <div className="w-full h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={data}
                        margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
                    >
                        <defs>
                            <linearGradient id="colorYourScore" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#00b4d8" stopOpacity={0.5} />
                                <stop offset="95%" stopColor="#00b4d8" stopOpacity={0} />
                            </linearGradient>
                        </defs>

                        <XAxis dataKey="name" />
                        <YAxis domain={[65, 90]} />
                        <CartesianGrid strokeDasharray="3 3" />
                        <Tooltip />
                        <Legend verticalAlign="bottom" height={36} />

                        <Area
                            type="monotone"
                            dataKey="yourScore"
                            name="Your Score"
                            stroke="#00b4d8"
                            fillOpacity={1}
                            fill="url(#colorYourScore)"
                            dot={{ fill: "#00b4d8", strokeWidth: 2, r: 4 }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default PerformanceChart;
