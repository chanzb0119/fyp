import React, { useMemo } from 'react';
import { BarChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Bar } from 'recharts';
import { analyzeRentalData } from '@/services/rentalAnalysis';
import { ResponsiveChartWrapper } from './ResponsiveChartWrapper';
import { Property } from '@/lib/types/database';

interface MarketAnalysisDashboardProps {
  properties: Property[];
}

export default function MarketAnalysisDashboard({ properties }: MarketAnalysisDashboardProps) {
  const analysis = useMemo(() => analyzeRentalData(properties), [properties]);

  if (!properties || properties.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-gray-500">No data available for analysis</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Listings</h3>
          <p className="text-3xl font-bold text-blue-600">{analysis.totalListings}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Avg. Price per Bed</h3>
          <p className="text-3xl font-bold text-blue-600">
            RM {analysis.averagePricePerBed.toFixed(2)}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Avg. Price per Sqft</h3>
          <p className="text-3xl font-bold text-blue-600">
            RM {analysis.averagePricePerSqft.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Property Type Analysis */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">
          Price Analysis by Property Type
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
                <Bar dataKey="averagePricePerBed" name="Price per Bed" fill="#10b981" />
                <Bar dataKey="averagePricePerSqft" name="Price per Sqft" fill="#f59e0b" />
              </BarChart>
            )}
          </ResponsiveChartWrapper>
        </div>
      </div>

      {/* State Analysis */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">
          Price Analysis by State
        </h3>
        <div className="h-80">
          <ResponsiveChartWrapper>
            {(width) => (
              <BarChart
                width={width}
                height={300}
                data={analysis.stateAnalysis}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="state" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="averagePrice" name="Average Price" fill="#3b82f6" />
                <Bar dataKey="averagePricePerBed" name="Price per Bed" fill="#10b981" />
                <Bar dataKey="averagePricePerSqft" name="Price per Sqft" fill="#f59e0b" />
              </BarChart>
            )}
          </ResponsiveChartWrapper>
        </div>
      </div>
    </div>
  );
}