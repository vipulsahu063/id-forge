"use client";
import { useState, useEffect } from "react";
import { FiSearch, FiEdit2, FiTrash2, FiMapPin, FiEye, FiLock, FiFilter, FiX } from "react-icons/fi";
import ResetPasswordModal from "@/components/admin/ResetPasswordModal";

interface Station {
  id: number;
  station_name: string;
  station_id: string;
  created_date: string;
}

export default function ManageStationPage() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<number[]>([]);
  const [page, setPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const [resetPasswordModal, setResetPasswordModal] = useState({
    isOpen: false,
    stationId: 0,
    stationName: "",
  });

  useEffect(() => {
    fetchStations();
  }, []);

  const fetchStations = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch('/api/admin/stations');
      const data = await response.json();

      if (data.success) {
        setStations(data.data);
      } else {
        setError(data.message);
      }
    } catch {
      setError("Failed to fetch stations");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const filteredStations = stations.filter((s) => {
    return (
      s.station_name.toLowerCase().includes(search.toLowerCase()) ||
      s.station_id.toLowerCase().includes(search.toLowerCase())
    );
  });

  const totalPages = Math.ceil(filteredStations.length / entriesPerPage);
  const paginated = filteredStations.slice((page - 1) * entriesPerPage, page * entriesPerPage);

  const handleSelect = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (checked: boolean) => {
    setSelected(checked ? paginated.map((s) => s.id) : []);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this station? All officers associated with this station will also be deleted.")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/stations/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        setStations(prevStations => prevStations.filter(station => station.id !== id));
        setSelected(prev => prev.filter(stationId => stationId !== id));
        alert(data.message);
      } else {
        alert(data.message);
      }
    } catch {
      alert("Failed to delete station. Please try again.");
    }
  };

  const handleEdit = (id: number) => {
    console.log("Editing station:", id);
  };

  const handleViewDetails = (id: number) => {
    console.log("Viewing station details:", id);
  };

  const handleResetPassword = (id: number, name: string) => {
    setResetPasswordModal({
      isOpen: true,
      stationId: id,
      stationName: name,
    });
  };

  const closeResetPasswordModal = () => {
    setResetPasswordModal({
      isOpen: false,
      stationId: 0,
      stationName: "",
    });
  };

  return (
    <div className="min-h-screen bg-white p-4 md:p-8 lg:p-12 pb-24 md:pb-12">
      <div className="md:max-w-full md:mx-auto">
        {/* Enhanced Header Section */}
        <div className="mb-8 md:mb-12 bg-linear-to-r from-purple-50 to-pink-50 rounded-2xl shadow-sm p-5 md:p-8 border border-purple-100">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-linear-to-br from-purple-500 to-pink-600 shadow-lg">
              <FiMapPin className="w-7 h-7 md:w-8 md:h-8 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl md:text-4xl font-bold text-slate-800 tracking-tight mb-1">
                Manage Stations
              </h1>
              <p className="text-slate-600 text-xs md:text-base flex items-center gap-2">
                <span className="inline-block w-2 h-2 bg-purple-500 rounded-full"></span>
                View, edit, and manage all station records
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
          <div className="bg-white rounded-2xl p-4 md:p-5 border border-slate-200 shadow-md hover:shadow-lg transition-shadow">
            <p className="text-xs md:text-sm text-slate-500 font-semibold mb-1">Total Stations</p>
            <p className="text-2xl md:text-3xl font-bold text-purple-600">{stations.length}</p>
          </div>
          <div className="bg-white rounded-2xl p-4 md:p-5 border border-slate-200 shadow-md hover:shadow-lg transition-shadow">
            <p className="text-xs md:text-sm text-slate-500 font-semibold mb-1">Active</p>
            <p className="text-2xl md:text-3xl font-bold text-green-600">{stations.length}</p>
          </div>
          <div className="bg-white rounded-2xl p-4 md:p-5 border border-slate-200 shadow-md hover:shadow-lg transition-shadow">
            <p className="text-xs md:text-sm text-slate-500 font-semibold mb-1">Filtered</p>
            <p className="text-2xl md:text-3xl font-bold text-blue-600">{filteredStations.length}</p>
          </div>
          <div className="bg-white rounded-2xl p-4 md:p-5 border border-slate-200 shadow-md hover:shadow-lg transition-shadow">
            <p className="text-xs md:text-sm text-slate-500 font-semibold mb-1">Selected</p>
            <p className="text-2xl md:text-3xl font-bold text-orange-600">{selected.length}</p>
          </div>
        </div>

        {/* Main Content Card */}
        <div className="bg-white shadow-lg rounded-2xl border-2 border-slate-200">
          {/* Action Bar */}
          <div className="p-5 md:p-8 border-b-2 border-slate-100">
            <div className="flex flex-col gap-4 md:gap-5">
              {/* Search Bar */}
              <div className="relative w-full">
                <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="text"
                  placeholder="Search by station name or username..."
                  className="border border-slate-300 rounded-xl pl-12 pr-4 py-3.5 text-sm md:text-base bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all w-full shadow-sm hover:shadow-md"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                  >
                    <FiX size={18} />
                  </button>
                )}
              </div>

              {/* Controls Row */}
              <div className="flex items-center justify-between gap-3">
                {/* Left: Show entries & Filter toggle */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="md:hidden p-2.5 rounded-xl border-2 border-slate-300 bg-white hover:bg-slate-50 active:bg-slate-100 transition-colors"
                  >
                    <FiFilter size={18} className="text-slate-600" />
                  </button>
                  
                  <div className="hidden md:flex items-center gap-2.5 bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-200">
                    <span className="text-sm font-semibold text-slate-700">Show</span>
                    <select
                      value={entriesPerPage}
                      onChange={(e) => {
                        setEntriesPerPage(Number(e.target.value));
                        setPage(1);
                      }}
                      className="border border-slate-300 rounded-lg px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium"
                    >
                      <option value={10}>10</option>
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                    </select>
                    <span className="text-sm font-semibold text-slate-700">entries</span>
                  </div>
                </div>

                {/* Right: Bulk Delete */}
                {selected.length > 0 && (
                  <button 
                    className="inline-flex items-center gap-2 bg-linear-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 active:scale-95 text-white font-bold px-5 py-2.5 rounded-xl text-sm md:text-base transition-all shadow-lg hover:shadow-xl"
                  >
                    <FiTrash2 size={18} />
                    <span className="hidden sm:inline">Delete Selected</span>
                    <span className="sm:hidden">Delete</span>
                    <span className="bg-white/20 px-2 py-0.5 rounded-md text-xs font-bold">
                      {selected.length}
                    </span>
                  </button>
                )}
              </div>

              {/* Mobile Filters Dropdown */}
              {showFilters && (
                <div className="md:hidden flex items-center gap-2.5 p-4 bg-purple-50 rounded-xl border border-purple-200">
                  <span className="text-sm font-semibold text-slate-700">Show</span>
                  <select
                    value={entriesPerPage}
                    onChange={(e) => {
                      setEntriesPerPage(Number(e.target.value));
                      setPage(1);
                    }}
                    className="border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium"
                  >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                  </select>
                  <span className="text-sm font-semibold text-slate-700">entries</span>
                </div>
              )}
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="p-12 md:p-20 text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-200 border-t-purple-600"></div>
              <p className="mt-5 text-slate-600 text-base font-semibold">Loading stations...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="p-5 md:p-8">
              <div className="bg-red-50 border-l-4 border-red-500 rounded-xl p-5 md:p-6 shadow-md">
                <p className="text-sm md:text-base text-red-700 font-semibold">{error}</p>
              </div>
            </div>
          )}

          {/* Mobile Card View */}
          {!loading && !error && (
            <>
              <div className="md:hidden divide-y divide-slate-200">
                {paginated.length === 0 ? (
                  <div className="p-12 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
                      <FiMapPin className="w-8 h-8 text-slate-400" />
                    </div>
                    <p className="text-slate-500 text-sm font-semibold">No stations found</p>
                  </div>
                ) : (
                  paginated.map((station, idx) => (
                    <div key={station.id} className="p-4 hover:bg-slate-50 active:bg-slate-100 transition-colors">
                      {/* Card Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={selected.includes(station.id)}
                            onChange={() => handleSelect(station.id)}
                            className="w-5 h-5 accent-purple-500 rounded"
                          />
                          <div className="w-10 h-10 rounded-xl bg-linear-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-md">
                            <FiMapPin className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-800">{station.station_name}</p>
                            <p className="text-xs text-slate-500 font-mono mt-0.5">{station.station_id}</p>
                          </div>
                        </div>
                        <span className="text-xs text-purple-600 font-bold bg-purple-50 px-2 py-1 rounded-lg">
                          #{(page - 1) * entriesPerPage + idx + 1}
                        </span>
                      </div>

                      {/* Card Content */}
                      <div className="mb-3 pl-14">
                        <p className="text-xs text-slate-500 font-medium">
                          Created: <span className="font-semibold text-slate-700">{formatDate(station.created_date)}</span>
                        </p>
                      </div>

                      {/* Card Actions */}
                      <div className="grid grid-cols-4 gap-2 pt-3 border-t border-slate-100">
                        <button
                          onClick={() => handleViewDetails(station.id)}
                          className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 active:bg-blue-200 transition-colors shadow-sm"
                        >
                          <FiEye size={18} />
                          <span className="text-[10px] font-bold">View</span>
                        </button>
                        <button
                          onClick={() => handleEdit(station.id)}
                          className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl bg-green-50 text-green-600 hover:bg-green-100 active:bg-green-200 transition-colors shadow-sm"
                        >
                          <FiEdit2 size={18} />
                          <span className="text-[10px] font-bold">Edit</span>
                        </button>
                        <button
                          onClick={() => handleResetPassword(station.id, station.station_name)}
                          className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl bg-orange-50 text-orange-600 hover:bg-orange-100 active:bg-orange-200 transition-colors shadow-sm"
                        >
                          <FiLock size={18} />
                          <span className="text-[10px] font-bold">Reset</span>
                        </button>
                        <button
                          onClick={() => handleDelete(station.id)}
                          className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 active:bg-red-200 transition-colors shadow-sm"
                        >
                          <FiTrash2 size={18} />
                          <span className="text-[10px] font-bold">Delete</span>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-linear-to-r from-slate-50 to-slate-100">
                    <tr>
                      <th className="px-6 py-5">
                        <input
                          type="checkbox"
                          checked={paginated.length > 0 && paginated.every((s) => selected.includes(s.id))}
                          onChange={(e) => handleSelectAll(e.target.checked)}
                          className="w-5 h-5 accent-purple-500 rounded cursor-pointer"
                        />
                      </th>
                      <th className="px-6 py-5 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Sr No</th>
                      <th className="px-6 py-5 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Station Name</th>
                      <th className="px-6 py-5 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Username</th>
                      <th className="px-6 py-5 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Created Date</th>
                      <th className="px-6 py-5 text-center text-xs font-bold text-slate-600 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200">
                    {paginated.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-16 text-center">
                          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
                            <FiMapPin className="w-8 h-8 text-slate-400" />
                          </div>
                          <p className="text-slate-500 text-base font-semibold">No stations found</p>
                        </td>
                      </tr>
                    ) : (
                      paginated.map((station, idx) => (
                        <tr key={station.id} className="hover:bg-purple-50/30 transition-colors">
                          <td className="px-6 py-5 whitespace-nowrap">
                            <input
                              type="checkbox"
                              checked={selected.includes(station.id)}
                              onChange={() => handleSelect(station.id)}
                              className="w-5 h-5 accent-purple-500 rounded cursor-pointer"
                            />
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap">
                            <span className="text-sm font-bold text-purple-600 bg-purple-50 px-3 py-1.5 rounded-lg">
                              #{(page - 1) * entriesPerPage + idx + 1}
                            </span>
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-linear-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-md">
                                <FiMapPin className="w-5 h-5 text-white" />
                              </div>
                              <span className="text-sm font-bold text-slate-800">{station.station_name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap">
                            <span className="text-sm text-slate-600 font-mono bg-slate-50 px-3 py-1.5 rounded-lg">
                              {station.station_id}
                            </span>
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap text-sm font-semibold text-slate-600">
                            {formatDate(station.created_date)}
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleViewDetails(station.id)}
                                className="p-2.5 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 active:bg-blue-200 transition-all shadow-sm hover:shadow-md"
                                title="View Details"
                              >
                                <FiEye size={18} />
                              </button>
                              <button
                                onClick={() => handleEdit(station.id)}
                                className="p-2.5 rounded-xl bg-green-50 text-green-600 hover:bg-green-100 active:bg-green-200 transition-all shadow-sm hover:shadow-md"
                                title="Edit Station"
                              >
                                <FiEdit2 size={18} />
                              </button>
                              <button
                                onClick={() => handleResetPassword(station.id, station.station_name)}
                                className="p-2.5 rounded-xl bg-orange-50 text-orange-600 hover:bg-orange-100 active:bg-orange-200 transition-all shadow-sm hover:shadow-md"
                                title="Reset Password"
                              >
                                <FiLock size={18} />
                              </button>
                              <button
                                onClick={() => handleDelete(station.id)}
                                className="p-2.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 active:bg-red-200 transition-all shadow-sm hover:shadow-md"
                                title="Delete Station"
                              >
                                <FiTrash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination Footer */}
              <div className="px-5 md:px-8 py-4 md:py-5 border-t-2 border-slate-100 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 md:gap-5">
                <span className="text-xs md:text-sm text-slate-600 font-semibold text-center sm:text-left">
                  Showing <span className="text-purple-600">{paginated.length ? (page - 1) * entriesPerPage + 1 : 0}</span> to{" "}
                  <span className="text-purple-600">{(page - 1) * entriesPerPage + paginated.length}</span> of{" "}
                  <span className="text-purple-600">{filteredStations.length}</span> entries
                </span>
                
                {/* Mobile Pagination */}
                <div className="flex md:hidden justify-center gap-2">
                  <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="px-4 py-2.5 rounded-xl font-bold text-sm bg-white text-slate-700 border-2 border-slate-300 hover:bg-slate-50 active:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                  >
                    Prev
                  </button>
                  <div className="flex items-center px-4 py-2.5 rounded-xl bg-linear-to-r from-purple-500 to-pink-600 text-white font-bold text-sm shadow-md">
                    {page} / {totalPages || 1}
                  </div>
                  <button
                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                    disabled={page === totalPages || totalPages === 0}
                    className="px-4 py-2.5 rounded-xl font-bold text-sm bg-white text-slate-700 border-2 border-slate-300 hover:bg-slate-50 active:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                  >
                    Next
                  </button>
                </div>

                {/* Desktop Pagination */}
                <div className="hidden md:flex gap-2">
                  <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="px-4 py-2.5 rounded-xl font-bold text-sm bg-white text-slate-700 border-2 border-slate-300 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md"
                  >
                    Previous
                  </button>
                  {[...Array(Math.min(totalPages, 5))].map((_, i) => {
                    const pageNum = i + 1;
                    return (
                      <button
                        key={i}
                        onClick={() => setPage(pageNum)}
                        className={`min-w-11 h-11 px-4 rounded-xl font-bold text-sm transition-all ${
                          page === pageNum
                            ? "bg-linear-to-r from-purple-500 to-pink-600 text-white shadow-lg scale-105"
                            : "bg-white text-slate-700 border-2 border-slate-300 hover:bg-slate-50 shadow-sm hover:shadow-md"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                    disabled={page === totalPages || totalPages === 0}
                    className="px-4 py-2.5 rounded-xl font-bold text-sm bg-white text-slate-700 border-2 border-slate-300 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md"
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Reset Password Modal */}
      <ResetPasswordModal
        isOpen={resetPasswordModal.isOpen}
        onClose={closeResetPasswordModal}
        stationId={resetPasswordModal.stationId}
        stationName={resetPasswordModal.stationName}
        onSuccess={() => {
          // Optional: refresh stations list or show success message
        }}
      />
    </div>
  );
}
