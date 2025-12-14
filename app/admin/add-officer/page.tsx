"use client";
import { useState, useEffect, JSX } from "react";
import { FiUserPlus, FiX, FiCheck, FiAlertCircle, FiInfo } from "react-icons/fi";

interface Station {
  id: number;
  station_name: string;
  station_id: string;
}

interface CustomField {
  id: number;
  field_name: string;
  field_label: string;
  field_type: string;
  field_options: string;
  is_required: boolean;
  value: string | File | null;
}

export default function AdminAddOfficerPage() {
  const [stations, setStations] = useState<Station[]>([]);
  const [selectedStation, setSelectedStation] = useState("");
  const [selectedStationName, setSelectedStationName] = useState("");
  const [customFields, setCustomFields] = useState<CustomField[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingFields, setFetchingFields] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchStations();
  }, []);

  useEffect(() => {
    if (selectedStation) {
      fetchStationFields(selectedStation);
    } else {
      setCustomFields([]);
    }
  }, [selectedStation]);

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

  const fetchStationFields = async (stationId: string) => {
    setFetchingFields(true);
    setError("");
    try {
      const response = await fetch(`/api/admin/station-fields/${stationId}`);
      const data = await response.json();
      
      if (data.success) {
        const fieldsWithValues = data.data.map((field: CustomField) => ({
          ...field,
          value: ''
        }));
        setCustomFields(fieldsWithValues);
      } else {
        setCustomFields([]);
      }
    } catch (err) {
      console.error('Error fetching fields:', err);
      setError("Failed to load form fields");
    } finally {
      setFetchingFields(false);
    }
  };

  const handleStationChange = (stationId: string) => {
    setSelectedStation(stationId);
    const station = stations.find(s => s.station_id === stationId);
    setSelectedStationName(station?.station_name || "");
    setSuccess("");
    setError("");
  };

  const updateFieldValue = (index: number, value: string | File | null ) => {
    const updated = [...customFields];
    updated[index].value = value;
    setCustomFields(updated);
  };

  const handleReset = () => {
    const reset = customFields.map(field => ({
      ...field,
      value: ''
    }));
    setCustomFields(reset);
    setSuccess("");
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedStation) {
      setError("Please select a station");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    const missingFields = customFields.filter(
      field => field.is_required && !field.value
    );

    if (missingFields.length > 0) {
      setError(`Please fill all required fields: ${missingFields.map(f => f.field_label).join(', ')}`);
      setLoading(false);
      return;
    }

    try {
      const customFieldsData: Record<string, unknown> = {};
      
      customFields.forEach(field => {
        customFieldsData[field.field_name] = field.value;
      });

      const submissionData = {
        station_id: selectedStation,
        custom_fields: customFieldsData,
      };

      const response = await fetch('/api/station/officers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(`Officer added successfully to ${selectedStationName}!`);
        
        setTimeout(() => {
          handleReset();
          setSuccess("");
        }, 2000);
      } else {
        setError(data.message || "Failed to add officer");
      }

    } catch (err) {
      console.error('Submit error:', err);
      setError("Failed to submit officer data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderFieldInput = (field: CustomField, index: number): JSX.Element | null => {
    const baseInputClass = "w-full border border-slate-300 rounded-xl px-4 py-3.5 text-base bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all shadow-sm hover:shadow-md";
    
    switch (field.field_type) {
      case 'text':
        return (
          <input
            type="text"
            value={field.value as string || ''}
            onChange={(e) => updateFieldValue(index, e.target.value)}
            placeholder={`Enter ${field.field_label.toLowerCase()}`}
            required={field.is_required}
            className={baseInputClass}
          />
        );

      case 'number':
        return (
          <input
            type="number"
            value={field.value as string || ''}
            onChange={(e) => updateFieldValue(index, e.target.value)}
            placeholder={`Enter ${field.field_label.toLowerCase()}`}
            required={field.is_required}
            className={baseInputClass}
          />
        );

      case 'date':
        return (
          <input
            type="date"
            value={field.value as string || ''}
            onChange={(e) => updateFieldValue(index, e.target.value)}
            required={field.is_required}
            className={baseInputClass}
          />
        );

      case 'select':
        const options = field.field_options ? field.field_options.split(',') : [];
        return (
          <select
            value={field.value as string || ''}
            onChange={(e) => updateFieldValue(index, e.target.value)}
            required={field.is_required}
            className={baseInputClass}
          >
            <option value="">Select {field.field_label}</option>
            {options.map((option, idx) => (
              <option key={idx} value={option.trim()}>
                {option.trim()}
              </option>
            ))}
          </select>
        );

      case 'textarea':
        return (
          <textarea
            value={field.value as string || ''}
            onChange={(e) => updateFieldValue(index, e.target.value)}
            placeholder={`Enter ${field.field_label.toLowerCase()}`}
            required={field.is_required}
            rows={4}
            className={baseInputClass}
          />
        );

      case 'file':
        return (
          <div>
            <input
              type="file"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  updateFieldValue(index, e.target.files[0]);
                }
              }}
              accept="image/*"
              required={field.is_required}
              className="w-full border border-slate-300 rounded-xl px-4 py-3.5 text-sm bg-white file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-bold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 active:file:bg-purple-200 transition-all shadow-sm hover:shadow-md cursor-pointer"
              key={field.value ? 'has-file' : 'no-file'}
            />
            {field.value && typeof field.value === 'object' && field.value !== null && 'name' in field.value && (
  <p className="text-xs text-green-600 mt-2 flex items-center gap-2">
    <FiCheck size={14} />
    Selected: {(field.value as File).name}
  </p>
)}

          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white p-4 md:p-8 lg:p-12 pb-24 md:pb-12">
      <div className="md:max-w-full md:mx-auto">
        {/* Enhanced Header Section */}
        <div className="mb-8 md:mb-12 bg-linear-to-r from-purple-50 to-pink-50 rounded-2xl shadow-sm p-5 md:p-8 border border-purple-100">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-linear-to-br from-purple-500 to-pink-600 shadow-lg">
              <FiUserPlus className="w-7 h-7 md:w-8 md:h-8 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl md:text-4xl font-bold text-slate-800 tracking-tight mb-1">
                Add Officer (Admin)
              </h1>
              <p className="text-slate-600 text-xs md:text-base flex items-center gap-2">
                <span className="inline-block w-2 h-2 bg-purple-500 rounded-full"></span>
                Select a station and fill in officer details
              </p>
            </div>
          </div>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="mb-6 md:mb-8 p-4 md:p-5 bg-green-50 border-l-4 border-green-500 rounded-xl shadow-md flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <FiCheck className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
              <p className="text-sm md:text-base text-green-700 font-semibold">{success}</p>
            </div>
            <button
              onClick={() => setSuccess("")}
              className="text-green-700 hover:text-green-900 p-1.5 hover:bg-green-100 rounded-lg transition-colors"
            >
              <FiX size={20} />
            </button>
          </div>
        )}

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

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 md:gap-8">
          {/* Left Sidebar - Station Selection & Info */}
          <div className="lg:col-span-1 space-y-6 md:space-y-8">
            {/* Station Selection Card */}
            <div className="bg-linear-to-br from-purple-50 to-pink-50 shadow-lg rounded-2xl p-5 md:p-6 border-2 border-purple-200">
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
                className="w-full border-2 border-purple-300 rounded-xl px-4 py-3.5 bg-white text-slate-800 text-sm md:text-base font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all shadow-sm hover:shadow-md"
              >
                <option value="">Select a station...</option>
                {stations.map((station) => (
                  <option key={station.id} value={station.station_id}>
                    {station.station_name}
                  </option>
                ))}
              </select>
              {selectedStation && (
                <div className="mt-4 p-3 bg-white rounded-lg shadow-sm border border-purple-200">
                  <p className="text-xs text-slate-500 mb-1">Currently Adding To:</p>
                  <p className="text-sm font-bold text-purple-700">{selectedStationName}</p>
                </div>
              )}
            </div>

            {/* Instructions */}
            <div className="bg-white rounded-2xl shadow-lg p-5 md:p-6 border border-slate-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                  <FiInfo className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-base md:text-lg font-bold text-slate-800">Instructions</h3>
              </div>
              <ul className="space-y-2.5 text-xs md:text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 mt-1">•</span>
                  <span className="font-medium">Select a station from the dropdown above</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 mt-1">•</span>
                  <span className="font-medium">Fill in all required fields marked with *</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 mt-1">•</span>
                  <span className="font-medium">Review all information before submitting</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 mt-1">•</span>
                  <span className="font-medium">Use Reset to clear all fields</span>
                </li>
              </ul>
            </div>

            {/* Field Count */}
            {selectedStation && customFields.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-5 md:p-6 border border-slate-200">
                <h3 className="text-base md:text-lg font-bold text-slate-800 mb-4">Form Statistics</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <span className="text-xs font-semibold text-slate-700">Total Fields</span>
                    <span className="text-xl font-bold text-purple-600">{customFields.length}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg border border-red-200">
                    <span className="text-xs font-semibold text-slate-700">Required</span>
                    <span className="text-xl font-bold text-red-600">
                      {customFields.filter(f => f.is_required).length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <span className="text-xs font-semibold text-slate-700">Optional</span>
                    <span className="text-xl font-bold text-blue-600">
                      {customFields.filter(f => !f.is_required).length}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Main Content - Form */}
          <div className="lg:col-span-3">
            {selectedStation ? (
              fetchingFields ? (
                <div className="bg-white shadow-lg rounded-2xl p-12 md:p-20 border border-slate-200 text-center">
                  <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600 mb-5"></div>
                  <p className="text-slate-600 text-base font-semibold">Loading form fields...</p>
                </div>
              ) : customFields.length === 0 ? (
                <div className="bg-white shadow-lg rounded-2xl p-12 md:p-20 border border-slate-200 text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-full bg-linear-to-br from-orange-100 to-orange-200 mb-6">
                    <FiAlertCircle className="w-10 h-10 md:w-12 md:h-12 text-orange-600" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-slate-700 mb-3">No Form Fields Configured</h3>
                  <p className="text-slate-500 text-sm md:text-base max-w-md mx-auto">
                    Please configure input fields for <strong>{selectedStationName}</strong> in the Station Fields management section first.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-2xl p-5 md:p-10 border border-slate-200">
                  {/* Form Header */}
                  <div className="flex items-center gap-4 mb-8 pb-6 border-b-2 border-slate-100">
                    <div className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-xl bg-linear-to-br from-purple-500 to-pink-600 shadow-md">
                      <svg className="w-6 h-6 md:w-7 md:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-lg md:text-2xl font-bold text-slate-800">
                        Officer Information
                      </h2>
                      <p className="text-xs md:text-sm text-slate-500 mt-0.5">
                        {selectedStationName} - Fields marked with * are required
                      </p>
                    </div>
                  </div>

                  {/* Dynamic Fields Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    {customFields.map((field, index) => (
                      <div key={field.id} className={field.field_type === 'textarea' || field.field_type === 'file' ? 'md:col-span-2' : ''}>
                        <label className="block text-sm md:text-base font-bold text-slate-700 mb-3">
                          {field.field_label}
                          {field.is_required && <span className="text-red-500 ml-1">*</span>}
                        </label>
                        {renderFieldInput(field, index)}
                      </div>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mt-8 md:mt-12 pt-8 border-t-2 border-slate-100">
                    <button
                      type="submit"
                      disabled={loading}
                      className={`${
                        loading
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-linear-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 active:scale-98 shadow-lg hover:shadow-xl'
                      } text-white font-bold px-8 md:px-10 py-4 md:py-3.5 rounded-xl transition-all text-sm md:text-base flex items-center justify-center gap-2`}
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                          Saving Officer...
                        </>
                      ) : (
                        <>
                          <FiCheck size={20} />
                          Save Officer
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={handleReset}
                      disabled={loading}
                      className="bg-slate-100 text-slate-700 font-bold px-8 md:px-10 py-4 md:py-3.5 rounded-xl hover:bg-slate-200 active:bg-slate-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base shadow-sm hover:shadow-md flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Reset Form
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedStation("");
                        setSelectedStationName("");
                        setCustomFields([]);
                      }}
                      className="bg-white border-2 border-slate-300 text-slate-700 font-bold px-8 md:px-10 py-4 md:py-3.5 rounded-xl hover:bg-slate-50 active:bg-slate-100 transition-all text-sm md:text-base shadow-sm hover:shadow-md flex items-center justify-center gap-2"
                    >
                      <FiX size={20} />
                      Cancel
                    </button>
                  </div>
                </form>
              )
            ) : (
              <div className="bg-white shadow-lg rounded-2xl p-10 md:p-20 border border-slate-200 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-full bg-linear-to-br from-purple-100 to-pink-100 mb-6">
                  <svg className="w-10 h-10 md:w-12 md:h-12 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-slate-700 mb-3">Select a Station First</h3>
                <p className="text-slate-500 text-sm md:text-base px-4 max-w-md mx-auto">
                  Choose a police station from the sidebar to start adding an officer to that station
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
