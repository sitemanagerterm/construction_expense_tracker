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
  
  const plPercentage = projectValue > 0 ? ((profitLoss / projectValue) * 100).toFixed(1) : "0.0";
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

  const handleDownloadPdf = () => {
    setIsGenerating(true);
    try {
      const doc = new jsPDF();
      
      // Helper to fix ₹ rendering issue in standard PDF fonts
      const pdfFormatCurrency = (amount: number, curr: string) => {
        return formatCurrency(amount, curr).replace('₹', 'Rs.');
      };

      // Header Background
      doc.setFillColor(249, 250, 251);
      doc.rect(0, 0, 210, 40, 'F');
      
      // Title
      doc.setFontSize(22);
      doc.setTextColor(17, 24, 39);
      doc.setFont("helvetica", "bold");
      doc.text("Project Financial Report", 14, 20);
      
      // Project Info & Date
      doc.setFontSize(11);
      doc.setTextColor(107, 114, 128);
      doc.setFont("helvetica", "normal");
      doc.text(`Project Name:`, 14, 30);
      doc.setTextColor(17, 24, 39);
      doc.setFont("helvetica", "bold");
      doc.text(project.name, 43, 30);

      doc.setFontSize(11);
      doc.setTextColor(107, 114, 128);
      doc.setFont("helvetica", "normal");
      doc.text(`Generated on:`, 140, 30);
      doc.setTextColor(17, 24, 39);
      doc.text(new Date().toLocaleDateString('en-GB'), 168, 30);

      // Summary Cards
      doc.setFontSize(12);
      doc.setTextColor(17, 24, 39);
      doc.setFont("helvetica", "bold");
      doc.text("Financial Summary", 14, 50);

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(107, 114, 128);
      doc.text("Total Credits", 14, 58);
      doc.text("Total Expenses", 80, 58);
      doc.text("Profit / Loss", 146, 58);

      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(5, 150, 105); // emerald-600
      doc.text(pdfFormatCurrency(totalCredits, currency), 14, 64);
      
      doc.setTextColor(220, 38, 38); // red-600
      doc.text(pdfFormatCurrency(totalExpenses, currency), 80, 64);
      
      // Dynamic color for Profit/Loss
      if (profitLoss >= 0) {
        doc.setTextColor(5, 150, 105); // green
      } else {
        doc.setTextColor(220, 38, 38); // red
      }
      doc.text(pdfFormatCurrency(profitLoss, currency), 146, 64);

      // Line separator
      doc.setDrawColor(229, 231, 235);
      doc.line(14, 70, 196, 70);

      // Calculate forward balance for PDF
      let pdfBalance = 0;
      const pdfLedger = rawLedger.map((entry) => {
        if (entry.type === 'CREDIT') {
          pdfBalance += (entry.amount || 0);
        } else {
          pdfBalance -= (entry.amount || 0);
        }
        return { ...entry, balance: pdfBalance };
      });

      // Ledger Table
      const tableColumn = ["Date", "Description", "Credit", "Expense", "Balance"];
      const tableRows: any[] = [];

      pdfLedger.forEach(entry => {
        const desc = entry.type === 'CREDIT' ? (entry.paymentMethod === 'BANK_TRANSFER' ? 'Bank Transfer' : entry.paymentMethod) : entry.category;
        const entryData = [
          entry.date.toLocaleDateString('en-GB'),
          (desc || 'N/A').toUpperCase(),
          entry.type === 'CREDIT' ? pdfFormatCurrency(entry.amount, currency) : '-',
          entry.type === 'EXPENSE' ? pdfFormatCurrency(entry.amount, currency) : '-',
          pdfFormatCurrency(entry.balance, currency)
        ];
        tableRows.push(entryData);
      });

      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 75,
        theme: 'striped',
        headStyles: {
          fillColor: [31, 41, 55], // gray-800
          textColor: [255, 255, 255],
          fontStyle: 'bold',
        },
        alternateRowStyles: {
          fillColor: [249, 250, 251], // gray-50
        },
        styles: {
          fontSize: 9,
          cellPadding: 4,
        },
        columnStyles: {
          2: { halign: 'right', textColor: [5, 150, 105], fontStyle: 'bold' }, // Credit
          3: { halign: 'right', textColor: [220, 38, 38], fontStyle: 'bold' }, // Expense
          4: { halign: 'right', fontStyle: 'bold' }, // Balance
        },
        didDrawPage: function (data) {
          // Footer
          doc.setFontSize(8);
          doc.setTextColor(156, 163, 175);
          doc.setFont("helvetica", "normal");
          doc.text(`Page ${data.pageNumber}`, doc.internal.pageSize.width - 20, doc.internal.pageSize.height - 10);
          doc.text('Generated by Construction Expense Tracker', 14, doc.internal.pageSize.height - 10);
        }
      });

      doc.save(`Project_Report_${project.name}.pdf`);
      
      toast.success(t('pdf_generated') || "PDF Generated Successfully!");
    } catch (error) {
      console.error(error);
      toast.error(t('pdf_generated_err') || "Failed to generate PDF");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col justify-end sm:justify-center items-center bg-white sm:bg-gray-900/60 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in" onClick={onClose}>
      <div className="bg-white w-full h-full sm:h-auto sm:max-w-4xl rounded-none sm:rounded-3xl shadow-none sm:shadow-2xl border-0 sm:border sm:border-gray-100 overflow-hidden flex flex-col sm:max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50 shrink-0">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{t('project_report')}</h2>
            <p className="text-gray-500 text-sm mt-1 font-medium">{project.name}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors shadow-sm">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <div className="overflow-y-auto flex-grow p-5 space-y-6">
          
          {/* Summary Cards */}
          <div className="grid grid-cols-2 gap-4 shrink-0">
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">{t('total_credit')}</p>
              <p className="text-xl font-bold text-emerald-600">{formatCurrency(totalCredits, currency)}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">{t('total_expense')}</p>
              <p className="text-xl font-bold text-amber-500">{formatCurrency(totalExpenses, currency)}</p>
            </div>
          </div>

          {/* Profit / Loss */}
          <div className={`p-6 rounded-2xl border shrink-0 ${isProfit ? 'bg-emerald-50 border-emerald-100' : 'bg-red-50 border-red-100'}`}>
            <p className="text-sm font-bold uppercase tracking-wider mb-2" style={{ color: isProfit ? '#059669' : '#dc2626' }}>
              {isProfit ? t('project_profit') : 'Project Loss'}
            </p>
            <div className="flex justify-between items-end">
              <p className={`text-4xl font-bold ${isProfit ? 'text-emerald-600' : 'text-red-600'}`}>
                {isProfit ? '+' : ''}{formatCurrency(profitLoss, currency)}
              </p>
              {projectValue > 0 && (
                <div className={`flex items-center gap-0.5 pb-1 text-lg font-bold ${isProfit ? 'text-emerald-600' : 'text-red-600'}`}>
                  {isProfit ? (
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>
                  ) : (
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 17 13.5 8.5 8.5 13.5 2 7"></polyline><polyline points="16 17 22 17 22 11"></polyline></svg>
                  )}
                  <span>{plPercentage}%</span>
                </div>
              )}
            </div>
          </div>

          {/* Ledger */}
          <div>
            <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-3">{t('ledger_entries') || "Ledger Entries"}</h3>
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
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
                    {ledger.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-gray-500 font-medium">{t('no_entries_recorded') || "No entries recorded."}</td>
                      </tr>
                    ) : (
                      ledger.map((entry, idx) => (
                        <tr key={idx} className="hover:bg-gray-50 transition-colors">
                          <td className="p-4 text-gray-600 font-medium">{ledger.length - idx}</td>
                          <td className="p-4 text-gray-600 whitespace-nowrap">{entry.date.toLocaleDateString('en-GB')}</td>
                          <td className="p-4 font-bold text-gray-900 capitalize min-w-[120px]">
                            {entry.type === 'CREDIT' ? (entry.paymentMethod === 'BANK_TRANSFER' ? 'Bank Transfer' : entry.paymentMethod) : entry.category}
                          </td>
                          <td className="p-4 font-bold text-emerald-600 text-right">
                            {entry.type === 'CREDIT' ? formatCurrency(entry.amount, currency) : '-'}
                          </td>
                          <td className="p-4 font-bold text-amber-500 text-right">
                            {entry.type === 'EXPENSE' ? formatCurrency(entry.amount, currency) : '-'}
                          </td>
                          <td className={`p-4 font-bold text-right ${entry.balance < 0 ? 'text-red-500' : 'text-gray-900'}`}>
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
        <div className="p-5 pb-8 sm:pb-5 border-t border-gray-100 bg-gray-50 mt-auto shrink-0">
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
