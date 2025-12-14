"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { FiUserPlus, FiX } from "react-icons/fi";

import { CldUploadWidget } from "next-cloudinary";

interface CustomField {
  id: number;
  field_name: string;
  field_label: string;
  field_type: string;
  field_options: string;
  is_required: boolean;
  value: string;
}

export default function AddOfficerPage() {
  const { data: session } = useSession();
  const [customFields, setCustomFields] = useState<CustomField[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingFields, setFetchingFields] = useState(true);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (session?.user?.station_id) {
      fetchStationFields(session.user.station_id);
    }
  }, [session]);

  const fetchStationFields = async (stationId: string) => {
    setFetchingFields(true);
    try {
      const response = await fetch(`/api/admin/station-fields/${stationId}`);
      const data = await response.json();
      
      if (data.success) {
        const fieldsWithValues = data.data.map((field: CustomField) => ({
          ...field,
          value: ''
        }));
        setCustomFields(fieldsWithValues);
      }
    } catch (err) {
      console.error('Error fetching fields:', err);
      setError("Failed to load form fields");
    } finally {
      setFetchingFields(false);
    }
  };

  const updateFieldValue = (index: number, value: string) => {
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

  console.log('=== SUBMISSION DEBUG ===');
  console.log('All custom fields with values:');
  customFields.forEach(field => {
    console.log(`  ${field.field_label} (${field.field_name}, ${field.field_type}):`, field.value);
  });
  console.log('========================');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
      const customFieldsData: Record<string, string> = {};
      
      customFields.forEach(field => {
        customFieldsData[field.field_name] = field.value || '';
        console.log(`Adding field: ${field.field_name} = ${field.value}`);
      });

      console.log('=== BEFORE SENDING ===');
      console.log('customFieldsData:', customFieldsData);
      console.log('======================');

      const submissionData = {
        station_id: session?.user?.station_id,
        custom_fields: customFieldsData,
      };

      console.log('=== FULL SUBMISSION ===');
      console.log(JSON.stringify(submissionData, null, 2));
      console.log('=======================');

      const response = await fetch('/api/station/officers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });

      const data = await response.json();
      
      console.log('=== SERVER RESPONSE ===');
      console.log(data);
      console.log('=======================');

      if (data.success) {
        setSuccess("Officer added successfully with images!");
        
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

  const renderFieldInput = (field: CustomField, index: number): React.ReactNode => {
    switch (field.field_type) {
      case 'text':
        return (
          <input
            type="text"
            value={field.value}
            onChange={(e) => updateFieldValue(index, e.target.value)}
            placeholder={`Enter ${field.field_label.toLowerCase()}`}
            required={field.is_required}
            className="w-full border border-slate-300 rounded-xl px-4 py-3.5 text-base bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm hover:shadow-md"
          />
        );

      case 'number':
        return (
          <input
            type="number"
            value={field.value}
            onChange={(e) => updateFieldValue(index, e.target.value)}
            placeholder={`Enter ${field.field_label.toLowerCase()}`}
            required={field.is_required}
            className="w-full border border-slate-300 rounded-xl px-4 py-3.5 text-base bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm hover:shadow-md"
          />
        );

      case 'date':
        return (
          <input
            type="date"
            value={field.value}
            onChange={(e) => updateFieldValue(index, e.target.value)}
            required={field.is_required}
            className="w-full border border-slate-300 rounded-xl px-4 py-3.5 text-base bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm hover:shadow-md"
          />
        );

      case 'select':
        const options = field.field_options ? field.field_options.split(',') : [];
        return (
          <select
            value={field.value}
            onChange={(e) => updateFieldValue(index, e.target.value)}
            required={field.is_required}
            className="w-full border border-slate-300 rounded-xl px-4 py-3.5 text-base bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm hover:shadow-md"
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
            value={field.value}
            onChange={(e) => updateFieldValue(index, e.target.value)}
            placeholder={`Enter ${field.field_label.toLowerCase()}`}
            required={field.is_required}
            rows={4}
            className="w-full border border-slate-300 rounded-xl px-4 py-3.5 text-base bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm hover:shadow-md resize-none"
          />
        );

      case 'file':
        return (
          <div>
            <CldUploadWidget
              uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
              signatureEndpoint="/api/sign-cloudinary-params"
              options={{
                multiple: false,
                maxFiles: 1,
                resourceType: "image",
                clientAllowedFormats: ["jpg", "jpeg", "png", "gif", "webp"],
                maxFileSize: 2000000,
                folder: `police-id/${session?.user?.station_id}`,
                sources: ['local', 'camera'],
                showSkipCropButton: false,
                cropping: false,
              }}
              onSuccess={(result) => {
                console.log('Upload Success - Full Result:', result);
                
                if (result.info && typeof result.info === 'object' && 'secure_url' in result.info) {
                  const imageUrl = (result.info as { secure_url: string }).secure_url;
                  console.log('Image URL extracted:', imageUrl);
                  updateFieldValue(index, imageUrl);
                  setSuccess(`${field.field_label} uploaded successfully!`);
                  setTimeout(() => setSuccess(""), 3000);
                } else {
                  console.error('No secure_url found in result:', result);
                  setError(`Failed to get URL for ${field.field_label}`);
                }
              }}
              onError={(error) => {
                console.error('Upload error:', error);
                setError(`Failed to upload ${field.field_label}. Please try again.`);
              }}
            >
              {({ open }) => (
                <div>
                  <button
                    type="button"
                    onClick={() => {
                      console.log('Opening Cloudinary upload widget for:', field.field_label);
                      open();
                    }}
                    className="w-full border-2 border-dashed border-slate-300 rounded-xl px-4 py-10 bg-slate-50 hover:bg-blue-50 hover:border-blue-300 active:bg-blue-100 cursor-pointer transition-all flex flex-col items-center justify-center gap-3 shadow-sm hover:shadow-md"
                  >
                    <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center">
                      <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                    <div className="text-center">
                      <span className="block text-sm md:text-base font-semibold text-slate-700 mb-1">
                        {field.value ? 'Change Image' : `Upload ${field.field_label}`}
                      </span>
                      <span className="block text-xs text-slate-500">
                        Click to browse or drag and drop
                      </span>
                      <span className="block text-xs text-slate-400 mt-1">
                        Max 2MB • JPG, PNG, GIF, WebP
                      </span>
                    </div>
                  </button>

                  {field.value && (
                    <div className="mt-4 relative rounded-xl overflow-hidden border-2 border-green-200 shadow-lg">
                      <Image
                        src={field.value}
                        alt={field.field_label}
                        width={800}
                        height={600}
                        className="w-full h-56 md:h-48 object-cover"
                      />
                      <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-lg">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                        Uploaded
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          updateFieldValue(index, '');
                        }}
                        className="absolute top-3 left-3 bg-red-500 hover:bg-red-600 active:bg-red-700 text-white p-2 rounded-full transition-all shadow-lg hover:scale-110"
                        title="Remove image"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </CldUploadWidget>

            {field.is_required && !field.value && (
              <p className="text-xs text-red-500 mt-2 flex items-center gap-1">
                <span className="text-red-500">*</span> This field is required
              </p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  if (fetchingFields) {
    return (
      <div className="min-h-screen bg-white p-4 md:p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-14 w-14 border-4 border-slate-200 border-t-blue-500 mb-4"></div>
          <p className="text-slate-600 text-sm md:text-base font-medium">Loading form fields...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-4 md:p-8 lg:p-12 pb-24 md:pb-12">
      <div className="md:max-w-full md:mx-auto">
        {/* Enhanced Header Section */}
        <div className="mb-6 md:mb-10 bg-linear-to-r from-blue-50 to-indigo-50 rounded-2xl shadow-sm p-5 md:p-8 border border-blue-100">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-linear-to-br from-blue-500 to-indigo-600 shadow-lg">
              <FiUserPlus className="w-7 h-7 md:w-8 md:h-8 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl md:text-4xl font-bold text-slate-800 tracking-tight mb-1">
                Add New Officer
              </h1>
              <p className="text-slate-600 text-xs md:text-base flex items-center gap-2">
                <span className="inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
                Fill in the officer details for <span className="font-semibold text-slate-700">{session?.user?.station_name}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="mb-4 md:mb-6 p-4 md:p-5 bg-green-50 border-l-4 border-green-500 rounded-xl shadow-md flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-sm md:text-base text-green-700 font-semibold">{success}</p>
            </div>
            <button onClick={() => setSuccess("")} className="text-green-700 hover:text-green-900 p-1.5 hover:bg-green-100 rounded-lg transition-colors">
              <FiX size={20} />
            </button>
          </div>
        )}

        {error && (
          <div className="mb-4 md:mb-6 p-4 md:p-5 bg-red-50 border-l-4 border-red-500 rounded-xl shadow-md flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <p className="text-sm md:text-base text-red-700 font-semibold">{error}</p>
            </div>
            <button onClick={() => setError("")} className="text-red-700 hover:text-red-900 p-1.5 hover:bg-red-100 rounded-lg transition-colors">
              <FiX size={20} />
            </button>
          </div>
        )}

        {/* Form Card - Full Width */}
        <div className="w-full">
          {customFields.length === 0 ? (
            <div className="bg-linear-to-br from-slate-50 to-slate-100 shadow-lg rounded-2xl p-8 md:p-16 border border-slate-200 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-full bg-white shadow-md mb-6">
                <FiUserPlus className="w-10 h-10 md:w-12 md:h-12 text-slate-400" />
              </div>
              <h3 className="text-lg md:text-2xl font-bold text-slate-700 mb-3">No Form Fields Configured</h3>
              <p className="text-slate-500 text-sm md:text-base max-w-md mx-auto">
                Please contact the admin to configure input fields for your station before adding officers.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-2xl p-5 md:p-10 border border-slate-200">
              {/* Form Header */}
              <div className="flex items-center gap-4 mb-8 pb-6 border-b-2 border-slate-100">
                <div className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-xl bg-linear-to-br from-blue-500 to-indigo-600 shadow-md">
                  <svg className="w-6 h-6 md:w-7 md:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg md:text-2xl font-bold text-slate-800">Officer Information Form</h2>
                  <p className="text-xs md:text-sm text-slate-500 mt-0.5">Fields marked with <span className="text-red-500 font-semibold">*</span> are required</p>
                </div>
              </div>

              {/* Dynamic Fields Grid - Enhanced Spacing */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8">
                {customFields.map((field, index) => (
                  <div 
                    key={field.id} 
                    className={
                      field.field_type === 'textarea' || field.field_type === 'file' 
                        ? 'md:col-span-2 lg:col-span-3' 
                        : ''
                    }
                  >
                    <label className="block text-sm md:text-base font-bold text-slate-700 mb-3">
                      {field.field_label}
                      {field.is_required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    {renderFieldInput(field, index)}
                  </div>
                ))}
              </div>

              {/* Action Buttons - Enhanced Styling */}
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mt-8 md:mt-12 pt-8 border-t-2 border-slate-100">
                <button
                  type="submit"
                  disabled={loading}
                  className={`${
                    loading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-linear-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 active:scale-98 shadow-lg hover:shadow-xl'
                  } text-white font-bold px-8 md:px-10 py-4 md:py-3.5 rounded-xl transition-all text-sm md:text-base flex items-center justify-center gap-2`}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Save Officer
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  disabled={loading}
                  className="bg-slate-100 text-slate-700 font-bold px-8 md:px-10 py-4 md:py-3.5 rounded-xl hover:bg-slate-200 active:bg-slate-300 transition-all disabled:opacity-50 text-sm md:text-base shadow-sm hover:shadow-md flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Reset Form
                </button>
                <button
                  type="button"
                  className="bg-white border-2 border-slate-300 text-slate-700 font-bold px-8 md:px-10 py-4 md:py-3.5 rounded-xl hover:bg-slate-50 active:bg-slate-100 transition-all text-sm md:text-base shadow-sm hover:shadow-md flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
