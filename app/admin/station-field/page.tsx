"use client";
import { useState, useEffect } from "react";
import { FiPlus, FiTrash2, FiSave, FiX, FiSettings, FiAlertCircle, FiCheckCircle } from "react-icons/fi";

interface Station {
  id: number;
  station_name: string;
  station_id: string;
}

interface CustomField {
  id?: number;
  field_label: string;
  field_type: string;
  field_options: string;
  is_required: boolean;
  field_order: number;
}

export default function ManageStationFieldsPage() {
  const [stations, setStations] = useState<Station[]>([]);
  const [selectedStation, setSelectedStation] = useState("");
  const [selectedStationName, setSelectedStationName] = useState("");
  const [customFields, setCustomFields] = useState<CustomField[]>([]);
  const [loading, setLoading] = useState(false);
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
    }
  };

  const fetchStationFields = async (stationId: string) => {
    try {
      const response = await fetch(`/api/admin/station-fields/${stationId}`);
      const data = await response.json();
      if (data.success) {
        setCustomFields(data.data || []);
      }
    } catch (err) {
      console.error('Error fetching fields:', err);
      setCustomFields([]);
    }
  };

  const handleStationChange = (stationId: string) => {
    setSelectedStation(stationId);
    const station = stations.find(s => s.station_id === stationId);
    setSelectedStationName(station?.station_name || "");
    setSuccess("");
    setError("");
  };

  const addCustomField = () => {
    setCustomFields([
      ...customFields,
      {
        field_label: "",
        field_type: "text",
        field_options: "",
        is_required: false,
        field_order: customFields.length,
      },
    ]);
  };

  const updateCustomField = (index: number, key: keyof CustomField, value: unknown) => {
    const updated = [...customFields];
    updated[index] = { ...updated[index], [key]: value };
    setCustomFields(updated);
  };

  const removeCustomField = (index: number) => {
    setCustomFields(customFields.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!selectedStation) {
      setError("Please select a station");
      return;
    }

    const invalidFields = customFields.filter(f => !f.field_label.trim());
    if (invalidFields.length > 0) {
      setError("All fields must have a label");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`/api/admin/station-fields/${selectedStation}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fields: customFields }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(`Fields saved successfully for ${selectedStationName}`);
        fetchStationFields(selectedStation);
      } else {
        setError(data.message);
      }
    } catch {
      setError("Failed to save fields");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white p-4 md:p-8 lg:p-12 pb-24 md:pb-12">
      <div className="md:max-w-full md:mx-auto">
        {/* Enhanced Header Section */}
        <div className="mb-8 md:mb-12 bg-linear-to-r from-purple-50 to-pink-50 rounded-2xl shadow-sm p-5 md:p-8 border border-purple-100">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-linear-to-br from-purple-500 to-pink-600 shadow-lg">
              <FiSettings className="w-7 h-7 md:w-8 md:h-8 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl md:text-4xl font-bold text-slate-800 tracking-tight mb-1">
                Manage Station Fields
              </h1>
              <p className="text-slate-600 text-xs md:text-base flex items-center gap-2">
                <span className="inline-block w-2 h-2 bg-purple-500 rounded-full"></span>
                Configure custom input fields for each police station
              </p>
            </div>
          </div>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="mb-6 md:mb-8 p-4 md:p-5 bg-green-50 border-l-4 border-green-500 rounded-xl shadow-md flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <FiCheckCircle className="w-5 h-5 text-white" strokeWidth={2.5} />
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
                  <p className="text-xs text-slate-500 mb-1">Currently Editing:</p>
                  <p className="text-sm font-bold text-purple-700">{selectedStationName}</p>
                </div>
              )}
            </div>

            {/* Field Types Info */}
            <div className="bg-white rounded-2xl shadow-lg p-5 md:p-6 border border-slate-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                  <FiAlertCircle className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-base md:text-lg font-bold text-slate-800">Field Types</h3>
              </div>
              <ul className="space-y-2.5 text-xs md:text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span className="font-medium"><strong>Text:</strong> Single-line input</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span className="font-medium"><strong>Number:</strong> Numeric values only</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span className="font-medium"><strong>Date:</strong> Date picker</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span className="font-medium"><strong>Dropdown:</strong> Select from options</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span className="font-medium"><strong>Textarea:</strong> Multi-line text</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span className="font-medium"><strong>File:</strong> Document upload</span>
                </li>
              </ul>
            </div>

            {/* Stats Card */}
            {selectedStation && (
              <div className="bg-white rounded-2xl shadow-lg p-5 md:p-6 border border-slate-200">
                <h3 className="text-base md:text-lg font-bold text-slate-800 mb-4">Statistics</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <span className="text-xs font-semibold text-slate-700">Total Fields</span>
                    <span className="text-xl font-bold text-purple-600">{customFields.length}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-200">
                    <span className="text-xs font-semibold text-slate-700">Required</span>
                    <span className="text-xl font-bold text-green-600">
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

          {/* Main Content - Takes 3 columns */}
          <div className="lg:col-span-3">
            {selectedStation ? (
              <div className="bg-white shadow-lg rounded-2xl p-5 md:p-10 border border-slate-200">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8 pb-6 border-b-2 border-slate-100">
                  <div>
                    <h2 className="text-lg md:text-2xl font-bold text-slate-800 mb-1">Input Fields Configuration</h2>
                    <p className="text-xs md:text-sm text-slate-500">
                      These fields will appear in the Add Officer form
                    </p>
                  </div>
                  <button
                    onClick={addCustomField}
                    className="inline-flex items-center justify-center gap-2 bg-linear-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 active:scale-95 text-white font-bold px-6 py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all text-sm md:text-base"
                  >
                    <FiPlus size={20} />
                    Add New Field
                  </button>
                </div>

                {/* Fields List */}
                {customFields.length === 0 ? (
                  <div className="text-center py-16 md:py-20 border-2 border-dashed border-slate-200 rounded-2xl bg-linear-to-br from-slate-50 to-slate-100">
                    <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full bg-purple-100 mb-5">
                      <FiPlus className="w-8 h-8 md:w-10 md:h-10 text-purple-500" />
                    </div>
                    <h3 className="text-base md:text-xl font-bold text-slate-700 mb-2">No Fields Configured</h3>
                    <p className="text-slate-500 text-xs md:text-sm mb-6 px-4 max-w-md mx-auto">
                      Click &quot;Add New Field&quot; to create custom input fields for {selectedStationName}
                    </p>
                    <button
                      onClick={addCustomField}
                      className="inline-flex items-center gap-2 bg-linear-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-bold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all"
                    >
                      <FiPlus size={18} />
                      Create First Field
                    </button>
                  </div>
                ) : (
                  <div className="space-y-5 md:space-y-6">
                    {customFields.map((field, index) => (
                      <div
                        key={index}
                        className="border-2 border-slate-200 rounded-2xl p-5 md:p-6 bg-linear-to-br from-white to-slate-50 hover:border-purple-300 hover:shadow-lg transition-all"
                      >
                        <div className="flex items-center justify-between mb-5">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-xl bg-linear-to-br from-purple-500 to-pink-600 text-white font-bold text-sm md:text-base shadow-md">
                              {index + 1}
                            </div>
                            <div>
                              <h4 className="text-sm md:text-base font-bold text-slate-800">
                                Field #{index + 1}
                              </h4>
                              <p className="text-xs text-slate-500">Configuration</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeCustomField(index)}
                            className="p-2.5 md:p-3 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 active:bg-red-200 transition-all shadow-sm hover:shadow-md"
                            title="Remove field"
                          >
                            <FiTrash2 size={18} />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                          {/* Field Label */}
                          <div className="md:col-span-2">
                            <label className="block text-xs md:text-sm font-bold text-slate-700 mb-2">
                              Field Label <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={field.field_label}
                              onChange={(e) => updateCustomField(index, 'field_label', e.target.value)}
                              placeholder="e.g., Officer Name, Badge Number, Department"
                              className="w-full border border-slate-300 rounded-xl px-4 py-3.5 text-sm md:text-base bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all shadow-sm hover:shadow-md"
                              required
                            />
                          </div>

                          {/* Field Type */}
                          <div>
                            <label className="block text-xs md:text-sm font-bold text-slate-700 mb-2">
                              Field Type <span className="text-red-500">*</span>
                            </label>
                            <select
                              value={field.field_type}
                              onChange={(e) => updateCustomField(index, 'field_type', e.target.value)}
                              className="w-full border border-slate-300 rounded-xl px-4 py-3.5 text-sm md:text-base bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all shadow-sm hover:shadow-md"
                            >
                              <option value="text">Text Input</option>
                              <option value="number">Number Input</option>
                              <option value="date">Date Picker</option>
                              <option value="select">Dropdown Select</option>
                              <option value="textarea">Text Area</option>
                              <option value="file">File Upload</option>
                            </select>
                          </div>

                          {/* Required Checkbox */}
                          <div>
                            <label className="block text-xs md:text-sm font-bold text-slate-700 mb-2">
                              Field Settings
                            </label>
                            <label className="flex items-center gap-3 p-4 bg-purple-50 border-2 border-purple-200 rounded-xl hover:bg-purple-100 transition-colors cursor-pointer">
                              <input
                                type="checkbox"
                                checked={field.is_required}
                                onChange={(e) => updateCustomField(index, 'is_required', e.target.checked)}
                                className="w-5 h-5 accent-purple-500 rounded"
                              />
                              <span className="text-sm md:text-base text-slate-700 font-semibold">Required Field</span>
                            </label>
                          </div>

                          {/* Options (Full Width for dropdown) */}
                          {field.field_type === 'select' && (
                            <div className="md:col-span-2">
                              <label className="block text-xs md:text-sm font-bold text-slate-700 mb-2">
                                Dropdown Options <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                value={field.field_options}
                                onChange={(e) => updateCustomField(index, 'field_options', e.target.value)}
                                placeholder="Option 1, Option 2, Option 3"
                                className="w-full border border-slate-300 rounded-xl px-4 py-3.5 text-sm md:text-base bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all shadow-sm hover:shadow-md"
                              />
                              <p className="text-xs md:text-sm text-slate-500 mt-2 flex items-center gap-2">
                                <FiAlertCircle size={14} />
                                Separate each option with a comma
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Save Button */}
                {customFields.length > 0 && (
                  <div className="mt-8 md:mt-12 pt-8 border-t-2 border-slate-100 flex flex-col sm:flex-row justify-end gap-3 md:gap-4">
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Remove all ${customFields.length} fields for ${selectedStationName}?`)) {
                          setCustomFields([]);
                        }
                      }}
                      className="bg-slate-100 text-slate-700 font-bold px-8 md:px-10 py-4 md:py-3.5 rounded-xl hover:bg-slate-200 active:bg-slate-300 transition-all text-sm md:text-base shadow-sm hover:shadow-md flex items-center justify-center gap-2"
                    >
                      <FiTrash2 size={20} />
                      Clear All Fields
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={loading}
                      className={`inline-flex items-center justify-center gap-2 ${
                        loading
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-linear-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 active:scale-98 shadow-lg hover:shadow-xl'
                      } text-white font-bold px-8 md:px-10 py-4 md:py-3.5 rounded-xl transition-all text-sm md:text-base`}
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                          Saving Changes...
                        </>
                      ) : (
                        <>
                          <FiSave size={20} />
                          Save Configuration
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white shadow-lg rounded-2xl p-10 md:p-16 border border-slate-200 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-full bg-linear-to-br from-purple-100 to-pink-100 mb-6">
                  <svg className="w-10 h-10 md:w-12 md:h-12 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-slate-700 mb-3">No Station Selected</h3>
                <p className="text-slate-500 text-sm md:text-base px-4 max-w-md mx-auto">
                  Please select a police station from the sidebar to start configuring its custom input fields
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
