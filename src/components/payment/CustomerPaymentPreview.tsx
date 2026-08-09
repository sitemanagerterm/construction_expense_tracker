"use client";

import React from "react";
import { formatCurrency } from "@/lib/utils";
import { 
  Briefcase, FileText, Wrench, ClipboardList, ChevronRight, 
  Landmark, Copy, Info, Lock, Globe, CheckCheck, CheckCircle2, 
  Mail, MessageSquare, Circle, ShieldCheck
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

export interface CustomerPaymentPreviewProps {
  project: {
    id: string;
    name: string;
    location: string;
    status: string;
    budget: number;
    clientName?: string;
  };
  financials: {
    totalReceived: number;
    balanceAmount: number;
    progress: number;
  };
  recentCredits: Array<{
    id?: string;
    date: string | Date;
    amount: number;
    notes?: string;
    method?: string;
  }>;
  requestAmount: string;
  paymentFor: string;
  dueDate: Date | null;
  notes: string;
  currency: string;
  tenantName: string;
  bankDetails?: {
    accountName?: string | null;
    accountNumber?: string | null;
    ifscCode?: string | null;
    upiId?: string | null;
    gpayNumber?: string | null;
  };
}

export default function CustomerPaymentPreview({
  project,
  financials,
  recentCredits,
  requestAmount,
  paymentFor,
  dueDate,
  notes,
  currency,
  tenantName,
  bankDetails
}: CustomerPaymentPreviewProps) {
  
  const formattedDueDate = dueDate ? dueDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '-';
  const numericRequestAmount = Number(requestAmount) || 0;

  return (
    <div className="font-sans text-[#1e293b] bg-[#f8fafc] w-full max-w-[1200px] mx-auto h-auto min-h-screen p-4 sm:p-8 overflow-hidden relative" style={{ fontFamily: "'Inter', sans-serif" }}>
        
        <div className="flex flex-col lg:flex-row gap-8 items-start h-full">
            
            {/* LEFT COLUMN: MAIN CONTENT */}
            <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 p-5 sm:px-8 sm:pb-8 sm:pt-6 w-full h-full flex flex-col">
                
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-gray-100 pb-4 sm:pb-2 mb-5 gap-3 sm:gap-0">
                    <div className="flex items-center gap-3">
                        <img src="/mysitebook-logo-dark.png" alt="MySiteBook" className="h-[60px] sm:h-[75px] scale-100 sm:scale-110 origin-left object-contain" />
                    </div>
                    <div className="bg-[#eaf5ef] text-[#168a4a] px-3 py-1.5 rounded-lg font-bold text-[13px] flex items-center gap-1.5 shadow-sm border border-[#d1e8db] shrink-0">
                        <ShieldCheck className="w-4 h-4" />
                        Secure Payment Link
                    </div>
                </div>

                <h2 className="text-[26px] font-bold text-[#0f172a] uppercase tracking-tight mb-5">Payment Request</h2>
                
                <p className="text-[15px] font-bold text-[#0f172a] mb-1">Hello {project.clientName || 'Client'},</p>
                <p className="text-[14px] font-medium text-slate-600 mb-6">We have raised a payment request. Please find the details below.</p>

                {/* Project Image & Info */}
                <div className="border border-gray-200 rounded-xl flex mb-6 bg-white shadow-sm overflow-hidden min-h-[140px] shrink-0">
                    <div className="flex-1 flex flex-col justify-center py-4 px-6">
                        <p className="text-[11px] font-bold text-slate-600 mb-1">Project Name</p>
                        <div className="flex items-center gap-3 mb-3">
                            <h3 className="text-[22px] font-bold text-[#0f172a] tracking-tight">{project.name}</h3>
                            <span className="bg-[#eaf5ef] text-[#168a4a] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">{project.status}</span>
                        </div>
                        <div className="space-y-2 text-[13px]">
                            <p><span className="font-bold text-slate-700 w-32 inline-block">Project Location:</span> <span className="text-slate-600">{project.location || '-'}</span></p>
                        </div>
                    </div>
                </div>

                {/* Stats & Progress Box */}
                <div className="border border-gray-200 rounded-xl p-4 bg-white shadow-sm mb-6 shrink-0">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                        <div className="border border-gray-100 rounded-xl p-3.5 flex flex-col bg-white">
                            <div className="flex justify-between items-start mb-2">
                                <p className="text-[12px] font-semibold text-slate-600">Project Value</p>
                                <div className="bg-blue-50 text-blue-600 w-7 h-7 rounded flex items-center justify-center shrink-0">
                                    <Briefcase className="w-[12px] h-[12px]" />
                                </div>
                            </div>
                            <p className="text-[20px] sm:text-[22px] font-bold text-[#1d4ed8] tracking-tight truncate">{formatCurrency(project.budget || 0, currency)}</p>
                        </div>
                        
                        <div className="border border-gray-100 rounded-xl p-3.5 flex flex-col bg-white">
                            <div className="flex justify-between items-start mb-2">
                                <p className="text-[12px] font-semibold text-slate-600">Total Received</p>
                                <div className="bg-emerald-50 text-emerald-600 w-7 h-7 rounded flex items-center justify-center shrink-0">
                                    <FileText className="w-[12px] h-[12px]" />
                                </div>
                            </div>
                            <p className="text-[20px] sm:text-[22px] font-bold text-[#15803d] tracking-tight truncate">{formatCurrency(financials.totalReceived || 0, currency)}</p>
                        </div>
                        
                        <div className="border border-gray-100 rounded-xl p-3.5 flex flex-col bg-white">
                            <div className="flex justify-between items-start mb-2">
                                <p className="text-[12px] font-semibold text-slate-600">Current Balance</p>
                                <div className="bg-red-50 text-red-500 w-7 h-7 rounded flex items-center justify-center shrink-0">
                                    <Wrench className="w-[12px] h-[12px]" />
                                </div>
                            </div>
                            <p className="text-[20px] sm:text-[22px] font-bold text-[#dc2626] tracking-tight truncate">{formatCurrency(financials.balanceAmount || 0, currency)}</p>
                        </div>
                    </div>
                    
                    <hr className="border-gray-100 mb-4 -mx-4 px-4" />

                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <p className="text-[12px] font-semibold text-slate-600">Payment Progress</p>
                            <p className="font-bold text-[#15803d] text-[14px] leading-none">{financials.progress}%</p>
                        </div>
                        <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-[#15803d] rounded-full" style={{ width: `${financials.progress}%` }}></div>
                        </div>
                    </div>
                </div>

                {/* Credit History */}
                <div className="border border-gray-200 rounded-xl overflow-hidden mb-6 bg-white shrink-0">
                    <div className="px-5 py-4 flex items-center gap-4">
                        <div className="bg-blue-50 text-blue-800 w-11 h-11 rounded-lg flex items-center justify-center">
                            <ClipboardList className="w-[20px] h-[20px]" />
                        </div>
                        <div className="flex flex-col justify-center">
                            <h3 className="font-bold text-[16px] text-[#0f172a] uppercase tracking-wide mb-1 leading-none">Credit History</h3>
                            <p className="text-[13px] text-slate-500 font-medium leading-none">All payments received against this project</p>
                        </div>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full text-[13.5px]">
                            <thead className="bg-slate-50 border-y border-gray-100 text-slate-600">
                                <tr>
                                    <th className="py-3 px-5 text-left font-bold whitespace-nowrap">Date</th>
                                    <th className="py-3 px-5 text-left font-bold whitespace-nowrap">Description</th>
                                    <th className="py-3 px-5 text-right font-bold whitespace-nowrap">Amount Received</th>
                                </tr>
                            </thead>
                            <tbody className="text-slate-700 font-medium divide-y divide-gray-100">
                                {recentCredits.map((credit, idx) => {
                                    const formatPaymentLabel = (label: string) => {
                                        if (!label) return 'Payment';
                                        return label.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
                                    };
                                    return (
                                    <tr key={credit.id || idx}>
                                        <td className="py-4 px-5 whitespace-nowrap">{new Date(credit.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                                        <td className="py-4 px-5">{credit.notes || formatPaymentLabel(credit.method || '')}</td>
                                        <td className="py-4 px-5 text-right text-[#15803d] font-bold whitespace-nowrap">{formatCurrency(credit.amount, currency)}</td>
                                    </tr>
                                    );
                                })}
                                {recentCredits.length === 0 && (
                                    <tr><td colSpan={3} className="py-6 text-center text-gray-500">No payment history available.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    
                    <div className="px-5 pb-5 pt-3 flex flex-col gap-3">
                        <div className="bg-emerald-50 border border-emerald-100 rounded-xl px-5 py-3.5 flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-2">
                            <span className="font-bold text-[#15803d] text-[15px]">Total Payment Received</span>
                            <span className="font-black text-[#15803d] text-[17px] break-all">{formatCurrency(financials.totalReceived || 0, currency)}</span>
                        </div>
                    </div>
                </div>

                {/* Payment Request Details */}
                <div className="border border-gray-200 rounded-xl p-5 sm:p-6 lg:p-8 bg-white shrink-0 mt-auto">
                    <div className="flex flex-col md:flex-row gap-6 md:gap-8 justify-between items-start md:items-center">
                        <div className="flex-1 w-full">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="text-blue-700">
                                    <FileText className="w-[22px] h-[22px]" />
                                </div>
                                <h3 className="font-bold text-[15px] text-[#1d4ed8] uppercase tracking-wide">Payment Request Details</h3>
                            </div>
                            
                            <div className="space-y-4 text-[14px]">
                                <div className="grid grid-cols-[140px_15px_1fr] items-center">
                                    <span className="font-bold text-[#1e293b]">Request Amount</span>
                                    <span className="text-slate-400 font-bold">:</span>
                                    <span className="font-bold text-blue-700 text-[18px]">{formatCurrency(numericRequestAmount, currency)}</span>
                                </div>
                                
                                <div className="grid grid-cols-[140px_15px_1fr] items-center">
                                    <span className="font-bold text-[#1e293b]">Payment For</span>
                                    <span className="text-slate-400 font-bold">:</span>
                                    <span className="font-medium text-[#1e293b]">{paymentFor || '-'}</span>
                                </div>
                                
                                <div className="grid grid-cols-[140px_15px_1fr] items-center">
                                    <span className="font-bold text-[#1e293b]">Due Date</span>
                                    <span className="text-slate-400 font-bold">:</span>
                                    <span className="font-bold text-red-500">{formattedDueDate}</span>
                                </div>
                                
                                <div className="grid grid-cols-[140px_15px_1fr] items-start">
                                    <span className="font-bold text-[#1e293b]">Notes</span>
                                    <span className="text-slate-400 font-bold">:</span>
                                    <span className="font-medium text-[#1e293b] leading-relaxed max-w-[280px]">{notes || '-'}</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="hidden md:flex w-[210px] h-[180px] bg-[#f8fafc] rounded-[16px] items-center justify-center shrink-0">
                            <svg width="140" height="140" viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <defs>
                                    <filter id="shadow_doc" x="-10%" y="-10%" width="130%" height="130%">
                                        <feDropShadow dx="0" dy="6" stdDeviation="10" floodColor="#0f172a" floodOpacity="0.06"/>
                                    </filter>
                                    <filter id="shadow_coin" x="-20%" y="-20%" width="140%" height="140%">
                                        <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#1d4ed8" floodOpacity="0.25"/>
                                    </filter>
                                    <linearGradient id="blue_grad" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#60a5fa"/>
                                        <stop offset="100%" stopColor="#1d4ed8"/>
                                    </linearGradient>
                                </defs>
                                <g filter="url(#shadow_doc)">
                                    <path d="M 35 25 H 85 L 105 45 V 105 A 6 6 0 0 1 99 111 H 41 A 6 6 0 0 1 35 105 Z" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1.5"/>
                                    <path d="M 85 25 V 40 A 5 5 0 0 0 90 45 H 105" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1.5" strokeLinejoin="round"/>
                                    <rect x="50" y="55" width="35" height="8" rx="4" fill="#bfdbfe"/>
                                    <rect x="50" y="75" width="40" height="4" rx="2" fill="#cbd5e1"/>
                                    <rect x="50" y="87" width="25" height="4" rx="2" fill="#cbd5e1"/>
                                </g>
                                <g filter="url(#shadow_coin)">
                                    <circle cx="100" cy="95" r="26" fill="url(#blue_grad)" stroke="#ffffff" strokeWidth="3"/>
                                    <circle cx="100" cy="95" r="21" fill="none" stroke="#93c5fd" strokeWidth="1.5" strokeOpacity="0.6"/>
                                    <text x="100" y="104" fill="#ffffff" fontSize="26" fontWeight="900" fontFamily="sans-serif" textAnchor="middle">₹</text>
                                </g>
                                <path d="M 22 35 Q 26 35 26 31 Q 26 35 30 35 Q 26 35 26 39 Q 26 35 22 35 Z" fill="#60a5fa"/>
                                <path d="M 108 25 Q 111 25 111 22 Q 111 25 114 25 Q 111 25 111 28 Q 111 25 108 25 Z" fill="#fcd34d"/>
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Bank Details Section */}
                <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-6 mt-6 shrink-0">
                    <p className="font-bold text-[#1e3a8a] text-[16px] mb-4 flex items-center gap-2">
                        <Landmark className="w-5 h-5 text-blue-600" /> Transfer to Bank Account
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="bg-white rounded-lg p-3.5 border border-gray-100 shadow-sm">
                            <p className="text-[11px] text-gray-500 font-semibold mb-1 uppercase tracking-wider">Account Name</p>
                            <p className="font-bold text-[#1e293b] text-[14px]">{bankDetails?.accountName || tenantName || '-'}</p>
                        </div>
                        <div className="bg-white rounded-lg p-3.5 border border-gray-100 shadow-sm flex justify-between items-center group cursor-pointer hover:border-blue-300 transition-colors">
                            <div>
                                <p className="text-[11px] text-gray-500 font-semibold mb-1 uppercase tracking-wider">Account Number</p>
                                <p className="font-bold text-[#1e293b] text-[14px]">{bankDetails?.accountNumber || '-'}</p>
                            </div>
                            <Copy className="w-4 h-4 text-gray-300 group-hover:text-blue-500" />
                        </div>
                        <div className="bg-white rounded-lg p-3.5 border border-gray-100 shadow-sm flex justify-between items-center group cursor-pointer hover:border-blue-300 transition-colors">
                            <div>
                                <p className="text-[11px] text-gray-500 font-semibold mb-1 uppercase tracking-wider">IFSC Code</p>
                                <p className="font-bold text-[#1e293b] text-[14px]">{bankDetails?.ifscCode || '-'}</p>
                            </div>
                            <Copy className="w-4 h-4 text-gray-300 group-hover:text-blue-500" />
                        </div>
                        {(bankDetails?.upiId || bankDetails?.gpayNumber) && (
                            <>
                                {bankDetails.upiId && (
                                    <div className="bg-white rounded-lg p-3.5 border border-gray-100 shadow-sm flex justify-between items-center group cursor-pointer hover:border-blue-300 transition-colors">
                                        <div>
                                            <p className="text-[11px] text-gray-500 font-semibold mb-1 uppercase tracking-wider">UPI ID</p>
                                            <p className="font-bold text-[#1e293b] text-[14px]">{bankDetails.upiId}</p>
                                        </div>
                                        <Copy className="w-4 h-4 text-gray-300 group-hover:text-blue-500" />
                                    </div>
                                )}
                                {bankDetails.gpayNumber && (
                                    <div className="bg-white rounded-lg p-3.5 border border-gray-100 shadow-sm flex justify-between items-center group cursor-pointer hover:border-blue-300 transition-colors">
                                        <div>
                                            <p className="text-[11px] text-gray-500 font-semibold mb-1 uppercase tracking-wider">GPay Number</p>
                                            <p className="font-bold text-[#1e293b] text-[14px]">{bankDetails.gpayNumber}</p>
                                        </div>
                                        <Copy className="w-4 h-4 text-gray-300 group-hover:text-blue-500" />
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>

            </div>

            {/* RIGHT COLUMN: SIDEBAR */}
            <div className="w-full lg:w-[380px] shrink-0 space-y-6">
                
                {/* Project Summary */}
                <div className="bg-white rounded-[12px] shadow-sm border border-gray-100 p-6">
                    <h3 className="font-black text-[#1e3a8a] uppercase tracking-wide text-[14px] mb-3">PROJECT SUMMARY</h3>
                    <hr className="border-gray-100 mb-5" />
                    <div className="space-y-4 text-[14px]">
                        <div className="grid grid-cols-[140px_15px_1fr] items-center">
                            <span className="font-bold text-[#1e293b]">Project Name</span>
                            <span className="text-slate-400 text-center">:</span>
                            <span className="font-medium text-[#1e293b]">{project.name}</span>
                        </div>
                        <div className="grid grid-cols-[140px_15px_1fr] items-center">
                            <span className="font-bold text-[#1e293b]">Project Value</span>
                            <span className="text-slate-400 text-center">:</span>
                            <span className="font-medium text-[#1e293b]">{formatCurrency(project.budget || 0, currency)}</span>
                        </div>
                        <div className="grid grid-cols-[140px_15px_1fr] items-center">
                            <span className="font-bold text-[#1e293b]">Status</span>
                            <span className="text-slate-400 text-center">:</span>
                            <span className="font-bold text-[#16a34a] bg-[#dcfce7] px-3 py-1 rounded-[8px] text-[12px] w-max uppercase">{project.status}</span>
                        </div>
                    </div>
                </div>

                {/* Amount Overview */}
                <div className="bg-white rounded-[12px] shadow-sm border border-gray-100 p-6">
                    <h3 className="font-black text-[#1e3a8a] uppercase tracking-wide text-[14px] mb-3">AMOUNT OVERVIEW</h3>
                    <hr className="border-gray-100 mb-5" />
                    <div className="space-y-4 text-[14px]">
                        <div className="flex justify-between items-center">
                            <span className="font-bold text-[#1e293b]">Project Value</span>
                            <span className="font-bold text-[#1e293b]">{formatCurrency(project.budget || 0, currency)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="font-bold text-[#1e293b]">Total Received</span>
                            <span className="font-bold text-[#16a34a]">{formatCurrency(financials.totalReceived || 0, currency)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="font-bold text-[#1e293b]">Balance Amount</span>
                            <span className="font-bold text-[#dc2626]">{formatCurrency(financials.balanceAmount || 0, currency)}</span>
                        </div>
                    </div>
                </div>


                {/* Payment Request Preview (Chat Bubble) */}
                <div className="bg-white rounded-[12px] shadow-sm border border-gray-100 p-6 relative overflow-hidden">
                    <h3 className="font-black text-[#1e3a8a] uppercase tracking-wide text-[14px] mb-4">WHATSAPP PREVIEW</h3>
                    
                    <div className="bg-[#efeae2] border border-[#e2dcd3] rounded-[8px] p-4 relative overflow-hidden shadow-inner">
                        <div className="bg-[#dcf8c6] rounded-[8px] p-4 shadow-sm relative text-[#111b21] mb-2">
                            <div className="flex items-center gap-3 border-b border-[#c0d8b1] pb-3 mb-3">
                                <img src="/mysitebook-logo-dark.png" alt="MySiteBook" className="h-9 object-contain" />
                                <span className="font-bold text-[#1e3a8a] text-[13px]">Payment Request</span>
                            </div>
                            
                            <p className="text-[13px] font-bold text-[#111b21] mb-1.5">Hello {project.clientName || 'Client'},</p>
                            <p className="text-[13px] text-[#111b21] mb-4 leading-relaxed">We have raised a payment request for the project <span className="font-bold">{project.name}</span>.</p>
                            
                            <div className="space-y-1.5 text-[13px] mb-4">
                                <div className="grid grid-cols-[115px_15px_1fr] items-center">
                                    <span className="font-bold text-[#111b21] whitespace-nowrap">Request Amount</span>
                                    <span className="text-gray-500 text-center">:</span>
                                    <span className="font-bold text-[#111b21]">{formatCurrency(numericRequestAmount, currency)}</span>
                                </div>
                                <div className="grid grid-cols-[115px_15px_1fr] items-center">
                                    <span className="font-bold text-[#111b21] whitespace-nowrap">Due Date</span>
                                    <span className="text-gray-500 text-center">:</span>
                                    <span className="font-bold text-[#111b21]">{formattedDueDate}</span>
                                </div>
                                <div className="grid grid-cols-[115px_15px_1fr] items-center">
                                    <span className="font-bold text-[#111b21] whitespace-nowrap">Balance Amount</span>
                                    <span className="text-gray-500 text-center">:</span>
                                    <span className="font-bold text-[#111b21]">{formatCurrency(financials.balanceAmount || 0, currency)}</span>
                                </div>
                            </div>
                            
                            <button className="w-full py-2 bg-[#f0fcf0] text-[#1d4ed8] border border-[#c0d8b1] rounded-[6px] text-[13px] font-bold flex items-center justify-center gap-2">
                                <Globe className="w-4 h-4" /> View & Pay Online
                            </button>
                        </div>
                        
                        <p className="text-[11px] text-gray-500 text-right flex justify-end items-center gap-1 mt-1 pr-1">10:30 AM <CheckCheck className="w-3.5 h-3.5 text-blue-500" /></p>
                    </div>
                </div>

            </div>
        </div>
    </div>
  );
}
