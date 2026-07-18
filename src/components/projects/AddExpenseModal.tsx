"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { formatCurrency } from "@/lib/utils";
import { useTenantPreferences } from "@/components/providers/TenantProvider";
import { parseMultipleExpensesFromAudio, parseExpenseFromImage } from "@/app/actions/ai-parser";
import { toast } from "react-hot-toast";

export default function AddExpenseModal({ isOpen, onClose, projectId, currency, onAddExpenses }: any) {
  const { data: session } = useSession();
  const { t } = useTenantPreferences();

  const [tab, setTab] = useState<"MANUAL" | "VOICE" | "IMAGE">("MANUAL");
  
  // Staged Expenses (Global to modal)
  const [stagedExpenses, setStagedExpenses] = useState<{id: string, category: string, amount: number}[]>([]);

  // Smart Entry State
  const [smartText, setSmartText] = useState("");
  const [detectedExpenses, setDetectedExpenses] = useState<{id: string, category: string, amount: number}[]>([]);
  
  // Manual Entry State
  const [manualCategory, setManualCategory] = useState("");
  const [manualAmount, setManualAmount] = useState("");
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Voice recording state
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Parse smart text dynamically
  useEffect(() => {
    // Only auto-parse if there's actually text in the manual entry box
    if (smartText.trim() !== "") {
      const regex = /([a-zA-Z]+)\s+(\d+(?:\.\d+)?)/g;
      let match;
      const parsed = [];
      while ((match = regex.exec(smartText)) !== null) {
        parsed.push({
          id: Math.random().toString(36).substr(2, 9),
          category: match[1],
          amount: parseFloat(match[2]),
        });
      }
      setDetectedExpenses(parsed);
    } else if (tab === "MANUAL") {
      setDetectedExpenses([]);
    }
  }, [smartText, tab]);

  if (!isOpen) return null;

  const handleAddManual = () => {
    if (manualCategory && manualAmount) {
      setStagedExpenses(prev => [...prev, {
        id: Math.random().toString(36).substr(2, 9),
        category: manualCategory,
        amount: Number(manualAmount)
      }]);
      setManualCategory("");
      setManualAmount("");
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
    } catch (err) {
      toast.error(t('audio_error') || "Microphone access denied");
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
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
            amount: exp.amount
          }]);
          toast.success(t('voice_parsed') || "Image parsed successfully!");
        } else {
          toast.error(t('voice_parsed_err') || "AI couldn't understand the image.");
        }
        setIsProcessing(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      toast.error(t('audio_error') || "Error processing image");
      setIsProcessing(false);
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
        const res = await parseMultipleExpensesFromAudio(base64Data, blob.type);
        
        if (res.success && (res as any).data && Array.isArray((res as any).data)) {
          const newExpenses = (res as any).data.map((exp: any) => ({
            id: Math.random().toString(36).substr(2, 9),
            category: exp.category,
            amount: exp.amount
          }));
          setDetectedExpenses(newExpenses);
          toast.success(t('voice_parsed') || "Voice parsed successfully!");
        } else {
          toast.error(t('voice_parsed_err') || "AI couldn't understand the voice note.");
        }
        setIsProcessing(false);
      };
      reader.readAsDataURL(blob);
    } catch (err) {
      toast.error(t('audio_error') || "Error processing audio");
      setIsProcessing(false);
    }
  };

  const removeStaged = (id: string) => {
    setStagedExpenses(prev => prev.filter(e => e.id !== id));
  };

  const removeDetected = (id: string) => {
    setDetectedExpenses(prev => prev.filter(e => e.id !== id));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Include any un-added manual entry just in case
      let finalExpenses = [...stagedExpenses];
      if (manualCategory && manualAmount) {
        finalExpenses.push({
          id: Math.random().toString(36).substr(2, 9),
          category: manualCategory,
          amount: Number(manualAmount)
        });
      }
      // Include any un-added detected entries from smart text or voice
      if (detectedExpenses.length > 0) {
        finalExpenses = [...finalExpenses, ...detectedExpenses];
      }

      if (finalExpenses.length > 0) {
        await onAddExpenses(projectId, finalExpenses.map(e => ({ category: e.category, amount: e.amount })));
      }
      
      // Reset & Close
      setStagedExpenses([]);
      setSmartText("");
      setManualCategory("");
      setManualAmount("");
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end sm:justify-center items-center bg-gray-900/60 backdrop-blur-sm p-0 sm:p-4 pb-[72px] sm:pb-4 animate-in fade-in">
      <div className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-full sm:max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{t('add_expense')}</h2>
            <p className="text-gray-500 text-sm mt-1">
              {tab === "MANUAL" && t('add_expense_manual_desc')}
              {tab === "VOICE" && t('voice_entry_desc')}
              {tab === "IMAGE" && t('image_entry_desc')}
            </p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors shadow-sm">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <div className="p-5 flex-grow overflow-y-auto flex flex-col">
          {/* Tabs */}
          <div className="flex border-b border-gray-100 p-2 gap-2 mb-6 shrink-0">
            <button
              onClick={() => setTab("MANUAL")}
              className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 rounded-xl transition-all ${
                tab === "MANUAL" ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M8 14h8"></path>
              </svg>
              {t('manual') || "Manual"}
            </button>
            <button
              onClick={() => setTab("IMAGE")}
              className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 rounded-xl transition-all ${
                tab === "IMAGE" ? 'bg-green-50 text-green-700' : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
              {t('image') || "Scan"}
            </button>
            <button
              onClick={() => setTab("VOICE")}
              className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 rounded-xl transition-all ${
                tab === "VOICE" ? 'bg-accent-100 text-accent-800' : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path></svg>
              {t('voice') || "Voice"}
            </button>
          </div>

          <div className="shrink-0 mb-6">
            {tab === "MANUAL" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{t('type_or_use_voice')}</label>
                  <textarea 
                    value={smartText}
                    onChange={(e) => setSmartText(e.target.value)}
                    placeholder='e.g. "Labour 8500 cement 12000"'
                    rows={3}
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500 transition-shadow resize-none font-medium"
                  />
                </div>

                {detectedExpenses.length > 0 && (
                  <div className="bg-accent-50/50 border border-accent-100 rounded-xl p-4">
                    <div className="flex justify-between items-center mb-3">
                      <p className="text-xs font-bold text-accent-700 uppercase tracking-wider">{t('detected')} ({detectedExpenses.length})</p>
                      <button onClick={handleAddVoice} className="text-xs font-bold bg-accent-600 text-white px-3 py-1.5 rounded-lg hover:bg-accent-700 transition-colors shadow-sm">
                        {t('add_all')}
                      </button>
                    </div>
                    <div className="space-y-2">
                      {detectedExpenses.map((exp) => (
                        <div key={exp.id} className="flex justify-between items-center bg-white p-2.5 rounded-lg border border-accent-100/50 shadow-sm">
                          <span className="font-bold text-gray-900 capitalize text-sm">{exp.category}</span>
                          <div className="flex items-center gap-3">
                            <span className="font-bold text-accent-600 text-sm">{formatCurrency(exp.amount, currency)}</span>
                            <button onClick={() => removeDetected(exp.id)} className="w-7 h-7 flex items-center justify-center rounded-full text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {tab === "VOICE" && (
              <div className="space-y-4">
                <div className="flex flex-col items-center justify-center py-10">
                  <div className="relative mb-6">
                    {isRecording && (
                      <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-20 scale-150"></div>
                    )}
                    <button
                      type="button"
                      onClick={isRecording ? stopRecording : startRecording}
                      disabled={isProcessing}
                      className={`relative w-20 h-20 rounded-full flex items-center justify-center transition-all ${
                        isRecording 
                          ? 'bg-red-50 text-red-500 border-2 border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.3)]' 
                          : 'bg-accent-100 text-accent-600 hover:bg-accent-200 hover:scale-105'
                      } disabled:opacity-50 disabled:scale-100`}
                    >
                      {isProcessing ? (
                        <span className="w-8 h-8 border-4 border-accent-500 border-t-transparent rounded-full animate-spin"></span>
                      ) : (
                        <svg className={`w-8 h-8 ${isRecording ? 'animate-pulse' : ''}`} fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm-1-9c0-.55.45-1 1-1s1 .45 1 1v6c0 .55-.45 1-1 1s-1-.45-1-1V5zm6 6c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
                        </svg>
                      )}
                    </button>
                  </div>
                  
                  <div className="text-center">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      {isRecording ? (t('listening') || "Listening...") : isProcessing ? (t('processing') || "Processing...") : (t('voice_logging') || "Voice Logging")}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {isRecording 
                        ? (t('speak_expenses_clearly') || "Speak your expenses clearly...") 
                        : isProcessing 
                          ? (t('ai_parsing_audio') || "AI is parsing your audio...") 
                          : (t('tap_to_record') || "Tap to record and speak naturally.")}
                    </p>
                    {!isRecording && !isProcessing && (
                      <p className="text-xs text-gray-400 mt-2 italic">{t('voice_example') || '"Labour 5000 and cement 2000"'}</p>
                    )}
                  </div>
                </div>

                {detectedExpenses.length > 0 && (
                  <div className="bg-accent-50/50 border border-accent-100 rounded-xl p-4 mt-4">
                    <div className="flex justify-between items-center mb-3">
                      <p className="text-xs font-bold text-accent-700 uppercase tracking-wider">{t('detected')} ({detectedExpenses.length})</p>
                      <button onClick={handleAddVoice} className="text-xs font-bold bg-accent-600 text-white px-3 py-1.5 rounded-lg hover:bg-accent-700 transition-colors shadow-sm">
                        {t('add_all')}
                      </button>
                    </div>
                    <div className="space-y-2">
                      {detectedExpenses.map((exp) => (
                        <div key={exp.id} className="flex justify-between items-center bg-white p-2.5 rounded-lg border border-accent-100/50 shadow-sm">
                          <span className="font-bold text-gray-900 capitalize text-sm">{exp.category}</span>
                          <div className="flex items-center gap-3">
                            <span className="font-bold text-accent-600 text-sm">{formatCurrency(exp.amount, currency)}</span>
                            <button onClick={() => removeDetected(exp.id)} className="w-7 h-7 flex items-center justify-center rounded-full text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {tab === "IMAGE" && (
              <div className="flex flex-col items-center justify-center py-8 text-center space-y-4">
                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center text-green-500 text-3xl mb-2">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{t('scan_receipt') || "Scan Receipt"}</h3>
                  <p className="text-gray-500 text-sm mt-1 max-w-xs">{t('scan_receipt_desc') || "Upload a photo of your receipt or bill. AI will extract the amount and details for you."}</p>
                </div>
                
                <label className="mt-4 cursor-pointer bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-bold transition-colors inline-block">
                  {isProcessing ? (t('processing') || "Processing...") : (t('choose_image') || "Choose Image")}
                  <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handleImageUpload} disabled={isProcessing} />
                </label>
              </div>
            )}
          </div>

          {/* Staged Expenses List */}
          {stagedExpenses.length > 0 && (
            <div className="mt-2 pt-6 border-t border-gray-100 flex-grow">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-900">{t('expenses_to_save') || "Expenses to Save"} ({stagedExpenses.length})</h3>
                <span className="text-sm font-bold text-amber-600">
                  {formatCurrency(stagedExpenses.reduce((sum, e) => sum + e.amount, 0), currency)}
                </span>
              </div>
              <div className="space-y-2">
                {stagedExpenses.map((exp) => (
                  <div key={exp.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <span className="font-bold text-gray-700 capitalize text-sm">{exp.category}</span>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-gray-900 text-sm">{formatCurrency(exp.amount, currency)}</span>
                      <button onClick={() => removeStaged(exp.id)} className="text-red-500 hover:bg-red-50 p-1 rounded-full border border-transparent hover:border-red-100 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-gray-100 bg-gray-50 flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors">
            {t('cancel') || "Cancel"}
          </button>
          <button 
            onClick={handleSubmit}
            disabled={isSubmitting || (stagedExpenses.length === 0 && (!manualAmount || !manualCategory) && detectedExpenses.length === 0)}
            className="flex-[2] py-3 bg-accent-500 text-white font-bold rounded-xl hover:bg-accent-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm flex justify-center items-center gap-2"
          >
            {isSubmitting ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              (() => {
                const totalItems = stagedExpenses.length + (manualCategory && manualAmount ? 1 : 0) + (tab === 'VOICE' ? detectedExpenses.length : 0);
                return totalItems > 0 ? `${t('save') || "Save"} (${totalItems})` : (t('save_expense') || "Save Expense");
              })()
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
