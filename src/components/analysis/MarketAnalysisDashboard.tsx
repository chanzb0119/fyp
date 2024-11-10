// src/components/analysis/MarketAnalysisDashboard.tsx

import React, { useMemo, useState } from 'react';
import { LineChart, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Line, Bar } from 'recharts';
import { analyzeRentalData } from '@/services/rentalAnalysis';
import { ResponsiveChartWrapper } from './ResponsiveChartWrapper';
import { Property } from '@/libs/types/database';

interface MarketAnalysisDashboardProps {
  properties: Property[];
}

export default function MarketAnalysisDashboard({ properties }: MarketAnalysisDashboardProps) {
  const analysis = useMemo(() => analyzeRentalData(properties), [properties]);
  const [selectedState, setSelectedState] = useState<string | null>(null);

  if (!properties || properties.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-gray-500">Loading market analysis...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Listings</h3>
          <p className="text-3xl font-bold text-blue-600">{analysis.totalListings}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Average Price</h3>
          <p className="text-3xl font-bold text-blue-600">
            RM {analysis.typeAnalysis.reduce((acc, type) => 
              acc + (type.averagePrice * type.count), 0) / analysis.totalListings}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Most Common Type</h3>
          <p className="text-3xl font-bold text-blue-600">
            {analysis.typeAnalysis.sort((a, b) => b.count - a.count)[0]?.type || 'N/A'}
          </p>
        </div>
      </div>

      {/* Property Types Chart */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">
          Price Distribution by Property Type
        </h3>
        <div className="h-80">
          <ResponsiveChartWrapper>
            {(width) => (
              <BarChart
                width={width}
                height={300}
                data={analysis.typeAnalysis}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="type" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="averagePrice" name="Average Price" fill="#3b82f6" />
                <Bar dataKey="medianPrice" name="Median Price" fill="#10b981" />
              </BarChart>
            )}
          </ResponsiveChartWrapper>
        </div>
      </div>

      {/* Room Analysis */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">
          Average Price by Number of Rooms
        </h3>
        <div className="h-80">
          <ResponsiveChartWrapper>
            {(width) => (
              <LineChart
                width={width}
                height={300}
                data={analysis.roomAnalysis}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="rooms" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="averagePrice" stroke="#3b82f6" name="Average Price" />
                <Line type="monotone" dataKey="medianPrice" stroke="#10b981" name="Median Price" />
              </LineChart>
            )}
          </ResponsiveChartWrapper>
        </div>
      </div>

      {/* Furnishing Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {Object.entries(analysis.furnishingAnalysis).map(([type, data]) => (
          <div key={type} className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 capitalize">
              {type.replace(/([A-Z])/g, ' $1').trim()}
            </h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                Count: <span className="font-semibold">{data.count}</span>
              </p>
              <p className="text-sm text-gray-600">
                Average Price: <span className="font-semibold">RM {data.averagePrice.toFixed(2)}</span>
              </p>
              <p className="text-sm text-gray-600">
                Median Price: <span className="font-semibold">RM {data.medianPrice.toFixed(2)}</span>
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* State Analysis */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Price Analysis by State</h3>
        <div className="h-80">
          <ResponsiveChartWrapper>
            {(width) => (
              <BarChart
                width={width}
                height={300}
                data={analysis.stateAnalysis}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                onClick={(data) => {
                  if (data && data.activePayload) {
                    setSelectedState(data.activePayload[0].payload.state);
                  }
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="state" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="averagePrice" name="Average Price" fill="#3b82f6" />
                <Bar dataKey="medianPrice" name="Median Price" fill="#10b981" />
              </BarChart>
            )}
          </ResponsiveChartWrapper>
        </div>
      </div>

      {/* City Analysis (shows only when a state is selected) */}
      {selectedState && analysis.cityAnalysisByState[selectedState] && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900">
              Price Analysis by City in {selectedState}
            </h3>
            <button
              onClick={() => setSelectedState(null)}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Back to State View
            </button>
          </div>
          <div className="h-80">
            <ResponsiveChartWrapper>
              {(width) => (
                <BarChart
                  width={width}
                  height={300}
                  data={analysis.cityAnalysisByState[selectedState]}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="city" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="averagePrice" name="Average Price" fill="#3b82f6" />
                  <Bar dataKey="medianPrice" name="Median Price" fill="#10b981" />
                </BarChart>
              )}
            </ResponsiveChartWrapper>
          </div>
        </div>
      )}
    </div>
  );
}