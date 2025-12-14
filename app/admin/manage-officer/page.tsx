"use client";
import { useState, useEffect } from "react";
import { FiSearch, FiEdit2, FiTrash2, FiEye, FiUser, FiCheck, FiX, FiDownload, FiFilter, FiAlertCircle, FiUsers } from "react-icons/fi";

import JSZip from "jszip"
import { saveAs } from 'file-saver'
import * as XLSX from 'xlsx'
import Image from "next/image";

interface Station {
  id: number;
  station_name: string;
  station_id: string;
}

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

export default function AdminManageOfficersPage() {
  const [stations, setStations] = useState<Station[]>([]);
  const [selectedStation, setSelectedStation] = useState("");
  const [selectedStationName, setSelectedStationName] = useState("");
  const [officers, setOfficers] = useState<Officer[]>([]);
  const [customFields, setCustomFields] = useState<CustomField[]>([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<number[]>([]);
  const [page, setPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
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
    fetchStations();
  }, []);

  useEffect(() => {
    if (selectedStation) {
      fetchCustomFields(selectedStation);
      fetchOfficers(selectedStation);
    } else {
      setCustomFields([]);
      setOfficers([]);
    }
  }, [selectedStation]);

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

  const fetchStations = async () => {
    try {
      const response = await fetch('/api/admin/stations');
      const data = await response.json();
      if (data.success) {
        setStations(data.data);
      }
    } catch (err) {
      console.error('Error fetching stations:', err);
      setError("Failed to load stations");
    }
  };

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

  const handleStationChange = (stationId: string) => {
    setSelectedStation(stationId);
    const station = stations.find(s => s.station_id === stationId);
    setSelectedStationName(station?.station_name || "");
    setSearch("");
    setSelected([]);
    setPage(1);
    setError("");
    setSuccessMessage("");
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

  const getFieldValue = (officer: Officer, fieldName: string, fieldType: string, fieldLabel: string): React.ReactNode => {
    if (!officer.custom_fields) return 'N/A';
    const value = officer.custom_fields[fieldName];
    
    // If it's a file/image field
    if (fieldType === 'file') {
      if (typeof value === 'string' && value && (value.includes('cloudinary') || value.includes('http'))) {
        return (
          <button
            onClick={() => setImageModal({
              isOpen: true,
              imageUrl: value,
              title: fieldLabel,
            })}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-green-50 text-green-700 hover:bg-green-100 active:bg-green-200 transition-colors shadow-sm hover:shadow-md"
            title="Click to view image"
          >
            <FiCheck size={16} />
            <span className="text-xs font-bold">View Image</span>
          </button>
        );
      } else {
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-50 text-red-700 shadow-sm">
            <FiX size={16} />
            <span className="text-xs font-bold">Missing</span>
          </span>
        );
      }
    }
    
    return value ? String(value) : 'N/A';
  };

  // Get displayable fields (limit to 6 columns for better table layout)
  const displayFields = customFields.slice(0, 6);
  
  const handleExportData = async () => {
    if (paginated.length === 0) {
      setError("No officers to export");
      return;
    }

    try {
      setLoading(true);
      const zip = new JSZip();
      const imagesFolder = zip.folder("images");

      const excelData: Record<string, string | number>[] = [];
      const imagePromises: Promise<void>[] = [];

      paginated.forEach((officer, idx) => {
        if (!officer.custom_fields) return;

        const rowData: Record<string, string | number> = {
          "Sr No": (page - 1) * entriesPerPage + idx + 1,
        };

        displayFields.forEach((field) => {
          const value = officer.custom_fields[field.field_name];

          if (field.field_type === "file" && value) {
            const fileName = `${field.field_name}_${officer.id}.jpg`;
            rowData[field.field_label] = `images/${fileName}`;

            if (imagesFolder) {
              imagePromises.push(
                downloadImageToZip(imagesFolder, String(value), fileName)
              );
            }
          } else {
            rowData[field.field_label] = value ? String(value) : "";
          }
        });

        rowData["Added On"] = formatDate(officer.created_at);
        excelData.push(rowData);
      });

      await Promise.all(imagePromises);

      const worksheet = XLSX.utils.json_to_sheet(excelData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        selectedStationName || "Officers"
      );
      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });

      zip.file(
        `${selectedStationName || "Officers"}_Data.xlsx`,
        excelBuffer
      );

      const zipBlob = await zip.generateAsync({ type: "blob" });
      saveAs(
        zipBlob,
        `${selectedStationName || "Station"}_Officers_${new Date()
          .toISOString()
          .slice(0, 10)}.zip`
      );

      setSuccessMessage("Data exported successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Export error:", err);
      setError("Failed to export data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const downloadImageToZip = async (
    folder: JSZip,
    imageUrl: string,
    fileName: string
  ): Promise<void> => {
    try {
      const res = await fetch(imageUrl);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const blob = await res.blob();
      folder.file(fileName, blob);
    } catch (e) {
      console.error("Failed to download image:", fileName, e);
    }
  };

  return (
    <div className="min-h-screen bg-white p-4 md:p-8 lg:p-12 pb-24 md:pb-12">
      <div className="md:max-w-full md:mx-auto">
        {/* Enhanced Header Section */}
        <div className="mb-8 md:mb-12 bg-linear-to-r from-purple-50 to-pink-50 rounded-2xl shadow-sm p-5 md:p-8 border border-purple-100">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-linear-to-br from-purple-500 to-pink-600 shadow-lg">
              <FiUsers className="w-7 h-7 md:w-8 md:h-8 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl md:text-4xl font-bold text-slate-800 tracking-tight mb-1">
                Manage Officers
              </h1>
              <p className="text-slate-600 text-xs md:text-base flex items-center gap-2">
                <span className="inline-block w-2 h-2 bg-purple-500 rounded-full"></span>
                View, edit, and manage all police officer records
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        {selectedStation && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
            <div className="bg-white rounded-2xl p-4 md:p-5 border border-slate-200 shadow-md hover:shadow-lg transition-shadow">
              <p className="text-xs md:text-sm text-slate-500 font-semibold mb-1">Total Officers</p>
              <p className="text-2xl md:text-3xl font-bold text-purple-600">{officers.length}</p>
            </div>
            <div className="bg-white rounded-2xl p-4 md:p-5 border border-slate-200 shadow-md hover:shadow-lg transition-shadow">
              <p className="text-xs md:text-sm text-slate-500 font-semibold mb-1">Filtered</p>
              <p className="text-2xl md:text-3xl font-bold text-blue-600">{filteredOfficers.length}</p>
            </div>
            <div className="bg-white rounded-2xl p-4 md:p-5 border border-slate-200 shadow-md hover:shadow-lg transition-shadow">
              <p className="text-xs md:text-sm text-slate-500 font-semibold mb-1">Selected</p>
              <p className="text-2xl md:text-3xl font-bold text-orange-600">{selected.length}</p>
            </div>
            <div className="bg-white rounded-2xl p-4 md:p-5 border border-slate-200 shadow-md hover:shadow-lg transition-shadow">
              <p className="text-xs md:text-sm text-slate-500 font-semibold mb-1">Data Fields</p>
              <p className="text-2xl md:text-3xl font-bold text-green-600">{customFields.length}</p>
            </div>
          </div>
        )}

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 md:mb-8 p-4 md:p-5 bg-green-50 border-l-4 border-green-500 rounded-xl shadow-md flex items-center justify-between">
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
          <div className="mb-6 md:mb-8 p-4 md:p-5 bg-red-50 border-l-4 border-red-500 rounded-xl shadow-md flex items-center justify-between">
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

        {/* Station Selection Card */}
        <div className="bg-linear-to-br from-purple-50 to-pink-50 shadow-lg rounded-2xl p-5 md:p-6 border-2 border-purple-200 mb-6 md:mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-base md:text-lg font-bold text-slate-800">Select Station</h3>
          </div>
          <label className="block text-xs md:text-sm font-bold text-slate-700 mb-3">
            Choose Station <span className="text-red-500">*</span>
          </label>
          <select
            value={selectedStation}
            onChange={(e) => handleStationChange(e.target.value)}
            className="w-full border-2 border-purple-300 rounded-xl px-4 py-3.5 text-sm md:text-base bg-white text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all shadow-sm hover:shadow-md"
          >
            <option value="">Choose a station to view officers...</option>
            {stations.map((station) => (
              <option key={station.id} value={station.station_id}>
                {station.station_name} ({station.station_id})
              </option>
            ))}
          </select>
          {selectedStation && (
            <div className="mt-4 p-3 bg-white rounded-lg shadow-sm border border-purple-200">
              <p className="text-xs text-slate-500 mb-1">Currently Viewing:</p>
              <p className="text-sm font-bold text-purple-700">{selectedStationName}</p>
            </div>
          )}
        </div>

        {/* Main Content Card */}
        {selectedStation && (
          <div className="bg-white shadow-lg rounded-2xl border-2 border-slate-200">
            {/* Action Bar */}
            <div className="p-5 md:p-8 border-b-2 border-slate-100">
              <div className="flex flex-col gap-4 md:gap-5">
                {/* Search Bar */}
                <div className="relative w-full">
                  <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search by name, badge number, or any field..."
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
                <div className="flex items-center justify-between gap-3 flex-wrap">
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

                    {/* Export Button */}
                    <button
                      onClick={handleExportData}
                      disabled={loading || paginated.length === 0}
                      className="inline-flex items-center gap-2 bg-linear-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 active:scale-95 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold px-5 py-2.5 rounded-xl text-sm md:text-base transition-all shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
                    >
                      <FiDownload size={18} />
                      <span className="hidden sm:inline">Export Data</span>
                      <span className="sm:hidden">Export</span>
                    </button>
                  </div>

                  {/* Right: Bulk Delete */}
                  {selected.length > 0 && (
                    <button 
                      onClick={handleBulkDelete}
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
            {loading ? (
              <div className="p-12 md:p-20 text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-200 border-t-purple-600 mb-5"></div>
                <p className="text-slate-600 text-base font-semibold">Loading officers...</p>
              </div>
            ) : customFields.length === 0 ? (
              <div className="p-12 md:p-20 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-full bg-linear-to-br from-orange-100 to-orange-200 mb-6">
                  <FiAlertCircle className="w-10 h-10 md:w-12 md:h-12 text-orange-600" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-slate-700 mb-3">No Fields Configured</h3>
                <p className="text-slate-500 text-sm md:text-base max-w-md mx-auto">
                  Please configure custom fields for <strong>{selectedStationName}</strong> in the Station Fields management section first.
                </p>
              </div>
            ) : (
              <>
                {/* Mobile Card View */}
                <div className="md:hidden divide-y divide-slate-200">
                  {paginated.length === 0 ? (
                    <div className="p-12 text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
                        <FiUser className="w-8 h-8 text-slate-400" />
                      </div>
                      <p className="text-slate-500 text-sm font-semibold">
                        {search ? 'No officers found matching your search' : 'No officers added yet'}
                      </p>
                    </div>
                  ) : (
                    paginated.map((officer, idx) => (
                      <div key={officer.id} className="p-4 hover:bg-slate-50 active:bg-slate-100 transition-colors">
                        {/* Card Header */}
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              checked={selected.includes(officer.id)}
                              onChange={() => handleSelect(officer.id)}
                              className="w-5 h-5 accent-purple-500 rounded"
                            />
                            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-md">
                              <FiUser className="w-5 h-5 text-white" />
                            </div>
                          </div>
                          <span className="text-xs text-purple-600 font-bold bg-purple-50 px-2 py-1 rounded-lg">
                            #{(page - 1) * entriesPerPage + idx + 1}
                          </span>
                        </div>

                        {/* Card Content - Show all fields */}
                        <div className="space-y-2.5 mb-3 pl-2">
                          {displayFields.map((field) => (
                            <div key={field.id} className="flex justify-between items-start gap-2">
                              <span className="text-xs font-bold text-slate-600 min-w-[100px]">{field.field_label}:</span>
                              <span className="text-xs text-slate-800 font-medium text-right flex-1 wrap-break-words">
                                {getFieldValue(officer, field.field_name, field.field_type, field.field_label)}
                              </span>
                            </div>
                          ))}
                          <div className="flex justify-between items-center gap-2 pt-2 border-t border-slate-100">
                            <span className="text-xs font-bold text-slate-600">Added On:</span>
                            <span className="text-xs font-semibold text-slate-700">{formatDate(officer.created_at)}</span>
                          </div>
                        </div>

                        {/* Card Actions */}
                        <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100">
                          <button
                            onClick={() => handleViewDetails(officer.id)}
                            className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 active:bg-blue-200 transition-colors shadow-sm"
                          >
                            <FiEye size={18} />
                            <span className="text-[10px] font-bold">View</span>
                          </button>
                          <button
                            onClick={() => handleEdit(officer.id)}
                            className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl bg-green-50 text-green-600 hover:bg-green-100 active:bg-green-200 transition-colors shadow-sm"
                          >
                            <FiEdit2 size={18} />
                            <span className="text-[10px] font-bold">Edit</span>
                          </button>
                          <button
                            onClick={() => handleDelete(officer.id)}
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
                            checked={paginated.length > 0 && paginated.every((o) => selected.includes(o.id))}
                            onChange={(e) => handleSelectAll(e.target.checked)}
                            className="w-5 h-5 accent-purple-500 rounded cursor-pointer"
                          />
                        </th>
                        <th className="px-6 py-5 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                          Sr No
                        </th>
                        {displayFields.map((field) => (
                          <th 
                            key={field.id}
                            className="px-6 py-5 text-left text-xs font-bold text-slate-600 uppercase tracking-wider"
                          >
                            {field.field_label}
                          </th>
                        ))}
                        <th className="px-6 py-5 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                          Added On
                        </th>
                        <th className="px-6 py-5 text-center text-xs font-bold text-slate-600 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                      {paginated.length === 0 ? (
                        <tr>
                          <td colSpan={displayFields.length + 4} className="px-6 py-16 text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
                              <FiUser className="w-8 h-8 text-slate-400" />
                            </div>
                            <p className="text-slate-500 text-base font-semibold">
                              {search ? 'No officers found matching your search' : 'No officers added yet'}
                            </p>
                          </td>
                        </tr>
                      ) : (
                        paginated.map((officer, idx) => (
                          <tr key={officer.id} className="hover:bg-purple-50/30 transition-colors">
                            <td className="px-6 py-5 whitespace-nowrap">
                              <input
                                type="checkbox"
                                checked={selected.includes(officer.id)}
                                onChange={() => handleSelect(officer.id)}
                                className="w-5 h-5 accent-purple-500 rounded cursor-pointer"
                              />
                            </td>
                            <td className="px-6 py-5 whitespace-nowrap">
                              <span className="text-sm font-bold text-purple-600 bg-purple-50 px-3 py-1.5 rounded-lg">
                                #{(page - 1) * entriesPerPage + idx + 1}
                              </span>
                            </td>
                            {displayFields.map((field) => (
                              <td 
                                key={field.id}
                                className="px-6 py-5 whitespace-nowrap text-sm font-semibold text-slate-700"
                              >
                                {getFieldValue(officer, field.field_name, field.field_type, field.field_label)}
                              </td>
                            ))}
                            <td className="px-6 py-5 whitespace-nowrap text-sm font-semibold text-slate-600">
                              {formatDate(officer.created_at)}
                            </td>
                            <td className="px-6 py-5 whitespace-nowrap">
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  onClick={() => handleViewDetails(officer.id)}
                                  className="p-2.5 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 active:bg-blue-200 transition-all shadow-sm hover:shadow-md"
                                  title="View Details"
                                >
                                  <FiEye size={18} />
                                </button>
                                <button
                                  onClick={() => handleEdit(officer.id)}
                                  className="p-2.5 rounded-xl bg-green-50 text-green-600 hover:bg-green-100 active:bg-green-200 transition-all shadow-sm hover:shadow-md"
                                  title="Edit Officer"
                                >
                                  <FiEdit2 size={18} />
                                </button>
                                <button
                                  onClick={() => handleDelete(officer.id)}
                                  className="p-2.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 active:bg-red-200 transition-all shadow-sm hover:shadow-md"
                                  title="Delete Officer"
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
                    <span className="text-purple-600">{filteredOfficers.length}</span> entries
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
        )}

        {/* No Station Selected State */}
        {!selectedStation && (
          <div className="bg-white shadow-lg rounded-2xl p-10 md:p-20 border border-slate-200 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-full bg-linear-to-br from-purple-100 to-pink-100 mb-6">
              <svg className="w-10 h-10 md:w-12 md:h-12 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-slate-700 mb-3">Select a Station First</h3>
            <p className="text-slate-500 text-sm md:text-base px-4 max-w-md mx-auto">
              Choose a police station from the dropdown above to view and manage officers
            </p>
          </div>
        )}

        {/* Image Modal */}
        {imageModal.isOpen && (
          <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setImageModal({ isOpen: false, imageUrl: "", title: "" })}
          >
            <div 
              className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-4 md:p-6 border-b-2 border-slate-100 bg-linear-to-r from-slate-50 to-slate-100">
                <h3 className="text-base md:text-xl font-bold text-slate-800">
                  {imageModal.title}
                </h3>
                <button
                  onClick={() => setImageModal({ isOpen: false, imageUrl: "", title: "" })}
                  className="p-2 md:p-2.5 rounded-xl hover:bg-slate-200 active:bg-slate-300 transition-colors"
                >
                  <FiX size={24} className="text-slate-600" />
                </button>
              </div>

              {/* Modal Body - Image */}
              <div className="p-6 md:p-8 flex items-center justify-center bg-slate-100 max-h-[60vh] md:max-h-[70vh] overflow-auto">
                <Image
                  src={imageModal.imageUrl}
                  alt={imageModal.title}
                  width={1200}
                  height={800}
                  className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
                  loading="lazy"
                />
              </div>

              {/* Modal Footer */}
              <div className="p-4 md:p-6 border-t-2 border-slate-100 bg-linear-to-r from-slate-50 to-slate-100 flex justify-between items-center">
                <p className="text-xs md:text-sm text-slate-600 font-semibold">
                  <span className="hidden sm:inline">Click outside or press ESC to close</span>
                  <span className="sm:hidden">Tap outside to close</span>
                </p>
                <a
                  href={imageModal.imageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-linear-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 active:scale-95 text-white font-bold px-5 py-2.5 md:py-3 rounded-xl transition-all text-xs md:text-sm shadow-lg hover:shadow-xl"
                >
                  <FiEye size={18} />
                  <span className="hidden sm:inline">Open Original</span>
                  <span className="sm:hidden">Open</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
