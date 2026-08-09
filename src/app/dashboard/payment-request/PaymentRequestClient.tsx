"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSiteContext } from "@/components/providers/SiteProvider";
import { formatCurrency } from "@/lib/utils";
import { getPaymentRequestData } from "@/app/actions/payment-request";
import { createPaymentRequest } from "@/app/actions/payment-links";
import { 
  Building2, FileText, Calendar, CreditCard, 
  MessageCircle, Mail, MessageSquare, ExternalLink,
  ChevronRight, ClipboardList
} from "lucide-react";
import toast from "react-hot-toast";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaWhatsapp } from "react-icons/fa";

type PaymentRequestClientProps = {
  currency: string;
  tenantName: string;
};

import { useTenantPreferences } from "@/components/providers/TenantProvider";

export default function PaymentRequestClient({ currency, tenantName }: PaymentRequestClientProps) {
  const { activeSiteId, activeProjects } = useSiteContext();
  const { t } = useTenantPreferences();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);

  // Form State
  const [requestAmount, setRequestAmount] = useState<string>("");
  const [paymentFor, setPaymentFor] = useState<string>("");
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [notes, setNotes] = useState<string>("");

  useEffect(() => {
    if (activeSiteId && activeSiteId !== "ALL") {
      fetchProjectData(activeSiteId);
    } else {
      setData(null);
    }
  }, [activeSiteId]);

  const fetchProjectData = async (id: string) => {
    setLoading(true);
    try {
      const res = await getPaymentRequestData(id);
      if (res.success) {
        setData(res.data);
      } else {
        toast.error("Failed to load project data");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (!activeSiteId || activeSiteId === "ALL") {
    return (
      <div className="flex-1 p-6 md:p-8 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 text-blue-500 rounded-2xl flex items-center justify-center mb-4">
          <Building2 className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Select a Site</h2>
        <p className="text-gray-500 dark:text-slate-400 text-center max-w-md">
          Please select a specific project from the dropdown in the header to generate a payment request.
        </p>
      </div>
    );
  }

  if (loading || !data) {
    return (
      <div className="flex-1 p-6 md:p-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-900"></div>
      </div>
    );
  }

  const { project, financials, recentCredits } = data;

  const handleWhatsAppShare = async () => {
    if (!requestAmount || !paymentFor) {
      toast.error("Please fill required fields (Amount and Payment For)");
      return;
    }
    
    const loadingToast = toast.loading("Generating secure link...");
    try {
      const response = await createPaymentRequest({
        projectId: project.id,
        amount: Number(requestAmount),
        paymentFor,
        dueDate: dueDate ? dueDate.toISOString() : null,
        notes
      });
      
      if (!response.success || !response.data) {
        toast.error(response.error || "Failed to create payment link", { id: loadingToast });
        return;
      }
      
      toast.success("Link generated!", { id: loadingToast });
      const viewLink = `${window.location.origin}/pay/${response.data.id}`;
      const text = generateMessageText(viewLink);
      const waUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
      window.open(waUrl, '_blank');
    } catch (e) {
      toast.error("Something went wrong", { id: loadingToast });
    }
  };

  const generateMessageText = (customLink?: string) => {
    const formattedDate = dueDate ? dueDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A';
    const formattedRequestAmount = formatCurrency(Number(requestAmount) || 0, currency);
    
    const viewLink = customLink || `${window.location.origin}/pay/req_...`;
    
    let msg = `*PAYMENT REQUEST*\n\nHello ${project.clientName || 'Client'},\nWe have raised a payment request for the project *${project.name}*.\n\n*Request Amount:* ${formattedRequestAmount}\n*Due Date:* ${formattedDate}\n*Balance Amount:* ${formatCurrency(financials.balanceAmount || 0, currency)}\n\n*Payment For:* ${paymentFor || 'N/A'}\n`;
    if (notes) {
      msg += `*Notes:* ${notes}\n\n`;
    } else {
      msg += `*Notes:* N/A\n\n`;
    }
    msg += `*View & Pay Online:*\n${viewLink}\n\n`;
    msg += `Thank you for your trust and timely payments.\n- ${tenantName}`;
    return msg;
  };

  return (
    <div className="flex-1 bg-slate-50 dark:bg-slate-900 min-h-screen pb-20">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 px-6 py-5 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-primary-900 dark:text-white tracking-tight uppercase">{t("payment_request")}</h1>
            <p className="text-sm font-medium text-slate-500 mt-1">
              {t("payment_request_desc")}
            </p>
          </div>

        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Form and Data */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Greeting */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-100 dark:border-slate-700 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Hello {project.clientName || 'Client'},</h2>
            <p className="text-gray-600 dark:text-slate-400">We have raised a payment request. Please find the details below.</p>
            
            {/* Project Summary Card */}
            <div className="mt-6 flex flex-col sm:flex-row gap-6 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-gray-100 dark:border-slate-700">
              <div className="w-full sm:w-1/3 h-32 bg-gray-200 dark:bg-slate-700 rounded-lg overflow-hidden relative">
                {/* Placeholder Image for Project */}
                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                  <Building2 className="w-10 h-10 opacity-50" />
                </div>
              </div>
              <div className="flex-1 flex flex-col justify-center">
                <div className="flex justify-between items-start mb-1">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Project Name</p>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded text-[10px] font-bold uppercase">{project.status}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{project.name}</h3>
                
                <p className="text-sm text-gray-600 dark:text-slate-400 mb-1">
                  <span className="font-semibold text-gray-800 dark:text-slate-200 mr-2">Project Code:</span> 
                  {project.id.substring(0,8).toUpperCase()}
                </p>
                <p className="text-sm text-gray-600 dark:text-slate-400">
                  <span className="font-semibold text-gray-800 dark:text-slate-200 mr-2">Project Location:</span> 
                  {project.location}
                </p>
              </div>
            </div>

            {/* Amount Overview Grid */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl p-4 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase mb-1">Project Value</p>
                  <p className="text-xl font-black text-blue-600 dark:text-blue-400">{formatCurrency(project.budget || 0, currency)}</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400 flex-shrink-0">
                  <Building2 className="w-5 h-5" />
                </div>
              </div>
              <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl p-4 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase mb-1">Total Received</p>
                  <p className="text-xl font-black text-emerald-600 dark:text-emerald-400">{formatCurrency(financials.totalReceived || 0, currency)}</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 flex-shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
              </div>
              <div className="bg-white dark:bg-slate-800 border border-red-100 dark:border-red-500/30 rounded-xl p-4 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase mb-1">Current Balance</p>
                  <p className="text-xl font-black text-red-600 dark:text-red-400">{formatCurrency(financials.balanceAmount || 0, currency)}</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-red-50 dark:bg-red-500/10 flex items-center justify-center text-red-600 dark:text-red-400 flex-shrink-0">
                  <CreditCard className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Payment Progress */}
            <div className="mt-6 flex items-center justify-between text-xs font-bold text-gray-500 uppercase mb-2">
              <span>Payment Progress</span>
              <span className="text-emerald-600">{financials.progress}%</span>
            </div>
            <div className="w-full h-2 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${financials.progress}%` }}></div>
            </div>
          </div>

          {/* Credit History */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-100 dark:border-slate-700 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                <ClipboardList className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white uppercase tracking-wider">Credit History</h3>
                <p className="text-xs text-gray-500">All payments received against this project</p>
              </div>
            </div>

            <div className="w-full">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 uppercase bg-gray-50 dark:bg-slate-900/50">
                  <tr>
                    <th className="px-2 sm:px-4 py-3 font-bold w-[25%]">Date</th>
                    <th className="px-2 sm:px-4 py-3 font-bold w-[45%]">Description</th>
                    <th className="px-2 sm:px-4 py-3 font-bold text-right w-[30%]">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                  {recentCredits.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-2 sm:px-4 py-8 text-center text-gray-500">No payments received yet.</td>
                    </tr>
                  ) : (
                    recentCredits.map((credit: any) => (
                      <tr key={credit.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/50">
                        <td className="px-2 sm:px-4 py-3 text-gray-900 dark:text-white font-medium">{new Date(credit.date).toLocaleDateString(undefined, { day: '2-digit', month: 'short' })}</td>
                        <td className="px-2 sm:px-4 py-3 text-gray-600 dark:text-slate-400 break-words">{credit.notes || credit.method}</td>
                        <td className="px-2 sm:px-4 py-3 text-right text-emerald-600 font-bold">{formatCurrency(credit.amount, currency)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
                {recentCredits.length > 0 && (
                  <tfoot>
                    <tr className="bg-emerald-50 dark:bg-emerald-500/10 border-t-2 border-emerald-100 dark:border-emerald-500/30">
                      <td colSpan={2} className="px-2 sm:px-4 py-4 text-emerald-800 dark:text-emerald-400 font-bold text-sm sm:text-base">Total Received</td>
                      <td className="px-2 sm:px-4 py-4 text-right text-emerald-700 dark:text-emerald-300 font-black text-base sm:text-lg">{formatCurrency(financials.totalReceived, currency)}</td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
            
            <button className="mt-6 mb-2 w-full flex items-center justify-between px-4 py-3.5 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 text-sm font-bold rounded-xl border border-blue-100 dark:border-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors shadow-sm">
              <span className="flex items-center gap-2 truncate"><FileText className="w-4 h-4 flex-shrink-0" /> <span className="truncate">View Complete Credit History, Bills & Documents</span></span>
              <ChevronRight className="w-4 h-4 flex-shrink-0" />
            </button>
          </div>

          {/* Payment Request Details Form */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-100 dark:border-slate-700 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white uppercase tracking-wider">Payment Request Details</h3>
            </div>

            <div className="space-y-4 max-w-xl">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <label className="sm:w-32 text-sm font-bold text-gray-700 dark:text-slate-300">Request Amount</label>
                <div className="flex-1 relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold">{currency}</span>
                  <input 
                    type="number"
                    value={requestAmount}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === '') {
                        setRequestAmount('');
                        return;
                      }
                      const num = Number(val);
                      const maxBalance = financials?.balanceAmount || 0;
                      if (num > maxBalance) {
                        setRequestAmount(maxBalance.toString());
                        toast.error(`Amount cannot exceed the current balance of ${formatCurrency(maxBalance, currency)}`, { id: 'max-balance-toast' });
                      } else {
                        setRequestAmount(val);
                      }
                    }}
                    max={financials?.balanceAmount || 0}
                    className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg pl-12 pr-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder={(financials?.balanceAmount || 50000).toString()}
                  />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <label className="sm:w-32 text-sm font-bold text-gray-700 dark:text-slate-300">Payment For</label>
                <div className="flex-1">
                  <input 
                    type="text"
                    value={paymentFor}
                    onChange={(e) => setPaymentFor(e.target.value)}
                    className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="e.g. First Floor RCC Completed"
                  />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <label className="sm:w-32 text-sm font-bold text-gray-700 dark:text-slate-300">Due Date</label>
                <div className="flex-1">
                  <div className="relative">
                    <DatePicker
                      selected={dueDate}
                      onChange={(date: Date | null) => setDueDate(date)}
                      dateFormat="dd/MM/yyyy"
                      placeholderText="Select Date"
                      className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                      wrapperClassName="w-full"
                    />
                    <Calendar className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                <label className="sm:w-32 text-sm font-bold text-gray-700 dark:text-slate-300 mt-2">Notes</label>
                <div className="flex-1">
                  <textarea 
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none h-24 resize-none"
                    placeholder="Requesting payment for the completed Structure work..."
                  ></textarea>
                </div>
              </div>
            </div>

            <div className="mt-8">
                <div className="flex items-center justify-center gap-2 mb-3 text-emerald-700 font-bold">
                  <FaWhatsapp className="w-5 h-5" />
                  Share Payment Request
                </div>
                <p className="text-xs text-gray-500 text-center mb-4">Click the button below to share this request directly via WhatsApp.</p>
                <button 
                  onClick={handleWhatsAppShare}
                  disabled={!requestAmount || !paymentFor}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-lg shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 uppercase tracking-wide"
                >
                  <FaWhatsapp className="w-5 h-5" />
                  Share via WhatsApp
                </button>
            </div>

            <p className="text-xs text-gray-400 text-center mt-6 mb-4">Thank you for your trust and timely payments.<br/>- {tenantName}</p>
          </div>
        </div>

        {/* Right Column: Preview and Share */}
        <div className="space-y-6">
          <div className="bg-[#e7f1eb] dark:bg-emerald-950/20 rounded-2xl p-5 border border-[#d1e6d9] dark:border-emerald-900/30 sticky top-24">
            <h3 className="text-sm font-bold text-gray-700 dark:text-slate-300 uppercase tracking-wider mb-4 flex items-center gap-2">
              <FaWhatsapp className="w-4 h-4 text-emerald-600" />
              WhatsApp Preview
            </h3>
            
            <div className="w-full relative rounded-2xl p-6 shadow-sm bg-white border border-[#d1e6d9]">
              <div className="whitespace-pre-wrap text-sm text-gray-700 font-medium font-sans">
                {generateMessageText()}
              </div>
            </div>

            <div className="mt-6">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Send Via</h4>
              <button 
                onClick={handleWhatsAppShare}
                className="w-full flex items-center justify-between bg-white dark:bg-slate-800 p-3 rounded-xl border border-gray-200 dark:border-slate-700 hover:border-emerald-500 transition-colors group mb-3 shadow-sm cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                    <FaWhatsapp className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-gray-900 dark:text-white text-sm">WhatsApp</p>
                    <p className="text-xs text-gray-500">Send via WhatsApp</p>
                  </div>
                </div>
                <div className="w-5 h-5 rounded-full border-2 border-emerald-500 flex items-center justify-center bg-emerald-500 text-white">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                </div>
              </button>
              
              <div className="opacity-50 pointer-events-none w-full flex items-center justify-between bg-white dark:bg-slate-800 p-3 rounded-xl border border-gray-200 dark:border-slate-700 mb-3 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-gray-900 dark:text-white text-sm">Email</p>
                    <p className="text-xs text-gray-500">Send via Email (Coming Soon)</p>
                  </div>
                </div>
                <div className="w-5 h-5 rounded-full border-2 border-gray-300"></div>
              </div>

              <div className="opacity-50 pointer-events-none w-full flex items-center justify-between bg-white dark:bg-slate-800 p-3 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-gray-900 dark:text-white text-sm">SMS</p>
                    <p className="text-xs text-gray-500">Send via SMS (Coming Soon)</p>
                  </div>
                </div>
                <div className="w-5 h-5 rounded-full border-2 border-gray-300"></div>
              </div>
            </div>
            
          </div>
        </div>
        
      </div>
    </div>
  );
}
