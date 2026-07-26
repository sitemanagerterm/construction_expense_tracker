"use client";

import React, { useState } from "react";
import { formatCurrency } from "@/lib/utils";
import { useTenantPreferences } from "@/components/providers/TenantProvider";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import toast from "react-hot-toast";

export default function ProjectReportModal({ isOpen, onClose, project, currency }: any) {
  const [isGenerating, setIsGenerating] = useState(false);
  const { t } = useTenantPreferences();

  if (!isOpen) return null;

  const expensesList = project?.expenses || [];
  const creditsList = project?.credits || [];

  const totalExpenses = expensesList.reduce((sum: number, exp: any) => sum + (exp.amount || 0), 0);
  const totalCredits = creditsList.reduce((sum: number, cred: any) => sum + (cred.amount || 0), 0);
  const profitLoss = totalCredits - totalExpenses;
  const projectValue = project?.budget || 0;
  
  const balanceAmount = projectValue - totalCredits;
  const isBalancePositive = balanceAmount >= 0;
  
  const plPercentage = projectValue > 0 ? Math.abs((profitLoss / projectValue) * 100).toFixed(1) : "0.0";
  const isProfit = profitLoss >= 0;

  // Combine expenses and credits into a single ledger array and calculate running balance
  const rawLedger = [
    ...expensesList.map((e: any) => ({ ...e, type: 'EXPENSE', date: new Date(e.date) })),
    ...creditsList.map((c: any) => ({ ...c, type: 'CREDIT', date: new Date(c.date) }))
  ].sort((a, b) => a.date.getTime() - b.date.getTime());

  let currentBalance = 0;
  const ledger = rawLedger.map((entry) => {
    if (entry.type === 'CREDIT') {
      currentBalance += (entry.amount || 0);
    } else {
      currentBalance -= (entry.amount || 0);
    }
    return { ...entry, balance: currentBalance };
  }).reverse();

  const pdfLedger = [...ledger].reverse();

  const handleDownloadPdf = async () => {
    setIsGenerating(true);
    const toastId = toast.loading(t('generating_pdf') || "Generating PDF...");
    
    try {
      const html2canvas = (await import('html2canvas')).default;
      const element = document.getElementById('report-content');
      if (!element) throw new Error("Report content not found");

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        onclone: (clonedDoc) => {
          // Hide UI elements
          const printHidden = clonedDoc.querySelectorAll('.print\\:hidden');
          printHidden.forEach(el => {
            (el as HTMLElement).style.setProperty('display', 'none', 'important');
          });
          
          // Show Print elements
          const printBlock = clonedDoc.querySelectorAll('.print\\:block, .print\\:flex');
          printBlock.forEach(el => {
            if (el.classList.contains('print:flex')) {
              (el as HTMLElement).style.setProperty('display', 'flex', 'important');
            } else {
              (el as HTMLElement).style.setProperty('display', 'block', 'important');
            }
          });

          // Expand the scrollable areas to capture full content and prevent horizontal cutoff
          const container = clonedDoc.getElementById('report-content');
          if (container) {
            container.style.setProperty('width', '1024px', 'important'); // Force desktop width for full capture
            container.style.setProperty('max-width', 'none', 'important');
            container.style.setProperty('height', 'auto', 'important');
            container.style.setProperty('max-height', 'none', 'important');
            container.style.setProperty('overflow', 'visible', 'important');
            container.style.setProperty('border', 'none', 'important');
            container.style.setProperty('box-shadow', 'none', 'important');
          }

          const scrollArea = clonedDoc.getElementById('report-scroll-area');
          if (scrollArea) {
            scrollArea.style.setProperty('overflow', 'visible', 'important');
            scrollArea.style.setProperty('height', 'auto', 'important');
            scrollArea.style.setProperty('max-height', 'none', 'important');
            scrollArea.style.setProperty('padding', '2rem', 'important');
          }

          // Ensure any overflow-x-auto divs are visible
          const xScrolls = clonedDoc.querySelectorAll('.overflow-x-auto');
          xScrolls.forEach(el => {
             (el as HTMLElement).style.setProperty('overflow', 'visible', 'important');
          });
        }
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      let pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      // If content is taller than A4, we might need multiple pages, but for this report,
      // it's usually 1-2 pages. For simplicity and perfect rendering, we will just fit width 
      // and let the height scale. If it exceeds 1 page, jsPDF handles adding pages if we do it manually,
      // but the easiest is just printing the image on one long page or scaling it. 
      // Since it's a financial report, scaling to fit width on A4 and splitting if needed:
      const pageHeight = pdf.internal.pageSize.getHeight();
      let heightLeft = pdfHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`${project.name.replace(/\s+/g, '_')}_Financial_Report.pdf`);
      toast.success(t('pdf_generated') || "PDF downloaded successfully.", { id: toastId });
    } catch (error) {
      console.error("PDF generation failed:", error);
      toast.error("Failed to generate PDF.", { id: toastId });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col justify-end sm:justify-center items-center bg-white sm:bg-gray-900/60 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in print:absolute print:inset-0 print:bg-white print:p-0 print:m-0" onClick={onClose}>
      <div id="report-content" className="bg-white w-full h-full sm:h-auto sm:max-w-4xl rounded-none sm:rounded-3xl shadow-none sm:shadow-2xl border-0 sm:border sm:border-gray-100 overflow-hidden flex flex-col sm:max-h-[90vh] print:max-w-none print:rounded-none print:border-none print:shadow-none print:h-auto print:max-h-none print:block" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50 shrink-0 print:hidden">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{t('project_report')}</h2>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-gray-500 text-sm font-medium">{project.name}</p>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider ${
                project.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : 
                project.status === 'COMPLETED' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
              }`}>
                {project.status === 'ACTIVE' ? (t('active') || 'ACTIVE') : project.status === 'COMPLETED' ? (t('completed') || 'COMPLETED') : project.status}
              </span>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors shadow-sm">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <div id="report-scroll-area" className="overflow-y-auto flex-grow p-5 space-y-6 print:overflow-visible print:max-h-none print:h-auto print:p-8 print:pt-4">
          
          {/* Print Only Header */}
          <div className="hidden print:flex justify-between items-start pb-6 border-b-2 border-gray-100 mb-6">
            {/* Left Column: Title & Project Info */}
            <div className="flex flex-col gap-3">
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">
                {t('project_financial_report') || 'Project Financial Report'}
              </h1>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-bold text-gray-800">
                  {t('project_name') || 'Project Name'}: <span className="font-normal text-gray-600">{project.name}</span>
                </span>
                <span className={`text-base font-bold tracking-wide uppercase ${
                  project.status === 'ACTIVE' ? 'text-emerald-600' : 
                  project.status === 'COMPLETED' ? 'text-blue-600' : 'text-gray-500'
                }`}>
                  ({project.status === 'ACTIVE' ? (t('active') || 'ACTIVE') : project.status === 'COMPLETED' ? (t('completed') || 'COMPLETED') : project.status})
                </span>
              </div>
            </div>
            
            {/* Right Column: Logo & Meta Info */}
            <div className="flex flex-col items-end gap-3 pt-1">
              <img src="/mysitebook-logo-dark.png" alt="MySiteBook" className="h-16 object-contain" />
              <span className="text-sm font-semibold text-gray-500">
                {t('generated_on') || 'Generated on'}: <span className="font-bold text-gray-800 ml-1">{new Date().toLocaleDateString('en-GB')}</span>
              </span>
            </div>
          </div>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 shrink-0">
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">{t('project_value') || "Project Value"}</p>
              <p className="text-xl font-bold text-blue-600">{formatCurrency(projectValue, currency)}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">{t('total_credit')}</p>
              <p className="text-xl font-bold text-emerald-600">{formatCurrency(totalCredits, currency)}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">{t('total_expense')}</p>
              <p className="text-xl font-bold text-amber-500">{formatCurrency(totalExpenses, currency)}</p>
            </div>
          </div>

          {/* Big Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 shrink-0">
            {/* Balance Amount */}
            <div className={`p-6 rounded-2xl border ${isBalancePositive ? 'bg-blue-50 border-blue-100' : 'bg-red-50 border-red-100'}`}>
              <p className="text-sm font-bold uppercase tracking-wider mb-2" style={{ color: isBalancePositive ? '#2563eb' : '#dc2626' }}>
                {t('balance_amount') || "Balance Amount"}
              </p>
              <div className="flex justify-between items-end">
                <p className={`text-3xl sm:text-4xl font-bold ${isBalancePositive ? 'text-blue-600' : 'text-red-600'}`}>
                  {formatCurrency(balanceAmount, currency)}
                </p>
              </div>
            </div>

            {/* Profit / Loss */}
            <div className={`p-6 rounded-2xl border ${isProfit ? 'bg-emerald-50 border-emerald-100' : 'bg-red-50 border-red-100'}`}>
              <p className="text-sm font-bold uppercase tracking-wider mb-2" style={{ color: isProfit ? '#059669' : '#dc2626' }}>
                {project.status === 'ACTIVE' ? (t('cash_flow_trend') || 'Available Balance') : isProfit ? (t('project_profit') || 'Project Profit') : (t('project_loss') || 'Project Loss')}
              </p>
              <div className="flex justify-between items-end">
                <p className={`text-3xl sm:text-4xl font-bold ${isProfit ? 'text-emerald-600' : 'text-red-600'}`}>
                  {isProfit ? '+' : ''}{formatCurrency(profitLoss, currency)}
                </p>
                {projectValue > 0 && (
                  <div className={`flex items-center gap-0.5 pb-1 text-lg font-bold ${isProfit ? 'text-emerald-600' : 'text-red-600'}`}>
                    {isProfit ? (
                      <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>
                    ) : (
                      <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 17 13.5 8.5 8.5 13.5 2 7"></polyline><polyline points="16 17 22 17 22 11"></polyline></svg>
                    )}
                    <span>{plPercentage}%</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Ledger */}
          <div>
            <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-3">{t('ledger_entries') || "Ledger Entries"}</h3>
            
            {/* UI Table - Descending Order */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm print:hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500">
                      <th className="px-2 py-3 sm:p-4 font-bold">{t('sl_no') || "SL No"}</th>
                      <th className="px-2 py-3 sm:p-4 font-bold">{t('date') || "Date"}</th>
                      <th className="px-2 py-3 sm:p-4 font-bold">{t('description') || "Description"}</th>
                      <th className="px-2 py-3 sm:p-4 font-bold text-right">{t('credit') || "Credit"}</th>
                      <th className="px-2 py-3 sm:p-4 font-bold text-right">{t('expense') || "Expense"}</th>
                      <th className="px-2 py-3 sm:p-4 font-bold text-right">{t('balance') || "Balance"}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-sm">
                    {ledger.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-gray-500 font-medium">{t('no_entries_recorded') || "No entries recorded."}</td>
                      </tr>
                    ) : (
                      ledger.map((entry, idx) => (
                        <tr key={idx} className="hover:bg-gray-50 transition-colors">
                          <td className="px-2 py-3 sm:p-4 text-gray-600 font-medium">{idx + 1}</td>
                          <td className="px-2 py-3 sm:p-4 text-gray-600 whitespace-nowrap">{entry.date.toLocaleDateString('en-GB')}</td>
                          <td className="px-2 py-3 sm:p-4 font-bold text-gray-900 min-w-[100px] max-w-[150px] sm:max-w-none truncate sm:whitespace-normal">
                            {entry.type === 'CREDIT' ? (
                              <span className="capitalize">{entry.paymentMethod === 'BANK_TRANSFER' ? 'Bank Transfer' : entry.paymentMethod}</span>
                            ) : (
                              <div>
                                <span className="capitalize">{entry.category}</span>
                                {entry.notes && <span className="block text-xs text-gray-500 font-normal mt-0.5 truncate">{entry.notes}</span>}
                              </div>
                            )}
                          </td>
                          <td className="px-2 py-3 sm:p-4 font-bold text-emerald-600 text-right whitespace-nowrap">
                            {entry.type === 'CREDIT' ? formatCurrency(entry.amount, currency) : '-'}
                          </td>
                          <td className="px-2 py-3 sm:p-4 font-bold text-amber-500 text-right whitespace-nowrap">
                            {entry.type === 'EXPENSE' ? formatCurrency(entry.amount, currency) : '-'}
                          </td>
                          <td className={`px-2 py-3 sm:p-4 font-bold text-right whitespace-nowrap ${entry.balance < 0 ? 'text-red-500' : 'text-gray-900'}`}>
                            {formatCurrency(entry.balance, currency)}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* PDF Table - Ascending Order */}
            <div className="hidden print:block bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto print:overflow-visible">
                <table className="w-full text-left border-collapse print:table">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500">
                      <th className="p-4 font-bold">{t('sl_no') || "SL No"}</th>
                      <th className="p-4 font-bold">{t('date') || "Date"}</th>
                      <th className="p-4 font-bold">{t('description') || "Description"}</th>
                      <th className="p-4 font-bold text-right">{t('credit') || "Credit"}</th>
                      <th className="p-4 font-bold text-right">{t('expense') || "Expense"}</th>
                      <th className="p-4 font-bold text-right">{t('balance') || "Balance"}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-sm">
                    {pdfLedger.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-gray-500 font-medium">{t('no_entries_recorded') || "No entries recorded."}</td>
                      </tr>
                    ) : (
                      pdfLedger.map((entry, idx) => (
                        <tr key={idx} className="bg-white">
                          <td className="p-4 text-gray-600 font-medium">{idx + 1}</td>
                          <td className="p-4 text-gray-600 whitespace-nowrap">{entry.date.toLocaleDateString('en-GB')}</td>
                          <td className="p-4 font-bold text-gray-900">
                            {entry.type === 'CREDIT' ? (
                              <span className="capitalize">{entry.paymentMethod === 'BANK_TRANSFER' ? 'Bank Transfer' : entry.paymentMethod}</span>
                            ) : (
                              <div>
                                <span className="capitalize">{entry.category}</span>
                                {entry.notes && <span className="block text-xs text-gray-500 font-normal mt-0.5">{entry.notes}</span>}
                              </div>
                            )}
                          </td>
                          <td className="p-4 font-bold text-emerald-600 text-right whitespace-nowrap">
                            {entry.type === 'CREDIT' ? formatCurrency(entry.amount, currency) : '-'}
                          </td>
                          <td className="p-4 font-bold text-amber-500 text-right whitespace-nowrap">
                            {entry.type === 'EXPENSE' ? formatCurrency(entry.amount, currency) : '-'}
                          </td>
                          <td className={`p-4 font-bold text-right whitespace-nowrap ${entry.balance < 0 ? 'text-red-500' : 'text-gray-900'}`}>
                            {formatCurrency(entry.balance, currency)}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-5 pb-8 sm:pb-5 border-t border-gray-100 bg-gray-50 mt-auto shrink-0 print:hidden">
          <button 
            onClick={handleDownloadPdf}
            disabled={isGenerating}
            className="w-full bg-white border border-gray-200 text-gray-900 py-4 rounded-xl font-bold text-lg shadow-sm transition-colors disabled:opacity-50 flex justify-center items-center gap-2 hover:bg-gray-50"
          >
            {isGenerating ? (
              t('generating_pdf') || 'Generating PDF...'
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                {t('download_pdf_report') || "Download PDF Report"}
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
