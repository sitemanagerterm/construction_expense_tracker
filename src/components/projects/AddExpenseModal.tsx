"use client";

import React, { useState, useEffect, useRef } from "react";

import { formatCurrency } from "@/lib/utils";
import { useTenantPreferences } from "@/components/providers/TenantProvider";
import { parseMultipleExpensesFromAudio, parseExpenseFromImage } from "@/app/actions/ai-parser";
import { toast } from "react-hot-toast";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function AddExpenseModal({ isOpen, onClose, projectId, projectName, currency, onAddExpenses }: any) {

  const { t } = useTenantPreferences();
  const DEFAULT_CATEGORIES = ["Food", "Maligai", "Medical", "Paal", "Sand", "Steel", "Tools", "Transport"];
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);

  const [tab, setTab] = useState<"MANUAL" | "VOICE" | "IMAGE" | "SMART">("MANUAL");
  
  const [stagedExpenses, setStagedExpenses] = useState<{id: string, category: string, amount: number, notes?: string}[]>([]);
  const [smartText, setSmartText] = useState("");
  const [detectedExpenses, setDetectedExpenses] = useState<{id: string, category: string, amount: number, notes?: string}[]>([]);
  
  const [manualCategory, setManualCategory] = useState("");
  const [manualAmount, setManualAmount] = useState("");
  const [manualNotes, setManualNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expenseDate, setExpenseDate] = useState<Date>(new Date());

  // Voice
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Image
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (smartText.trim() !== "") {
      const regex = /([\p{L}\p{M}][\p{L}\p{M}\s]*?)\s+(\d+(?:\.\d+)?)/gu;
      let match;
      const parsed = [];
      while ((match = regex.exec(smartText)) !== null) {
        parsed.push({
          id: Math.random().toString(36).substr(2, 9),
          category: match[1].trim(),
          amount: parseFloat(match[2]),
          notes: match[1].trim()
        });
      }
      setDetectedExpenses(parsed);
    } else if (tab === "SMART") {
      setDetectedExpenses([]);
    }
  }, [smartText, tab]);

  // Cleanup on close
  useEffect(() => {
    if (!isOpen) {
      setImagePreview(null);
      setDetectedExpenses([]);
      setIsRecording(false);
      setRecordingSeconds(0);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAddManual = () => {
    if (manualCategory && manualAmount) {
      const properCat = manualCategory.charAt(0).toUpperCase() + manualCategory.slice(1).toLowerCase();
      setStagedExpenses(prev => [...prev, {
        id: Math.random().toString(36).substr(2, 9),
        category: properCat,
        amount: Number(manualAmount),
        notes: manualNotes.trim() || properCat
      }]);
      setManualCategory("");
      setManualAmount("");
      setManualNotes("");
    }
  };

  const handleAddVoice = () => {
    if (detectedExpenses.length > 0) {
      setStagedExpenses(prev => [...prev, ...detectedExpenses]);
      setSmartText("");
      setDetectedExpenses([]);
    }
  };

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
      setRecordingSeconds(0);
      timerRef.current = setInterval(() => setRecordingSeconds(s => s + 1), 1000);
    } catch (err) {
      toast.error(t('audio_error') || "Microphone access denied");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    }
  };

  const processImageFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }
    setIsProcessing(true);
    const objectUrl = URL.createObjectURL(file);
    setImagePreview(objectUrl);

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Data = (reader.result as string).split(',')[1];
        const res = await parseExpenseFromImage(base64Data, file.type);
        if (res && res.success) {
          const exp = res.data;
          setDetectedExpenses([{
            id: Math.random().toString(36).substr(2, 9),
            category: exp.category,
            amount: exp.amount,
            notes: exp.notes || exp.category
          }]);
          toast.success(t('image_parsed') || "Receipt scanned successfully!");
        } else {
          toast.error(res.error || t('image_parsed_err') || "AI couldn't read this receipt.");
        }
        setIsProcessing(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      toast.error(t('audio_error') || "Error processing image");
      setIsProcessing(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processImageFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processImageFile(file);
  };

  const processAudioBlob = async (blob: Blob) => {
    setIsProcessing(true);
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Data = (reader.result as string).split(',')[1];
        const res = await parseMultipleExpensesFromAudio(base64Data, blob.type);
        if (res.success && (res as any).data && Array.isArray((res as any).data)) {
          const newExpenses = (res as any).data.map((exp: any) => ({
            id: Math.random().toString(36).substr(2, 9),
            category: exp.category,
            amount: exp.amount,
            notes: exp.notes || exp.category
          }));
          setDetectedExpenses(newExpenses);
          toast.success(t('voice_parsed') || "Voice parsed successfully!");
        } else {
          toast.error((res as any).error || t('voice_parsed_err') || "AI couldn't understand the voice note.");
        }
        setIsProcessing(false);
      };
      reader.readAsDataURL(blob);
    } catch (err) {
      toast.error(t('audio_error') || "Error processing audio");
      setIsProcessing(false);
    }
  };

  const removeStaged = (id: string) => setStagedExpenses(prev => prev.filter(e => e.id !== id));
  const removeDetected = (id: string) => setDetectedExpenses(prev => prev.filter(e => e.id !== id));

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      let finalExpenses = [...stagedExpenses];
      if (manualCategory && manualAmount) {
        finalExpenses.push({ id: Math.random().toString(36).substr(2, 9), category: manualCategory, amount: Number(manualAmount), notes: manualNotes.trim() || manualCategory });
      }
      if (detectedExpenses.length > 0) finalExpenses = [...finalExpenses, ...detectedExpenses];

      if (finalExpenses.length > 0) {
        await onAddExpenses(projectId, finalExpenses.map(e => ({ category: e.category, amount: e.amount, notes: e.notes, date: expenseDate })));
      }
      setStagedExpenses([]); setSmartText(""); setManualCategory(""); setManualAmount(""); setManualNotes(""); setExpenseDate(new Date());
      setImagePreview(null); setDetectedExpenses([]);
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (s: number) => `${String(Math.floor(s / 60)).padStart(2,'0')}:${String(s % 60).padStart(2,'0')}`;

  const DetectedList = () => (
    detectedExpenses.length > 0 ? (
      <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-2xl p-4 mt-4">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
              AI Detected ({detectedExpenses.length})
            </p>
          </div>
          <button onClick={handleAddVoice} className="text-xs font-bold bg-emerald-500 text-white px-3 py-1.5 rounded-lg hover:bg-emerald-600 transition-colors shadow-sm flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
            {t('add_all') || "Add All"}
          </button>
        </div>
        <div className="space-y-2">
          {detectedExpenses.map((exp) => (
            <div key={exp.id} className="flex justify-between items-center bg-white dark:bg-slate-800 p-3 rounded-xl border border-emerald-100 dark:border-emerald-500/20 shadow-sm group">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-500/20 rounded-lg flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                </div>
                <div>
                  <span className="font-bold text-gray-900 dark:text-white capitalize text-sm block">{exp.category}</span>
                  {exp.notes && exp.notes !== exp.category && <span className="text-xs text-gray-400 dark:text-slate-500 block">{exp.notes}</span>}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">{formatCurrency(exp.amount, currency)}</span>
                <button onClick={() => removeDetected(exp.id)} className="w-7 h-7 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 text-gray-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500 transition-all">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    ) : null
  );

  return (
    <div className="fixed inset-0 z-[100] flex flex-col justify-end sm:justify-center items-center bg-black/50 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 w-full h-full sm:h-auto sm:max-w-lg rounded-none sm:rounded-3xl shadow-none sm:shadow-2xl border-0 sm:border border-gray-100 dark:border-slate-800 overflow-hidden flex flex-col sm:max-h-[90vh]">
        
        {/* Header (including Tabs) */}
        <div className="shrink-0 flex flex-col border-b border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-800/50">
          <div className="p-5 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t('add_expense')}</h2>
              {projectName && <p className="text-sm text-emerald-600 dark:text-emerald-500 font-bold mb-1 uppercase tracking-wider">{t('site') || "Site"}: {projectName}</p>}
              <p className="text-gray-500 dark:text-slate-400 text-sm mt-0.5">
                {tab === "MANUAL" && (t('add_expense_manual_desc') || "Enter expense details manually")}
                {tab === "SMART" && (t('voice_entry_desc') || "Record or snap a receipt to let AI parse your expenses")}
              </p>
            </div>
            <button onClick={onClose} className="w-9 h-9 rounded-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 flex items-center justify-center text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-700 transition-all shadow-sm shrink-0">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          {/* Tabs */}
          <div className="px-5 pb-4">
            <div className="flex bg-gray-100/80 dark:bg-slate-800 rounded-2xl p-1 gap-1 border border-gray-200/50 dark:border-slate-700/50">
              {[
                { id: "MANUAL", icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>, label: t('manual') || "Manual Entry" },
                { id: "SMART", icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>, label: "Smart Entry (Beta)" },
              ].map(({ id, icon, label }) => (
                <button
                  key={id}
                  onClick={() => { setTab(id as any); setDetectedExpenses([]); setImagePreview(null); }}
                  className={`flex-1 py-2.5 text-sm font-bold flex items-center justify-center gap-2 rounded-xl transition-all ${
                    tab === id
                      ? "bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow-sm"
                      : "text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200"
                  }`}
                >
                  {icon}
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-grow overflow-y-auto flex flex-col p-5">
            {/* Global Date Picker */}
            <div className="mb-5">
              <label className="block text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-2">Expense Date</label>
              <DatePicker
                selected={expenseDate}
                onChange={(date: Date | null) => date && setExpenseDate(date)}
                className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-4 text-gray-900 dark:text-white focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500 transition-shadow text-sm font-semibold h-[46px]"
                wrapperClassName="w-full"
                dateFormat="MMMM d, yyyy"
                maxDate={new Date()}
              />
            </div>
            
            {/* ── MANUAL TAB ── */}
            {tab === "MANUAL" && (
              <div className="space-y-4">
                <div className="flex gap-2 items-center">
                  <div className="flex-[3]">
                    <input
                      type="text"
                      value={manualCategory}
                      onChange={(e) => setManualCategory(e.target.value)}
                      placeholder='Category'
                      className="w-full bg-white dark:bg-slate-800/80 border border-gray-300 dark:border-slate-700 rounded-xl px-3 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500 text-sm font-semibold h-[46px] shadow-sm"
                    />
                  </div>
                  <div className="flex-[2]">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={manualAmount}
                      onChange={(e) => setManualAmount(e.target.value)}
                      placeholder="Amount"
                      className="w-full bg-white dark:bg-slate-800/80 border border-gray-300 dark:border-slate-700 rounded-xl px-3 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500 text-sm font-semibold h-[46px] shadow-sm"
                    />
                  </div>
                  <button
                    onClick={handleAddManual}
                    disabled={!manualCategory || !manualAmount}
                    className="w-[46px] h-[46px] flex items-center justify-center bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-sm transition-colors disabled:opacity-50 shrink-0"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
                  </button>
                </div>

                {/* Predefined Categories */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {categories.map((cat, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setManualCategory(cat)}
                      className={`px-4 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-1.5 group ${
                        manualCategory.toLowerCase() === cat.toLowerCase()
                          ? "bg-amber-500 text-gray-900 shadow-md scale-105"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:bg-slate-700 dark:border-slate-700/50"
                      }`}
                    >
                      {cat}
                      <div 
                        onClick={(e) => {
                            e.stopPropagation();
                            setCategoryToDelete(cat);
                          }}
                          className={`ml-1 p-0.5 rounded-full transition-colors ${
                            manualCategory.toLowerCase() === cat.toLowerCase() 
                              ? 'hover:bg-amber-600/50 text-gray-900' 
                              : 'hover:bg-gray-300 dark:hover:bg-slate-600 text-gray-500 dark:text-slate-400'
                          }`}
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                        </div>
                    </button>
                  ))}
                  {isAddingCategory ? (
                    <div className="flex items-center gap-1 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700/50 rounded-full pr-1 pl-3 shadow-sm">
                      <input
                        type="text"
                        autoFocus
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        placeholder="New category..."
                        className="bg-transparent text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-400 focus:outline-none w-28 py-1.5"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            const trimmed = newCategoryName.trim();
                            if (trimmed) {
                              const properCat = trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
                              if (!categories.find(c => c.toLowerCase() === properCat.toLowerCase())) {
                                setCategories(prev => [...prev, properCat]);
                              }
                              setManualCategory(properCat);
                              setIsAddingCategory(false);
                              setNewCategoryName("");
                            }
                          } else if (e.key === 'Escape') {
                            setIsAddingCategory(false);
                            setNewCategoryName("");
                          }
                        }}
                      />
                      <button
                        onClick={() => {
                          const trimmed = newCategoryName.trim();
                          if (trimmed) {
                            const properCat = trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
                            if (!categories.find(c => c.toLowerCase() === properCat.toLowerCase())) {
                              setCategories(prev => [...prev, properCat]);
                            }
                            setManualCategory(properCat);
                          }
                          setIsAddingCategory(false);
                          setNewCategoryName("");
                        }}
                        className="p-1.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
                      </button>
                      <button
                        onClick={() => {
                          setIsAddingCategory(false);
                          setNewCategoryName("");
                        }}
                        className="p-1.5 rounded-full text-gray-400 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setIsAddingCategory(true)}
                      className="px-4 py-2 rounded-full text-sm font-bold border border-gray-300 dark:border-slate-700/50 text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800/80 transition-colors flex items-center gap-1.5"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
                      Add category
                    </button>
                  )}
                </div>

                {/* Inline Confirmation for Deletion */}
                {categoryToDelete && (
                  <div className="mt-3 p-3 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-xl flex items-center justify-between animate-in fade-in zoom-in duration-200">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-red-100 dark:bg-red-500/20 rounded-full text-red-600 dark:text-red-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </div>
                      <span className="text-sm font-medium text-red-800 dark:text-red-200">
                        Delete "{categoryToDelete}"?
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setCategoryToDelete(null)}
                        className="px-3 py-1.5 text-xs font-bold text-gray-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          setCategories(prev => prev.filter(c => c !== categoryToDelete));
                          if (manualCategory === categoryToDelete) setManualCategory("");
                          setCategoryToDelete(null);
                        }}
                        className="px-3 py-1.5 text-xs font-bold bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors shadow-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── SMART TAB ── */}
            {tab === "SMART" && (
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-2">{t('type_or_use_voice') || "Quick Entry"}</label>
                  <textarea
                    value={smartText}
                    onChange={(e) => setSmartText(e.target.value)}
                    placeholder='e.g. "Labour 8500 cement 12000"'
                    rows={3}
                    className="w-full bg-white dark:bg-slate-800/80 border border-gray-300 dark:border-slate-700 rounded-xl p-4 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-400 focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500 transition-shadow resize-none font-medium shadow-sm"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <span className="flex-1 h-px bg-gray-200 dark:bg-slate-700" />
                  <span className="text-[10px] text-gray-400 dark:text-slate-500 font-bold uppercase tracking-wider">Beta Features</span>
                  <span className="flex-1 h-px bg-gray-200 dark:bg-slate-700" />
                </div>

                <div className="flex gap-3">
                  {/* Voice Button */}
                  <button
                    type="button"
                    onClick={isRecording ? stopRecording : startRecording}
                    disabled={isProcessing}
                    className={`flex-1 relative overflow-hidden rounded-xl border p-3 flex flex-col items-center justify-center gap-2 transition-all ${
                      isRecording
                        ? "border-red-400 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400"
                        : "border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/30 text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700"
                    } disabled:opacity-50`}
                  >
                    {isRecording ? (
                       <div className="flex items-center justify-center gap-2">
                         <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse inline-block" />
                         <span className="text-xs font-bold">{formatTime(recordingSeconds)}</span>
                       </div>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"/>
                      </svg>
                    )}
                    <span className="text-xs font-bold">{isRecording ? "Stop Recording" : "Voice Log"}</span>
                  </button>

                  {/* Scan Receipt Button */}
                  <div className="flex-1 relative h-[72px]">
                    <button
                      type="button"
                      onClick={() => !isProcessing && fileInputRef.current?.click()}
                      disabled={isProcessing}
                      className="w-full h-full rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/30 p-3 flex flex-col items-center justify-center gap-2 text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-all disabled:opacity-50"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-xs font-bold">Scan Receipt</span>
                    </button>
                    {imagePreview && (
                      <div className="absolute inset-0 bg-white dark:bg-slate-900 rounded-xl overflow-hidden border border-emerald-300 dark:border-emerald-600/50">
                         <img src={imagePreview} alt="Receipt" className="w-full h-full object-cover opacity-80" />
                         <button onClick={(e) => { e.stopPropagation(); setImagePreview(null); if(fileInputRef.current) fileInputRef.current.value = ""; }} className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 hover:bg-black/80">
                           <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                         </button>
                      </div>
                    )}
                  </div>
                </div>

                {isProcessing && (
                  <div className="flex flex-col items-center justify-center py-6 px-4 bg-violet-50 dark:bg-violet-500/10 rounded-xl border border-violet-100 dark:border-violet-500/20 animate-in fade-in duration-300">
                    <div className="relative mb-3">
                      <div className="w-10 h-10 border-4 border-violet-200 dark:border-violet-500/30 border-t-violet-600 dark:border-t-violet-400 rounded-full animate-spin"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <svg className="w-4 h-4 text-violet-600 dark:text-violet-400 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                      </div>
                    </div>
                    <p className="text-sm font-bold text-violet-700 dark:text-violet-300 animate-pulse">
                      Analyzing with AI...
                    </p>
                    <p className="text-xs text-violet-500 dark:text-violet-400 mt-1">
                      Extracting categories and amounts
                    </p>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                  disabled={isProcessing}
                />

                <DetectedList />
              </div>
            )}

            {/* ── Staged Expenses ── */}
            {stagedExpenses.length > 0 && (
              <div className="pt-4 border-t border-gray-100 dark:border-slate-800">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-bold text-gray-900 dark:text-white text-sm">
                    {t('expenses_to_save') || "Expenses to Save"}
                    <span className="ml-2 text-xs bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded-full font-bold">{stagedExpenses.length}</span>
                  </h3>
                  <span className="text-sm font-bold text-amber-600 dark:text-amber-400">
                    {formatCurrency(stagedExpenses.reduce((sum, e) => sum + e.amount, 0), currency)}
                  </span>
                </div>
                <div className="space-y-2">
                  {stagedExpenses.map((exp) => (
                    <div key={exp.id} className="flex justify-between items-center bg-gray-50 dark:bg-slate-800 p-3 rounded-xl border border-gray-100 dark:border-slate-700 group">
                      <div>
                        <span className="font-bold text-gray-700 dark:text-slate-300 capitalize text-sm block">{exp.category}</span>
                        {exp.notes && exp.notes !== exp.category && <span className="text-xs text-gray-400 dark:text-slate-500 block">{exp.notes}</span>}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900 dark:text-white text-sm">{formatCurrency(exp.amount, currency)}</span>
                        <button onClick={() => removeStaged(exp.id)} className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 p-1.5 rounded-lg transition-all">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-800/50 flex gap-3 shrink-0">
          <button onClick={onClose} className="flex-1 py-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-300 font-bold rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
            {t('cancel') || "Cancel"}
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || (stagedExpenses.length === 0 && (!manualAmount || !manualCategory) && detectedExpenses.length === 0)}
            className="flex-[2] py-3 bg-accent-500 text-white font-bold rounded-xl hover:bg-accent-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-sm flex justify-center items-center gap-2"
          >
            {isSubmitting ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (stagedExpenses.length + (manualCategory && manualAmount ? 1 : 0) + detectedExpenses.length) > 0 ? (
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
                {t('save') || "Save"} ({stagedExpenses.length + (manualCategory && manualAmount ? 1 : 0) + detectedExpenses.length})
              </span>
            ) : (
              <span>{t('save_expense') || "Save Expense"}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
