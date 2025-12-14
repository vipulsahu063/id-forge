"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { FiSearch, FiEdit2, FiTrash2, FiEye, FiUser, FiCheck, FiX, FiFilter } from "react-icons/fi";

interface Officer {
  id: number;
  station_id: string;
  custom_fields: Record<string, unknown>;
  created_at: string;
}

interface CustomField {
  id: number;
  field_name: string;
  field_label: string;
  field_type: string;
}

export default function ManageOfficersPage() {
  const { data: session } = useSession();
  const [officers, setOfficers] = useState<Officer[]>([]);
  const [customFields, setCustomFields] = useState<CustomField[]>([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<number[]>([]);
  const [page, setPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Image Modal State
  const [imageModal, setImageModal] = useState<{
    isOpen: boolean;
    imageUrl: string;
    title: string;
  }>({
    isOpen: false,
    imageUrl: "",
    title: "",
  });

  useEffect(() => {
    if (session?.user?.station_id) {
      fetchCustomFields(session.user.station_id);
      fetchOfficers(session.user.station_id);
    }
  }, [session]);

  // ESC key listener for modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && imageModal.isOpen) {
        setImageModal({ isOpen: false, imageUrl: "", title: "" });
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [imageModal.isOpen]);

  const fetchCustomFields = async (stationId: string) => {
    try {
      const response = await fetch(`/api/admin/station-fields/${stationId}`);
      const data = await response.json();
      if (data.success) {
        setCustomFields(data.data || []);
      }
    } catch (err) {
      console.error('Error fetching custom fields:', err);
    }
  };

  const fetchOfficers = async (stationId: string) => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/station/officers?station_id=${stationId}`);
      const data = await response.json();

      if (data.success) {
        setOfficers(data.data);
      } else {
        setError(data.message);
      }
    } catch {
      setError("Failed to fetch officers");
    } finally {
      setLoading(false);
    }
  };

  // Filter officers based on search
  const filteredOfficers = officers.filter((o) => {
    if (!o.custom_fields) return false;
    
    const searchLower = search.toLowerCase();
    return Object.values(o.custom_fields).some(value => 
      String(value).toLowerCase().includes(searchLower)
    );
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredOfficers.length / entriesPerPage);
  const paginated = filteredOfficers.slice((page - 1) * entriesPerPage, page * entriesPerPage);

  const handleSelect = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (checked: boolean) => {
    setSelected(checked ? paginated.map((o) => o.id) : []);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this officer?")) {
      return;
    }

    try {
      const response = await fetch(`/api/station/officers/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        setOfficers(prevOfficers => prevOfficers.filter(officer => officer.id !== id));
        setSelected(prev => prev.filter(officerId => officerId !== id));
        setSuccessMessage(data.message);
        
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        setError(data.message);
      }
    } catch {
      setError("Failed to delete officer. Please try again.");
    }
  };

  const handleBulkDelete = async () => {
    if (selected.length === 0) return;

    if (!confirm(`Are you sure you want to delete ${selected.length} officer(s)?`)) {
      return;
    }

    try {
      const deletePromises = selected.map(id =>
        fetch(`/api/station/officers/${id}`, { method: 'DELETE' })
      );

      await Promise.all(deletePromises);

      setOfficers(prevOfficers => 
        prevOfficers.filter(officer => !selected.includes(officer.id))
      );

      setSuccessMessage(`Successfully deleted ${selected.length} officer(s)`);
      setSelected([]);
      
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch {
      setError("Failed to delete some officers. Please try again.");
    }
  };

  const handleEdit = (id: number) => {
    console.log("Editing officer:", id);
  };

  const handleViewDetails = (id: number) => {
    console.log("Viewing officer details:", id);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getFieldValue = (officer: Officer, fieldName: string, fieldType: string, fieldLabel: string) => {
  if (!officer.custom_fields) return 'N/A';
  const value = officer.custom_fields[fieldName];
  
  // If it's a file/image field
  if (fieldType === 'file') {
    // Type guard: check if value is a string
    if (typeof value === 'string' && value && (value.includes('cloudinary') || value.includes('http'))) {
      return (
        <button
          onClick={() => setImageModal({
            isOpen: true,
            imageUrl: value,
            title: fieldLabel,
          })}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 transition-colors"
          title="Click to view image"
        >
          <FiCheck size={16} />
          <span className="text-xs font-medium">View</span>
        </button>
      );
    } else {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-50 text-red-700">
          <FiX size={16} />
          <span className="text-xs font-medium">Missing</span>
        </span>
      );
    }
  }
  
  // Convert to string for display
  return value != null ? String(value) : 'N/A';
};


  const displayFields = customFields.slice(0, 4); // Show fewer columns on mobile

  if (loading) {
    return (
      <div className="min-h-screen bg-white p-4 md:p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-14 w-14 border-4 border-slate-200 border-t-blue-500 mb-4"></div>
          <p className="text-slate-600 text-sm md:text-base font-medium">Loading officers data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-4 md:p-8 lg:p-12 pb-24 md:pb-12">
      <div className="md:max-w-full md:mx-auto">
        {/* Enhanced Header Section */}
        <div className="mb-6 md:mb-10 bg-linear-to-r from-indigo-50 to-purple-50 rounded-2xl shadow-sm p-5 md:p-8 border border-indigo-100">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-linear-to-br from-indigo-500 to-purple-600 shadow-lg">
              <FiUser className="w-7 h-7 md:w-8 md:h-8 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl md:text-4xl font-bold text-slate-800 tracking-tight mb-1">
                Manage Officers
              </h1>
              <p className="text-slate-600 text-xs md:text-base flex items-center gap-2">
                <span className="inline-block w-2 h-2 bg-indigo-500 rounded-full"></span>
                View, edit, and manage officers for <span className="font-semibold text-slate-700">{session?.user?.station_name}</span>
              </p>
            </div>
            <div className="hidden lg:flex items-center gap-3 bg-white rounded-xl px-5 py-3 shadow-sm border border-slate-200">
              <div className="text-right">
                <p className="text-xs text-slate-500 font-medium">Total Officers</p>
                <p className="text-2xl font-bold text-indigo-600">{filteredOfficers.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-4 md:mb-6 p-4 md:p-5 bg-green-50 border-l-4 border-green-500 rounded-xl shadow-md flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <FiCheck className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
              <p className="text-sm md:text-base text-green-700 font-semibold">{successMessage}</p>
            </div>
            <button
              onClick={() => setSuccessMessage("")}
              className="text-green-700 hover:text-green-900 p-1.5 hover:bg-green-100 rounded-lg transition-colors"
            >
              <FiX size={20} />
            </button>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-4 md:mb-6 p-4 md:p-5 bg-red-50 border-l-4 border-red-500 rounded-xl shadow-md flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                <FiX className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
              <p className="text-sm md:text-base text-red-700 font-semibold">{error}</p>
            </div>
            <button
              onClick={() => setError("")}
              className="text-red-700 hover:text-red-900 p-1.5 hover:bg-red-100 rounded-lg transition-colors"
            >
              <FiX size={20} />
            </button>
          </div>
        )}

        {/* Main Content Card - Full Width */}
        <div className="bg-white shadow-lg rounded-2xl border border-slate-200">
          {/* Enhanced Action Bar */}
          <div className="p-5 md:p-7 border-b-2 border-slate-100 bg-linear-to-r from-slate-50 to-slate-100/50">
            <div className="flex flex-col gap-4 md:gap-5">
              {/* Search Bar - Enhanced */}
              <div className="relative w-full">
                <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  placeholder="Search by name, ID, rank, or any field..."
                  className="border-2 border-slate-300 rounded-xl pl-12 pr-4 py-3.5 md:py-3 text-sm md:text-base bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all w-full shadow-sm hover:shadow-md font-medium"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                />
              </div>

              {/* Controls Row */}
              <div className="flex items-center justify-between gap-3">
                {/* Left: Show entries & Filter */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="md:hidden p-2.5 rounded-xl border-2 border-slate-300 bg-white hover:bg-slate-50 active:bg-slate-100 shadow-sm"
                  >
                    <FiFilter size={18} className="text-slate-600" />
                  </button>
                  
                  <div className="hidden md:flex items-center gap-3 bg-white rounded-xl px-4 py-2.5 border-2 border-slate-200 shadow-sm">
                    <span className="text-sm font-semibold text-slate-600">Show</span>
                    <select
                      value={entriesPerPage}
                      onChange={(e) => {
                        setEntriesPerPage(Number(e.target.value));
                        setPage(1);
                      }}
                      className="border-2 border-slate-300 rounded-lg px-3 py-1.5 text-sm font-semibold bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                    >
                      <option value={10}>10</option>
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                    </select>
                    <span className="text-sm font-semibold text-slate-600">entries</span>
                  </div>
                </div>

                {/* Right: Bulk Actions */}
                <div className="flex items-center gap-2">
                  {selected.length > 0 && (
                    <>
                      <span className="hidden sm:inline text-sm font-semibold text-slate-600 bg-indigo-50 px-3 py-1.5 rounded-lg">
                        {selected.length} selected
                      </span>
                      <button 
                        onClick={handleBulkDelete}
                        className="inline-flex items-center gap-2 bg-linear-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 active:scale-95 text-white font-bold px-4 md:px-5 py-2.5 rounded-xl text-xs md:text-sm transition-all shadow-lg hover:shadow-xl"
                      >
                        <FiTrash2 size={16} />
                        <span className="hidden sm:inline">Delete</span>
                        <span className="sm:hidden">({selected.length})</span>
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Mobile Filters Dropdown */}
              {showFilters && (
                <div className="md:hidden flex items-center gap-3 p-4 bg-white rounded-xl border-2 border-slate-200 shadow-sm">
                  <span className="text-sm font-semibold text-slate-600">Show</span>
                  <select
                    value={entriesPerPage}
                    onChange={(e) => {
                      setEntriesPerPage(Number(e.target.value));
                      setPage(1);
                    }}
                    className="border-2 border-slate-300 rounded-lg px-3 py-1.5 text-sm font-semibold bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                  </select>
                  <span className="text-sm font-semibold text-slate-600">entries</span>
                </div>
              )}
            </div>
          </div>

          {/* Table */}
          {customFields.length === 0 ? (
            <div className="p-12 md:p-20 text-center bg-linear-to-br from-slate-50 to-slate-100">
              <div className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-full bg-white shadow-lg mb-6">
                <FiUser className="w-10 h-10 md:w-12 md:h-12 text-slate-400" />
              </div>
              <h3 className="text-lg md:text-2xl font-bold text-slate-700 mb-3">No Fields Configured</h3>
              <p className="text-slate-500 text-sm md:text-base max-w-md mx-auto">
                Please contact admin to configure custom fields for your station before managing officers.
              </p>
            </div>
          ) : (
            <>
              {/* Mobile Card View */}
              <div className="md:hidden divide-y-2 divide-slate-100">
                {paginated.length === 0 ? (
                  <div className="p-12 text-center text-slate-500 text-sm bg-slate-50">
                    <FiSearch className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                    <p className="font-semibold">{search ? 'No officers found matching your search' : 'No officers added yet'}</p>
                  </div>
                ) : (
                  paginated.map((officer, idx) => (
                    <div key={officer.id} className="p-5 hover:bg-slate-50 transition-colors">
                      {/* Card Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={selected.includes(officer.id)}
                            onChange={() => handleSelect(officer.id)}
                            className="w-5 h-5 accent-indigo-500 rounded cursor-pointer"
                          />
                          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
                            #{(page - 1) * entriesPerPage + idx + 1}
                          </span>
                        </div>
                        <span className="text-xs text-slate-500 font-medium bg-slate-100 px-2.5 py-1 rounded-lg">
                          {formatDate(officer.created_at)}
                        </span>
                      </div>

                      {/* Card Content */}
                      <div className="space-y-3 mb-4 bg-slate-50 p-4 rounded-xl">
                        {displayFields.map((field) => (
                          <div key={field.id} className="flex justify-between items-start gap-3">
                            <span className="text-xs font-bold text-slate-600 min-w-[90px]">
                              {field.field_label}:
                            </span>
                            <span className="text-xs text-slate-700 text-right flex-1 font-medium">
                              {getFieldValue(officer, field.field_name, field.field_type, field.field_label)}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Card Actions */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewDetails(officer.id)}
                          className="flex-1 py-2.5 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 active:bg-blue-200 transition-colors text-xs font-bold flex items-center justify-center gap-1.5"
                        >
                          <FiEye size={14} />
                          View
                        </button>
                        <button
                          onClick={() => handleEdit(officer.id)}
                          className="flex-1 py-2.5 rounded-xl bg-green-50 text-green-600 hover:bg-green-100 active:bg-green-200 transition-colors text-xs font-bold flex items-center justify-center gap-1.5"
                        >
                          <FiEdit2 size={14} />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(officer.id)}
                          className="py-2.5 px-3 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 active:bg-red-200 transition-colors"
                        >
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Desktop Table View - Enhanced */}
              <div className="hidden md:block overflow-x-auto">
                <table className="min-w-full divide-y-2 divide-slate-200">
                  <thead className="bg-linear-to-r from-slate-100 to-slate-50">
                    <tr>
                      <th className="px-6 py-5 text-left">
                        <input
                          type="checkbox"
                          checked={paginated.length > 0 && paginated.every((o) => selected.includes(o.id))}
                          onChange={(e) => handleSelectAll(e.target.checked)}
                          className="w-5 h-5 accent-indigo-500 rounded cursor-pointer"
                        />
                      </th>
                      <th className="px-6 py-5 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Sr No
                      </th>
                      {displayFields.map((field) => (
                        <th 
                          key={field.id}
                          className="px-6 py-5 text-left text-xs font-bold text-slate-700 uppercase tracking-wider"
                        >
                          {field.field_label}
                        </th>
                      ))}
                      <th className="px-6 py-5 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Added On
                      </th>
                      <th className="px-6 py-5 text-center text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-100">
                    {paginated.length === 0 ? (
                      <tr>
                        <td colSpan={displayFields.length + 4} className="px-6 py-16 text-center">
                          <FiSearch className="w-16 h-16 mx-auto mb-4 text-slate-200" />
                          <p className="text-slate-500 font-semibold text-lg">
                            {search ? 'No officers found matching your search' : 'No officers added yet'}
                          </p>
                        </td>
                      </tr>
                    ) : (
                      paginated.map((officer, idx) => (
                        <tr key={officer.id} className="hover:bg-indigo-50/50 transition-colors">
                          <td className="px-6 py-5 whitespace-nowrap">
                            <input
                              type="checkbox"
                              checked={selected.includes(officer.id)}
                              onChange={() => handleSelect(officer.id)}
                              className="w-5 h-5 accent-indigo-500 rounded cursor-pointer"
                            />
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap">
                            <span className="text-sm font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg">
                              {(page - 1) * entriesPerPage + idx + 1}
                            </span>
                          </td>
                          {displayFields.map((field) => (
                            <td 
                              key={field.id}
                              className="px-6 py-5 whitespace-nowrap text-sm text-slate-600 font-medium"
                            >
                              {getFieldValue(officer, field.field_name, field.field_type, field.field_label)}
                            </td>
                          ))}
                          <td className="px-6 py-5 whitespace-nowrap text-sm text-slate-600 font-medium">
                            {formatDate(officer.created_at)}
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleViewDetails(officer.id)}
                                className="p-2.5 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all shadow-sm hover:shadow-md"
                                title="View Details"
                              >
                                <FiEye size={16} />
                              </button>
                              <button
                                onClick={() => handleEdit(officer.id)}
                                className="p-2.5 rounded-xl bg-green-50 text-green-600 hover:bg-green-100 transition-all shadow-sm hover:shadow-md"
                                title="Edit Officer"
                              >
                                <FiEdit2 size={16} />
                              </button>
                              <button
                                onClick={() => handleDelete(officer.id)}
                                className="p-2.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-all shadow-sm hover:shadow-md"
                                title="Delete Officer"
                              >
                                <FiTrash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Enhanced Pagination Footer */}
              <div className="px-5 md:px-7 py-4 md:py-5 border-t-2 border-slate-100 bg-linear-to-r from-slate-50 to-slate-100/50 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <span className="text-xs md:text-sm text-slate-600 font-semibold bg-white px-4 py-2 rounded-lg shadow-sm">
                    Showing <span className="font-bold text-indigo-600">{paginated.length ? (page - 1) * entriesPerPage + 1 : 0}</span> to{" "}
                    <span className="font-bold text-indigo-600">{(page - 1) * entriesPerPage + paginated.length}</span> of{" "}
                    <span className="font-bold text-indigo-600">{filteredOfficers.length}</span> entries
                  </span>
                </div>
                
                {/* Mobile Pagination */}
                <div className="flex md:hidden justify-center gap-2">
                  <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="px-4 py-2.5 rounded-xl font-bold text-xs bg-white text-slate-700 border-2 border-slate-300 hover:bg-slate-50 active:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                  >
                    Prev
                  </button>
                  <div className="flex items-center px-4 py-2.5 rounded-xl bg-linear-to-r from-indigo-500 to-purple-600 text-white font-bold text-xs shadow-lg">
                    {page} / {totalPages}
                  </div>
                  <button
                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                    disabled={page === totalPages}
                    className="px-4 py-2.5 rounded-xl font-bold text-xs bg-white text-slate-700 border-2 border-slate-300 hover:bg-slate-50 active:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                  >
                    Next
                  </button>
                </div>

                {/* Desktop Pagination */}
                <div className="hidden md:flex gap-2">
                  <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="px-5 py-2.5 rounded-xl font-bold text-sm bg-white text-slate-700 border-2 border-slate-300 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md"
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
                            ? "bg-linear-to-r from-indigo-500 to-purple-600 text-white shadow-lg scale-105"
                            : "bg-white text-slate-700 border-2 border-slate-300 hover:bg-slate-50 shadow-sm hover:shadow-md"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                    disabled={page === totalPages}
                    className="px-5 py-2.5 rounded-xl font-bold text-sm bg-white text-slate-700 border-2 border-slate-300 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md"
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Enhanced Image Modal */}
      {imageModal.isOpen && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fadeIn"
          onClick={() => setImageModal({ isOpen: false, imageUrl: "", title: "" })}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[95vh] overflow-hidden animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 md:p-6 border-b-2 border-slate-200 bg-linear-to-r from-indigo-50 to-purple-50">
              <h3 className="text-lg md:text-xl font-bold text-slate-800 flex items-center gap-2">
                <FiEye className="text-indigo-600" />
                {imageModal.title}
              </h3>
              <button
                onClick={() => setImageModal({ isOpen: false, imageUrl: "", title: "" })}
                className="p-2 md:p-2.5 rounded-xl hover:bg-red-100 active:bg-red-200 transition-colors group"
              >
                <FiX size={24} className="text-slate-600 group-hover:text-red-600" />
              </button>
            </div>

            {/* Modal Body - Image */}
            <div className="p-6 md:p-8 flex items-center justify-center bg-slate-900 max-h-[65vh] md:max-h-[75vh] overflow-auto">
              <Image
                src={imageModal.imageUrl}
                alt={imageModal.title}
                className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
                loading="lazy"
              />
            </div>

            {/* Modal Footer */}
            <div className="p-5 md:p-6 border-t-2 border-slate-200 bg-linear-to-r from-slate-50 to-slate-100 flex flex-col sm:flex-row justify-between items-center gap-3">
              <p className="text-xs md:text-sm text-slate-600 font-semibold text-center sm:text-left">
                Press <kbd className="px-2 py-1 bg-slate-200 rounded text-xs font-mono">ESC</kbd> or click outside to close
              </p>
              <a
                href={imageModal.imageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-linear-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold px-5 py-2.5 rounded-xl transition-all shadow-lg hover:shadow-xl text-sm w-full sm:w-auto justify-center"
              >
                <FiEye size={16} />
                Open Original Image
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
