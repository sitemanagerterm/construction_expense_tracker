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

  const [tab, setTab] = useState<"MANUAL" | "VOICE" | "IMAGE">("MANUAL");
  
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
      const regex = /([a-zA-Z][a-zA-Z\s]*?)\s+(\d+(?:\.\d+)?)/g;
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
    } else if (tab === "MANUAL") {
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
      setStagedExpenses(prev => [...prev, {
        id: Math.random().toString(36).substr(2, 9),
        category: manualCategory,
        amount: Number(manualAmount),
        notes: manualNotes.trim() || manualCategory
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
                {tab === "VOICE" && (t('voice_entry_desc') || "Record and let AI parse your expenses")}
                {tab === "IMAGE" && (t('image_entry_desc') || "Snap or upload a receipt to auto-fill")}
              </p>
            </div>
            <button onClick={onClose} className="w-9 h-9 rounded-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 flex items-center justify-center text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-700 transition-all shadow-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          {/* Tabs */}
          <div className="px-5 pb-4">
            <div className="flex bg-gray-100/80 dark:bg-slate-800 rounded-2xl p-1 gap-1 border border-gray-200/50 dark:border-slate-700/50">
              {[
                { id: "MANUAL", icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>, label: t('manual') || "Manual", color: "gray" },
                { id: "IMAGE", icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>, label: t('image') || "Scan", color: "emerald" },
                { id: "VOICE", icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm-1-9c0-.55.45-1 1-1s1 .45 1 1v6c0 .55-.45 1-1 1s-1-.45-1-1V5zm6 6c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/></svg>, label: t('voice') || "Voice", color: "violet" },
              ].map(({ id, icon, label, color }) => (
                <button
                  key={id}
                  onClick={() => { setTab(id as any); setDetectedExpenses([]); setImagePreview(null); }}
                  className={`flex-1 py-2.5 text-sm font-bold flex items-center justify-center gap-2 rounded-xl transition-all ${
                    tab === id
                      ? color === "emerald" ? "bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm"
                      : color === "violet" ? "bg-white dark:bg-slate-700 text-violet-600 dark:text-violet-400 shadow-sm"
                      : "bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow-sm"
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
                className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl p-3 text-gray-900 dark:text-white focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500 transition-shadow font-medium"
                wrapperClassName="w-full"
                dateFormat="MMMM d, yyyy"
                maxDate={new Date()}
              />
            </div>
            
            {/* ── MANUAL TAB ── */}
            {tab === "MANUAL" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-2">{t('type_or_use_voice') || "Quick Entry"}</label>
                  <textarea
                    value={smartText}
                    onChange={(e) => setSmartText(e.target.value)}
                    placeholder='e.g. "Labour 8500 cement 12000"'
                    rows={3}
                    className="w-full bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-2xl p-4 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500 transition-shadow resize-none font-medium"
                  />
                </div>
                <DetectedList />
              </div>
            )}

            {/* ── VOICE TAB ── */}
            {tab === "VOICE" && (
              <div className="space-y-4">
                {/* Big microphone area */}
                <div className={`relative flex flex-col items-center justify-center py-10 rounded-3xl border-2 border-dashed transition-all ${
                  isRecording
                    ? "border-red-400 bg-red-50 dark:bg-red-500/5"
                    : isProcessing
                    ? "border-violet-400 bg-violet-50 dark:bg-violet-500/5"
                    : "border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/30"
                }`}>
                  {/* Animated rings when recording */}
                  {isRecording && (
                    <>
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-32 h-32 rounded-full border-2 border-red-400/30 animate-ping" />
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-44 h-44 rounded-full border border-red-400/15 animate-ping" style={{ animationDelay: "0.3s" }} />
                      </div>
                    </>
                  )}

                  {/* Mic button */}
                  <button
                    type="button"
                    onClick={isRecording ? stopRecording : startRecording}
                    disabled={isProcessing}
                    className={`relative z-10 w-24 h-24 rounded-full flex items-center justify-center transition-all shadow-lg active:scale-95 ${
                      isRecording
                        ? "bg-red-500 text-white shadow-red-500/30 shadow-xl hover:bg-red-600"
                        : isProcessing
                        ? "bg-violet-500 text-white shadow-violet-500/30 cursor-not-allowed"
                        : "bg-white dark:bg-slate-800 text-violet-600 dark:text-violet-400 border-2 border-violet-200 dark:border-violet-500/30 hover:border-violet-400 dark:hover:border-violet-500 hover:shadow-xl hover:scale-105"
                    } disabled:opacity-70`}
                  >
                    {isProcessing ? (
                      <span className="w-8 h-8 border-3 border-white border-t-transparent rounded-full animate-spin" style={{ borderWidth: 3 }} />
                    ) : isRecording ? (
                      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                        <rect x="6" y="6" width="12" height="12" rx="2" />
                      </svg>
                    ) : (
                      <svg className="w-9 h-9" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm-1-9c0-.55.45-1 1-1s1 .45 1 1v6c0 .55-.45 1-1 1s-1-.45-1-1V5zm6 6c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
                      </svg>
                    )}
                  </button>

                  {/* Waveform bars when recording */}
                  {isRecording && (
                    <div className="flex items-end gap-1 mt-5 h-8">
                      {[...Array(9)].map((_, i) => (
                        <div
                          key={i}
                          className="w-1.5 bg-red-400 rounded-full animate-pulse"
                          style={{
                            height: `${Math.random() * 24 + 8}px`,
                            animationDelay: `${i * 0.1}s`,
                            animationDuration: `${0.5 + Math.random() * 0.5}s`
                          }}
                        />
                      ))}
                    </div>
                  )}

                  <div className={`mt-4 text-center ${isRecording ? "mt-3" : "mt-5"}`}>
                    <p className={`text-base font-bold ${isRecording ? "text-red-600 dark:text-red-400" : isProcessing ? "text-violet-600 dark:text-violet-400" : "text-gray-800 dark:text-white"}`}>
                      {isRecording ? (
                        <span className="flex items-center gap-2 justify-center">
                          <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse inline-block" />
                          {t('listening') || "Recording"} · {formatTime(recordingSeconds)}
                        </span>
                      ) : isProcessing ? (t('processing') || "AI Processing...") : (t('voice_logging') || "Tap to Record")}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
                      {isRecording
                        ? (t('speak_expenses_clearly') || "Speak your expenses clearly, then tap to stop")
                        : isProcessing
                        ? (t('ai_parsing_audio') || "AI is parsing your audio...")
                        : (t('tap_to_record') || "Speak naturally, AI will extract expense details")}
                    </p>
                    {!isRecording && !isProcessing && (
                      <p className="text-xs text-gray-400 dark:text-slate-500 mt-2 italic bg-gray-100 dark:bg-slate-800 rounded-lg px-3 py-1.5 inline-block">
                        {t('voice_example') || '"Labour 5000 and cement 2000"'}
                      </p>
                    )}
                  </div>
                </div>

                <DetectedList />
              </div>
            )}

            {/* ── IMAGE TAB ── */}
            {tab === "IMAGE" && (
              <div className="space-y-4">
                {/* Drop zone / preview */}
                <div
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => !isProcessing && fileInputRef.current?.click()}
                  className={`relative flex flex-col items-center justify-center rounded-3xl border-2 border-dashed transition-all cursor-pointer overflow-hidden bg-gray-50 dark:bg-slate-800/30 ${
                    isDragging
                      ? "border-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 scale-[1.01]"
                      : imagePreview
                      ? "border-emerald-300/50 dark:border-emerald-500/30 p-2"
                      : "border-gray-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-500/40 hover:bg-emerald-50/50 dark:hover:bg-emerald-500/5"
                  }`}
                  style={{ minHeight: "220px" }}
                >
                  {imagePreview ? (
                    <div className="relative w-full h-[240px] flex items-center justify-center bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-slate-800">
                      {/* Preview image */}
                      <img
                        src={imagePreview}
                        alt="Receipt preview"
                        className="w-full h-full object-contain p-2"
                      />
                      {/* Overlay when processing */}
                      {isProcessing && (
                        <div className="absolute inset-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm flex flex-col items-center justify-center gap-3">
                          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                          <p className="text-gray-900 dark:text-white font-bold text-sm">Scanning receipt...</p>
                          <p className="text-gray-500 dark:text-slate-400 text-xs">AI is extracting details</p>
                        </div>
                      )}
                      {/* Tap to change */}
                      {!isProcessing && (
                        <div className="absolute bottom-3 right-3">
                          <button
                            onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                            className="text-xs bg-black/60 backdrop-blur-md text-white px-3 py-1.5 rounded-full hover:bg-black/80 transition-colors font-semibold shadow-lg flex items-center gap-1.5"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                            Change
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center py-10 px-6 text-center gap-4">
                      {/* Icon */}
                      <div className={`w-20 h-20 rounded-3xl flex items-center justify-center transition-all ${isDragging ? "bg-emerald-100 dark:bg-emerald-500/20 scale-110" : "bg-emerald-50 dark:bg-emerald-500/10"}`}>
                        <svg className={`w-9 h-9 ${isDragging ? "text-emerald-600" : "text-emerald-500"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>

                      <div>
                        <p className="font-bold text-gray-900 dark:text-white text-base">
                          {isDragging ? "Drop your receipt here" : (t('scan_receipt') || "Scan Receipt")}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-slate-400 mt-1 max-w-xs">
                          {t('scan_receipt_desc') || "Upload or drag a receipt photo — AI will auto-fill amount & category"}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 mt-1">
                        <span className="flex-1 h-px bg-gray-200 dark:bg-slate-700" />
                        <span className="text-xs text-gray-400 dark:text-slate-500">or</span>
                        <span className="flex-1 h-px bg-gray-200 dark:bg-slate-700" />
                      </div>

                      <div className="flex gap-2">
                        <div className="flex items-center gap-1.5 bg-emerald-500 text-white px-4 py-2.5 rounded-xl font-bold text-sm shadow-sm shadow-emerald-500/25 hover:bg-emerald-600 transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                          {t('choose_image') || "Upload Receipt"}
                        </div>
                      </div>
                      <p className="text-[11px] text-gray-400 dark:text-slate-500">Supports JPG, PNG, HEIC · Max 10MB</p>
                    </div>
                  )}
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={handleImageUpload}
                  disabled={isProcessing}
                />

                {/* AI results */}
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
