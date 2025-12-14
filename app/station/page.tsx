"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { FiUsers, FiAlertCircle, FiTrendingUp } from "react-icons/fi";


interface DashboardStats {
  totalOfficers: number;
  incompleteRecords: number;
  recentAdditions: number;
  completionRate: number;
}


export default function StationDashboard() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<DashboardStats>({
    totalOfficers: 0,
    incompleteRecords: 0,
    recentAdditions: 0,
    completionRate: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  useEffect(() => {
    if (session?.user?.station_id) {
      fetchDashboardStats(session.user.station_id);
    }
  }, [session]);


  const fetchDashboardStats = async (stationId: string) => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/station/dashboard-stats?station_id=${stationId}`);
      const data = await response.json();


      if (data.success) {
        setStats(data.data);
      } else {
        setError(data.message);
      }
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      setError("Failed to load dashboard statistics");
    } finally {
      setLoading(false);
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-white p-4 md:p-0 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-blue-500 mb-4"></div>
          <p className="text-slate-600 text-sm md:text-base">Loading dashboard...</p>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-white p-4 md:p-8 lg:p-12 pb-24 md:pb-12">
      <div className="md:max-w-full md:mx-auto">
        {/* Header Section with Enhanced Styling */}
        <div className="mb-6 md:mb-10 bg-white rounded-2xl shadow-sm p-4 md:p-8 border border-slate-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl md:text-4xl font-bold text-slate-800 tracking-tight mb-2">
                Station Dashboard
              </h1>
              <p className="text-slate-500 text-xs md:text-base flex items-center gap-2">
                <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                Welcome back! Here&apos;s your station overview for <span className="font-semibold text-slate-700">{session?.user?.station_name}</span>
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center gap-3">
              <div className="text-right hidden md:block">
                <p className="text-xs text-slate-500">Last Updated</p>
                <p className="text-sm font-semibold text-slate-700">Just now</p>
              </div>
            </div>
          </div>
        </div>


        {/* Error Message */}
        {error && (
          <div className="mb-4 md:mb-6 p-3 md:p-4 bg-red-50 border border-red-200 rounded-xl shadow-sm">
            <div className="flex items-center gap-2">
              <FiAlertCircle className="w-5 h-5 text-red-600" />
              <p className="text-xs md:text-sm text-red-700 font-medium">{error}</p>
            </div>
          </div>
        )}


        {/* Summary Cards - Full Width Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-10">
          {/* Total Officers Card */}
          <div className="group bg-linear-to-br from-white to-blue-50 rounded-2xl shadow-md hover:shadow-xl active:shadow-lg transition-all duration-300 p-5 md:p-7 border border-blue-100 hover:border-blue-300 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 opacity-5 rounded-full -mr-16 -mt-16"></div>
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-linear-to-br from-blue-500 to-indigo-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <FiUsers className="w-7 h-7 md:w-8 md:h-8 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-xs md:text-sm font-semibold text-blue-600 uppercase tracking-wider">
                    Total Officers
                  </p>
                </div>
              </div>
              <h3 className="text-4xl md:text-5xl font-bold text-slate-800 mb-3">
                {stats.totalOfficers}
              </h3>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center px-2.5 md:px-3 py-1 md:py-1.5 rounded-full text-xs md:text-sm font-semibold bg-green-100 text-green-700">
                  <FiTrendingUp className="w-3 h-3 md:w-3.5 md:h-3.5 mr-1" />
                  +{stats.recentAdditions}
                </span>
                <span className="text-xs md:text-sm text-slate-600">this month</span>
              </div>
            </div>
          </div>


          {/* Incomplete Records Card */}
          <div className="group bg-linear-to-br from-white to-orange-50 rounded-2xl shadow-md hover:shadow-xl active:shadow-lg transition-all duration-300 p-5 md:p-7 border border-orange-100 hover:border-orange-300 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500 opacity-5 rounded-full -mr-16 -mt-16"></div>
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-linear-to-br from-orange-500 to-orange-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-7 h-7 md:w-8 md:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="text-right">
                  <p className="text-xs md:text-sm font-semibold text-orange-600 uppercase tracking-wider">
                    Incomplete
                  </p>
                </div>
              </div>
              <h3 className="text-4xl md:text-5xl font-bold text-slate-800 mb-3">
                {stats.incompleteRecords}
              </h3>
              <div className="flex items-center gap-2">
                {stats.incompleteRecords > 0 ? (
                  <>
                    <span className="inline-flex items-center px-2.5 md:px-3 py-1 md:py-1.5 rounded-full text-xs md:text-sm font-semibold bg-orange-100 text-orange-700">
                      <FiAlertCircle className="w-3 h-3 md:w-3.5 md:h-3.5 mr-1" />
                      Action Required
                    </span>
                  </>
                ) : (
                  <span className="inline-flex items-center px-2.5 md:px-3 py-1 md:py-1.5 rounded-full text-xs md:text-sm font-semibold bg-green-100 text-green-700">
                    ✓ All Complete
                  </span>
                )}
              </div>
            </div>
          </div>


          {/* Completion Rate Card */}
          <div className="group bg-linear-to-br from-white to-green-50 rounded-2xl shadow-md hover:shadow-xl active:shadow-lg transition-all duration-300 p-5 md:p-7 border border-green-100 hover:border-green-300 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-500 opacity-5 rounded-full -mr-16 -mt-16"></div>
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-linear-to-br from-green-500 to-green-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-7 h-7 md:w-8 md:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="text-right">
                  <p className="text-xs md:text-sm font-semibold text-green-600 uppercase tracking-wider">
                    Completion
                  </p>
                </div>
              </div>
              <h3 className="text-4xl md:text-5xl font-bold text-slate-800 mb-3">
                {stats.completionRate}%
              </h3>
              <div className="w-full bg-slate-200 rounded-full h-2.5 md:h-3 overflow-hidden shadow-inner">
                <div 
                  className="bg-linear-to-r from-green-500 to-green-600 h-2.5 md:h-3 rounded-full transition-all duration-700 ease-out shadow-sm"
                  style={{ width: `${stats.completionRate}%` }}
                ></div>
              </div>
            </div>
          </div>


          {/* Recent Activity Card */}
          <div className="group bg-linear-to-br from-white to-purple-50 rounded-2xl shadow-md hover:shadow-xl active:shadow-lg transition-all duration-300 p-5 md:p-7 border border-purple-100 hover:border-purple-300 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500 opacity-5 rounded-full -mr-16 -mt-16"></div>
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-linear-to-br from-purple-500 to-purple-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-7 h-7 md:w-8 md:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <div className="text-right">
                  <p className="text-xs md:text-sm font-semibold text-purple-600 uppercase tracking-wider">
                    This Month
                  </p>
                </div>
              </div>
              <h3 className="text-4xl md:text-5xl font-bold text-slate-800 mb-3">
                {stats.recentAdditions}
              </h3>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center px-2.5 md:px-3 py-1 md:py-1.5 rounded-full text-xs md:text-sm font-semibold bg-purple-100 text-purple-700">
                  New Officers
                </span>
              </div>
            </div>
          </div>
        </div>


        {/* Additional Info Section - Full Width */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-md p-5 md:p-7 border border-slate-200 hover:shadow-lg transition-shadow duration-300">
            <h3 className="text-base md:text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
              Quick Actions
            </h3>
            <div className="space-y-3">
              <button className="w-full text-left px-4 py-3 bg-slate-50 hover:bg-blue-50 rounded-xl transition-colors duration-200 text-sm md:text-base text-slate-700 hover:text-blue-700 font-medium">
                + Add New Officer
              </button>
              <button className="w-full text-left px-4 py-3 bg-slate-50 hover:bg-blue-50 rounded-xl transition-colors duration-200 text-sm md:text-base text-slate-700 hover:text-blue-700 font-medium">
                📋 View All Records
              </button>
              <button className="w-full text-left px-4 py-3 bg-slate-50 hover:bg-blue-50 rounded-xl transition-colors duration-200 text-sm md:text-base text-slate-700 hover:text-blue-700 font-medium">
                📊 Generate Report
              </button>
            </div>
          </div>


          {/* Station Info */}
          <div className="bg-white rounded-2xl shadow-md p-5 md:p-7 border border-slate-200 hover:shadow-lg transition-shadow duration-300">
            <h3 className="text-base md:text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-green-500 rounded-full"></span>
              Station Information
            </h3>
            <div className="space-y-3 text-sm md:text-base">
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-slate-600">Station Name</span>
                <span className="font-semibold text-slate-800">{session?.user?.station_name}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-slate-600">Active Users</span>
                <span className="font-semibold text-slate-800">{stats.totalOfficers}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-slate-600">Status</span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>
                  Active
                </span>
              </div>
            </div>
          </div>


          {/* Performance Metrics */}
          <div className="bg-white rounded-2xl shadow-md p-5 md:p-7 border border-slate-200 hover:shadow-lg transition-shadow duration-300">
            <h3 className="text-base md:text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-purple-500 rounded-full"></span>
              Performance
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2 text-sm">
                  <span className="text-slate-600">Data Quality</span>
                  <span className="font-semibold text-slate-800">{stats.completionRate}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div className="bg-linear-to-r from-purple-500 to-purple-600 h-2 rounded-full" style={{ width: `${stats.completionRate}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2 text-sm">
                  <span className="text-slate-600">Record Updates</span>
                  <span className="font-semibold text-slate-800">85%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div className="bg-linear-to-r from-blue-500 to-blue-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2 text-sm">
                  <span className="text-slate-600">Response Time</span>
                  <span className="font-semibold text-slate-800">92%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div className="bg-linear-to-r from-green-500 to-green-600 h-2 rounded-full" style={{ width: '92%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
