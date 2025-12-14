export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-white p-4 md:p-8 lg:p-12 pb-24 md:pb-12">
      <div className="md:max-w-full md:mx-auto">
        {/* Enhanced Header Section */}
        <div className="mb-8 md:mb-12 bg-linear-to-r from-purple-50 to-pink-50 rounded-2xl shadow-sm p-5 md:p-8 border border-purple-100">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-linear-to-br from-purple-500 to-pink-600 shadow-lg">
              <svg className="w-7 h-7 md:w-8 md:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="flex-1">
              <h1 className="text-2xl md:text-4xl font-bold text-slate-800 tracking-tight mb-1">
                Admin Dashboard
              </h1>
              <p className="text-slate-600 text-xs md:text-base flex items-center gap-2">
                <span className="inline-block w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>
                Welcome back! Here&apos;s your system overview
              </p>
            </div>
          </div>
        </div>

        {/* Summary Cards - Enhanced */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8 mb-8 md:mb-12">
          {/* Total Stations Card */}
          <div className="group bg-linear-to-br from-white to-blue-50 rounded-2xl shadow-md hover:shadow-xl active:shadow-lg transition-all duration-300 p-6 md:p-8 border border-blue-100 hover:border-blue-300 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 opacity-5 rounded-full -mr-16 -mt-16"></div>
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-5">
                <div className="flex items-center justify-center w-16 h-16 md:w-18 md:h-18 rounded-2xl bg-linear-to-br from-blue-500 to-indigo-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 md:w-9 md:h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div className="text-right">
                  <p className="text-sm md:text-base font-bold text-blue-600 uppercase tracking-wider">
                    Total Stations
                  </p>
                </div>
              </div>
              <h3 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
                12
              </h3>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs md:text-sm font-bold bg-green-100 text-green-700">
                  <svg className="w-3.5 h-3.5 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  All Active
                </span>
                <span className="text-xs md:text-sm text-slate-600 font-medium">
                  100% operational
                </span>
              </div>
            </div>
          </div>

          {/* Total Officers Card */}
          <div className="group bg-linear-to-br from-white to-purple-50 rounded-2xl shadow-md hover:shadow-xl active:shadow-lg transition-all duration-300 p-6 md:p-8 border border-purple-100 hover:border-purple-300 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500 opacity-5 rounded-full -mr-16 -mt-16"></div>
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-5">
                <div className="flex items-center justify-center w-16 h-16 md:w-18 md:h-18 rounded-2xl bg-linear-to-br from-purple-500 to-pink-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 md:w-9 md:h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <div className="text-right">
                  <p className="text-sm md:text-base font-bold text-purple-600 uppercase tracking-wider">
                    Total Officers
                  </p>
                </div>
              </div>
              <h3 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
                487
              </h3>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs md:text-sm font-bold bg-blue-100 text-blue-700">
                  <svg className="w-3.5 h-3.5 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  +23
                </span>
                <span className="text-xs md:text-sm text-slate-600 font-medium">this month</span>
              </div>
            </div>
          </div>

          {/* Active ID Cards Card */}
          <div className="group bg-linear-to-br from-white to-green-50 rounded-2xl shadow-md hover:shadow-xl active:shadow-lg transition-all duration-300 p-6 md:p-8 border border-green-100 hover:border-green-300 relative overflow-hidden md:col-span-2 lg:col-span-1">
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-500 opacity-5 rounded-full -mr-16 -mt-16"></div>
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-5">
                <div className="flex items-center justify-center w-16 h-16 md:w-18 md:h-18 rounded-2xl bg-linear-to-br from-green-500 to-emerald-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 md:w-9 md:h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                  </svg>
                </div>
                <div className="text-right">
                  <p className="text-sm md:text-base font-bold text-green-600 uppercase tracking-wider">
                    Active ID Cards
                  </p>
                </div>
              </div>
              <h3 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
                465
              </h3>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs md:text-sm font-bold bg-green-100 text-green-700">
                  <svg className="w-3.5 h-3.5 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  95.5%
                </span>
                <span className="text-xs md:text-sm text-slate-600 font-medium">
                  completion rate
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Rank Distribution Section - Enhanced */}
        <div className="bg-white rounded-2xl shadow-lg border-2 border-slate-200 p-6 md:p-8 mb-8 md:mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1.5 h-8 bg-linear-to-b from-purple-500 to-pink-600 rounded-full"></div>
            <h2 className="text-lg md:text-2xl font-bold text-slate-800">
              Officer Distribution by Rank
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <div className="p-5 md:p-6 bg-linear-to-br from-purple-50 to-purple-100 rounded-2xl border-2 border-purple-200 hover:shadow-lg transition-shadow">
              <p className="text-xs md:text-sm text-purple-700 font-bold mb-2 uppercase tracking-wide">SI Inspector</p>
              <p className="text-3xl md:text-4xl font-bold text-slate-800">28</p>
            </div>
            <div className="p-5 md:p-6 bg-linear-to-br from-blue-50 to-blue-100 rounded-2xl border-2 border-blue-200 hover:shadow-lg transition-shadow">
              <p className="text-xs md:text-sm text-blue-700 font-bold mb-2 uppercase tracking-wide">ASI</p>
              <p className="text-3xl md:text-4xl font-bold text-slate-800">95</p>
            </div>
            <div className="p-5 md:p-6 bg-linear-to-br from-indigo-50 to-indigo-100 rounded-2xl border-2 border-indigo-200 hover:shadow-lg transition-shadow">
              <p className="text-xs md:text-sm text-indigo-700 font-bold mb-2 uppercase tracking-wide">Head Constable</p>
              <p className="text-3xl md:text-4xl font-bold text-slate-800">142</p>
            </div>
            <div className="p-5 md:p-6 bg-linear-to-br from-cyan-50 to-cyan-100 rounded-2xl border-2 border-cyan-200 hover:shadow-lg transition-shadow">
              <p className="text-xs md:text-sm text-cyan-700 font-bold mb-2 uppercase tracking-wide">Constable</p>
              <p className="text-3xl md:text-4xl font-bold text-slate-800">222</p>
            </div>
          </div>
        </div>

        {/* System Overview Section - Enhanced */}
        <div className="bg-white rounded-2xl shadow-lg border-2 border-slate-200 p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1.5 h-8 bg-linear-to-b from-blue-500 to-indigo-600 rounded-full"></div>
            <h2 className="text-lg md:text-2xl font-bold text-slate-800">
              System Overview
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <div className="p-5 md:p-6 bg-linear-to-br from-orange-50 to-orange-100 rounded-2xl border-2 border-orange-200 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                <p className="text-xs md:text-sm text-orange-700 font-bold uppercase tracking-wide">
                  Pending Approvals
                </p>
              </div>
              <p className="text-3xl md:text-4xl font-bold text-slate-800">8</p>
            </div>
            <div className="p-5 md:p-6 bg-linear-to-br from-green-50 to-green-100 rounded-2xl border-2 border-green-200 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <p className="text-xs md:text-sm text-green-700 font-bold uppercase tracking-wide">
                  New This Week
                </p>
              </div>
              <p className="text-3xl md:text-4xl font-bold text-slate-800">15</p>
            </div>
            <div className="p-5 md:p-6 bg-linear-to-br from-yellow-50 to-yellow-100 rounded-2xl border-2 border-yellow-200 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                <p className="text-xs md:text-sm text-yellow-700 font-bold uppercase tracking-wide">
                  Expiring Soon
                </p>
              </div>
              <p className="text-3xl md:text-4xl font-bold text-slate-800">12</p>
            </div>
            <div className="p-5 md:p-6 bg-linear-to-br from-blue-50 to-blue-100 rounded-2xl border-2 border-blue-200 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <p className="text-xs md:text-sm text-blue-700 font-bold uppercase tracking-wide">
                  Updated Today
                </p>
              </div>
              <p className="text-3xl md:text-4xl font-bold text-slate-800">5</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
