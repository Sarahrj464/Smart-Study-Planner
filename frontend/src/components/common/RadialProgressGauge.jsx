import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const RadialProgressGauge = ({ value = 0, color = "#2563EB", size = 100 }) => {
    const data = [
        { name: 'Progress', value: value },
        { name: 'Remaining', value: Math.max(0, 100 - value) }
    ];

    const COLORS = [color, '#e2e8f0']; // Darkened background for better contrast

    return (
        <div style={{ width: size, height: size / 2 + 5, overflow: 'hidden' }} className="relative flex items-end justify-center">
            <ResponsiveContainer width="100%" height={size}>
                <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="100%"
                        startAngle={180}
                        endAngle={0}
                        innerRadius="75%" // Thicker, more premium look
                        outerRadius="100%"
                        paddingAngle={0}
                        dataKey="value"
                        stroke="none"
                        animationDuration={300}
                    >
                        {data.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                                cornerRadius={12}
                            />
                        ))}
                    </Pie>
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default RadialProgressGauge;
