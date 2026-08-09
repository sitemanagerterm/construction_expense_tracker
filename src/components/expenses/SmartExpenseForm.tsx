"use client";

import React, { useState, useRef } from "react";
import { FaMicrophone, FaCamera, FaKeyboard, FaTimes, FaSpinner, FaStop, FaExclamationCircle, FaChevronDown } from "react-icons/fa";
import { parseExpenseFromImage, parseExpenseFromAudio } from "@/app/actions/ai-parser";
import { createExpense, updateExpense, getTenantCategories } from "@/app/actions/expenses";
import { queueExpenseForSync } from "@/lib/offlineSync";
import toast from "react-hot-toast";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import { useTenantPreferences } from "@/components/providers/TenantProvider";
import { getCurrencySymbol } from "@/lib/utils";

type Project = { id: string; name: string };

export default function SmartExpenseForm({ 
  projects, 
  onClose,
  onSuccess,
  initialProjectId,
  expenseToEdit
}: { 
  projects: Project[], 
  onClose: () => void,
  onSuccess: () => void,
  initialProjectId?: string,
  expenseToEdit?: any
}) {
  const [activeTab, setActiveTab] = useState<"manual" | "voice" | "ocr">("manual");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { currency, t } = useTenantPreferences();
  
  React.useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // Form State
  const [projectId, setProjectId] = useState(expenseToEdit?.project?.id || initialProjectId || projects[0]?.id || "");
  const [amount, setAmount] = useState(expenseToEdit ? String(expenseToEdit.amount) : "");
  const [category, setCategory] = useState(expenseToEdit?.category || "");
  const [notes, setNotes] = useState(expenseToEdit?.notes || "");
  const [date, setDate] = useState<Date | null>(expenseToEdit ? new Date(expenseToEdit.date) : new Date());
  const [editReason, setEditReason] = useState("");
  const [errors, setErrors] = useState<{ projectId?: string; amount?: string; date?: string; category?: string; editReason?: string }>({});
  
  const [categoryOptions, setCategoryOptions] = useState([
    { value: "MATERIALS", label: "Materials" },
    { value: "LABOR", label: "Labor" },
    { value: "TRANSPORT", label: "Transport" },
    { value: "EQUIPMENT", label: "Equipment" },
    { value: "OTHER", label: "Other" }
  ]);

  React.useEffect(() => {
    async function fetchCategories() {
      const res = await getTenantCategories();
      if (res.success && res.categories) {
        const defaultVals = ["MATERIALS", "LABOR", "TRANSPORT", "EQUIPMENT", "OTHER"];
        const newOpts = res.categories
          .filter((c: string) => !defaultVals.includes(c.toUpperCase()))
          .map((c: string) => ({ 
            value: c.toUpperCase(), 
            label: c.charAt(0).toUpperCase() + c.slice(1).toLowerCase() 
          }));
        
        setCategoryOptions(prev => {
          // Filter out any duplicates just in case
          const existingValues = prev.map(p => p.value);
          const uniqueNewOpts = newOpts.filter((n: any) => !existingValues.includes(n.value));
          return [...prev, ...uniqueNewOpts];
        });
      }
    }
    fetchCategories();
  }, []);

  // Voice State
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    // Custom Validation
    const newErrors: { projectId?: string; amount?: string; date?: string; category?: string; editReason?: string } = {};
    if (!projectId) newErrors.projectId = "Please select a project";
    if (!amount) newErrors.amount = "Amount is required";
    else if (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) newErrors.amount = "Amount must be greater than zero";
    if (!category) newErrors.category = "Category is required";
    if (!date) newErrors.date = "Date is required";
    if (expenseToEdit && !editReason.trim()) newErrors.editReason = "Reason for edit is required";
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});

    setIsProcessing(true);
    const payload = {
      projectId,
      amount: parseFloat(amount),
      category,
      date: date ? date.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      notes
    };
    try {
      if (expenseToEdit && expenseToEdit.id) {
        const res = await updateExpense(expenseToEdit.id, payload, editReason.trim());
        if (res.success) {
          toast.success("Expense updated successfully!");
          onSuccess();
        } else {
          toast.error(res.error || "Failed to update expense");
        }
      } else {
        const res = await createExpense(payload);
        if (res.success) {
          toast.success("Expense logged successfully!");
          onSuccess();
        } else {
          toast.error(res.error || "Failed to log expense");
        }
      }
    } catch (err) {
      toast.error("Failed to connect to server. Try offline mode.");
    } finally {
      setIsProcessing(false);
    }
  };

  // --- OCR Logic ---
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    setIsProcessing(true);
    const objectUrl = URL.createObjectURL(file);

    try {
      const img = new Image();
      img.src = objectUrl;
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      const canvas = document.createElement("canvas");
      const MAX_WIDTH = 1200;
      const MAX_HEIGHT = 1200;
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > MAX_WIDTH) {
          height = Math.round((height * MAX_WIDTH) / width);
          width = MAX_WIDTH;
        }
      } else {
        if (height > MAX_HEIGHT) {
          width = Math.round((width * MAX_HEIGHT) / height);
          height = MAX_HEIGHT;
        }
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(img, 0, 0, width, height);

      const base64Data = canvas.toDataURL("image/jpeg", 0.7).split(',')[1];
      const res = await parseExpenseFromImage(base64Data, "image/jpeg");
      
      if (res.success && res.data) {
        if (res.data.amount) setAmount(res.data.amount.toString());
        if (res.data.category) setCategory(res.data.category);
        if (res.data.notes) setNotes(res.data.notes);
        toast.success("Receipt scanned successfully!");
        setActiveTab("manual"); // Switch back to manual so they can review and submit
      } else {
        toast.error(res.error || "AI couldn't parse the receipt properly.");
      }
    } catch (err: any) {
      console.error(err);
      toast.error("Error connecting to AI. Image might be too large.");
    } finally {
      setIsProcessing(false);
      URL.revokeObjectURL(objectUrl);
    }
  };

  // --- Voice Logic ---
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const mimeType = mediaRecorder.mimeType || 'audio/webm';
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        processAudioBlob(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      toast.error("Microphone access denied");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const processAudioBlob = async (blob: Blob) => {
    setIsProcessing(true);
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Data = (reader.result as string).split(',')[1];
        const res = await parseExpenseFromAudio(base64Data, blob.type);
        
        if (res.success && (res as any).data) {
          const data = (res as any).data;
          if (data.amount) setAmount(data.amount.toString());
          if (data.category) setCategory(data.category);
          if (data.notes) setNotes(data.notes);
          toast.success("Voice parsed successfully!");
          setActiveTab("manual"); // Switch back to manual for review
        } else {
          toast.error((res as any).error || "AI couldn't understand the voice note.");
        }
        setIsProcessing(false);
      };
      reader.readAsDataURL(blob);
    } catch (err) {
      toast.error("Error processing audio");
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col justify-end sm:justify-center items-center bg-white sm:bg-gray-900/60 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in" onClick={onClose}>
      <div className="bg-white w-full h-full sm:h-auto sm:max-w-lg rounded-none sm:rounded-3xl shadow-none sm:shadow-2xl border-0 sm:border sm:border-gray-100 overflow-hidden flex flex-col sm:max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h2 className="text-xl font-bold text-primary-900">{expenseToEdit ? (t('edit_expense') || "Edit Expense") : (t('log_new_expense') || "Log New Expense")}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-2">
            <FaTimes />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100 p-2 gap-2">
          <button
            onClick={() => setActiveTab("manual")}
            className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 rounded-xl transition-all ${activeTab === "manual" ? "bg-primary-50 text-primary-900" : "text-gray-500 hover:bg-gray-50"}`}
          >
            <FaKeyboard /> Manual
          </button>
          <button
            onClick={() => setActiveTab("ocr")}
            className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 rounded-xl transition-all ${activeTab === "ocr" ? "bg-green-50 text-green-700" : "text-gray-500 hover:bg-gray-50"}`}
          >
            <FaCamera /> Scan
          </button>
          <button
            onClick={() => setActiveTab("voice")}
            className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 rounded-xl transition-all ${activeTab === "voice" ? "bg-accent/20 text-accent-dark" : "text-gray-500 hover:bg-gray-50"}`}
          >
            <FaMicrophone /> Voice
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto">
          {projects.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500 text-2xl">
                <FaExclamationCircle />
              </div>
              <h3 className="text-lg font-bold text-gray-900">No Projects Found</h3>
              <p className="text-gray-500 text-sm mt-2 mb-6">You need to have an active project before you can log any expenses.</p>
              <button 
                onClick={onClose}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-2.5 px-6 rounded-xl transition-colors"
              >
                Close
              </button>
            </div>
          ) : (
            <>
              {activeTab === "manual" && (
                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                  <div>
                    <label className="block text-sm font-semibold text-primary-800 mb-1.5">{t('project') || "Project"}</label>
                    <div className="relative">
                      <Select 
                        options={projects.map(p => ({ value: p.id, label: p.name }))}
                        value={projects.find(p => p.id === projectId) ? { value: projectId, label: projects.find(p => p.id === projectId)?.name } : null}
                        onChange={(val: any) => { setProjectId(val?.value || ""); setErrors(prev => ({ ...prev, projectId: undefined })); }}
                        placeholder="Search project..."
                        menuPosition="fixed"
                        menuPortalTarget={isMounted ? document.body : null}
                        styles={{
                          menuPortal: base => ({ ...base, zIndex: 9999 }),
                          control: (base, state) => ({
                            ...base,
                            backgroundColor: errors.projectId ? 'rgba(254, 242, 242, 0.3)' : '#f9fafb',
                            borderColor: errors.projectId ? '#ef4444' : (state.isFocused ? '#3b82f6' : '#e5e7eb'),
                            borderRadius: '0.75rem',
                            minHeight: '50px',
                            boxShadow: errors.projectId ? '0 0 0 2px rgba(239, 68, 68, 0.2)' : (state.isFocused ? '0 0 0 2px rgba(59, 130, 246, 0.2)' : 'none'),
                            '&:hover': {
                              borderColor: state.isFocused ? '#3b82f6' : '#d1d5db'
                            }
                          }),
                          valueContainer: (base) => ({
                            ...base,
                            padding: '0 1rem'
                          }),
                          input: (base) => ({
                            ...base,
                            margin: 0,
                            padding: 0
                          })
                        }}
                      />
                    </div>
                    {errors.projectId && (
                      <p className="text-red-500 text-xs mt-1.5 font-medium flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        {errors.projectId}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-primary-800 mb-1.5">Amount ({getCurrencySymbol(currency)})</label>
                  <input 
                    type="number" step="0.01" min="0.01" value={amount} onChange={(e) => { setAmount(e.target.value); setErrors(prev => ({ ...prev, amount: undefined })); }}
                    className={`w-full bg-gray-50 border rounded-xl px-4 py-3 text-gray-800 font-bold focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all no-spinners ${
                      errors.amount ? 'border-red-500 bg-red-50/30 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-200 focus:border-primary-500'
                    }`}
                    placeholder="e.g. 5000"
                  />
                  {errors.amount && (
                    <p className="text-red-500 text-xs mt-1.5 font-medium flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                      {errors.amount}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-primary-800 mb-1.5">Category</label>
                  <div className="relative">
                      <CreatableSelect
                        instanceId="expense-category-select"
                        options={categoryOptions}
                        value={category ? { value: category, label: categoryOptions.find(o => o.value === category)?.label || category } : null}
                        onChange={(val: any) => { setCategory(val?.value?.toUpperCase() || ""); setErrors(prev => ({ ...prev, category: undefined })); }}
                        placeholder="Select..."
                        formatCreateLabel={(inputValue) => `+ Create new category "${inputValue}"`}
                        menuPosition="fixed"
                        menuPortalTarget={isMounted ? document.body : null}
                        styles={{
                          menuPortal: base => ({ ...base, zIndex: 9999 }),
                          control: (base, state) => ({
                            ...base,
                            backgroundColor: errors.category ? 'rgba(254, 242, 242, 0.3)' : '#f9fafb',
                            borderColor: errors.category ? '#ef4444' : (state.isFocused ? '#3b82f6' : '#e5e7eb'),
                            borderRadius: '0.75rem',
                            minHeight: '50px',
                            boxShadow: errors.category ? '0 0 0 2px rgba(239, 68, 68, 0.2)' : (state.isFocused ? '0 0 0 2px rgba(59, 130, 246, 0.2)' : 'none'),
                            '&:hover': {
                              borderColor: state.isFocused ? '#3b82f6' : '#d1d5db'
                            }
                          }),
                          valueContainer: (base) => ({
                            ...base,
                            padding: '0 1rem'
                          }),
                          input: (base) => ({
                            ...base,
                            margin: 0,
                            padding: 0
                          })
                        }}
                      />
                      <p className="text-xs text-gray-500 mt-2 font-medium flex items-start gap-1.5 leading-tight">
                        <FaKeyboard className="text-gray-400 shrink-0 mt-[1px]" />
                        Type to search or add a custom category
                      </p>
                      {errors.category && (
                        <p className="text-red-500 text-xs mt-1.5 font-medium flex items-center gap-1">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                          {errors.category}
                        </p>
                      )}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-primary-800 mb-1.5">{t('date') || "Date"}</label>
                <DatePicker 
                  selected={date} 
                  onChange={(d: Date | null) => setDate(d)}
                  className={`w-full bg-gray-50 border rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all ${
                    errors.date ? 'border-red-500 bg-red-50/30 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-200 focus:border-primary-500'
                  }`}
                  wrapperClassName="w-full"
                  dateFormat="MMMM d, yyyy"
                />
                {errors.date && (
                  <p className="text-red-500 text-xs mt-1.5 font-medium flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    {errors.date}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-primary-800 mb-1.5">{t('notes_optional') || "Notes (Optional)"}</label>
                <textarea 
                  value={notes} onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all resize-none"
                  rows={2} placeholder="Vendor name or short description"
                />
              </div>

              {expenseToEdit && (
                <div>
                  <label className="block text-sm font-semibold text-primary-800 mb-1.5">{t('reason_for_edit') || "Reason for Edit"} *</label>
                  <textarea 
                    value={editReason} onChange={(e) => { setEditReason(e.target.value); setErrors(prev => ({ ...prev, editReason: undefined })); }}
                    className={`w-full bg-gray-50 border rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all resize-none ${
                      errors.editReason ? 'border-red-500 bg-red-50/30 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-200 focus:border-primary-500'
                    }`}
                    rows={2} placeholder={t('reason_for_edit_placeholder') || "e.g. Corrected amount, fixing typo..."}
                  />
                  {errors.editReason && (
                    <p className="text-red-500 text-xs mt-1.5 font-medium flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                      {errors.editReason}
                    </p>
                  )}
                </div>
              )}

              <button 
                type="submit" 
                disabled={isProcessing}
                className="w-full bg-primary-900 text-white py-3.5 rounded-xl font-bold hover:bg-primary-800 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
              >
                {isProcessing ? <><FaSpinner className="animate-spin" /> {t('saving') || "Saving..."}</> : (expenseToEdit ? (t('save_changes') || "Save Changes") : (t('save_expense') || "Save Expense"))}
              </button>
            </form>
          )}

          {activeTab === "ocr" && (
            <div className="flex flex-col items-center justify-center py-8 text-center space-y-4">
              <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center text-green-500 text-3xl mb-2">
                {isProcessing ? <FaSpinner className="animate-spin" /> : <FaCamera />}
              </div>
              <div>
                <h3 className="text-lg font-bold text-primary-900">Scan Receipt</h3>
                <p className="text-gray-500 text-sm mt-1 max-w-xs">Upload a photo of your receipt or bill. AI will extract the amount and details for you.</p>
              </div>
              
              <label className="mt-4 cursor-pointer bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-bold transition-colors inline-block">
                Choose Image
                <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFileUpload} disabled={isProcessing} />
              </label>
            </div>
          )}

          {activeTab === "voice" && (
            <div className="flex flex-col items-center justify-center py-8 text-center space-y-4">
              <div className={`w-24 h-24 rounded-full flex items-center justify-center text-4xl mb-2 transition-all ${isRecording ? 'bg-red-100 text-red-500 animate-pulse' : 'bg-accent/20 text-accent-dark'}`}>
                {isProcessing ? <FaSpinner className="animate-spin" /> : <FaMicrophone />}
              </div>
              <div>
                <h3 className="text-lg font-bold text-primary-900">Voice Logging</h3>
                <p className="text-gray-500 text-sm mt-1 max-w-xs">Tap to record and speak naturally.<br/><i>"Paid 500 to transport for Alpha Project"</i></p>
              </div>
              
              {!isRecording ? (
                <button onClick={startRecording} disabled={isProcessing} className="mt-4 bg-accent hover:bg-accent/90 text-primary-900 px-8 py-3 rounded-xl font-bold transition-colors">
                  Start Recording
                </button>
              ) : (
                <button onClick={stopRecording} className="mt-4 bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-xl font-bold transition-colors flex items-center gap-2">
                  <FaStop /> Stop & Parse
                </button>
              )}
            </div>
          )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
