import React from "react";
import { getPaymentHistory } from "@/app/actions/admin";
import { format } from "date-fns";

export default async function SubscriptionsPage() {
  const { history = [] } = await getPaymentHistory();

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Payment History</h1>
          <p className="text-slate-500 mt-1">Global ledger of all tenant subscription renewals and payments.</p>
        </div>
      </div>
      
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Tenant</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Plan</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Method</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {history.map((record: any) => (
                <tr key={record.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-semibold text-slate-700 whitespace-nowrap">
                    {format(new Date(record.paymentDate), 'MMM d, yyyy HH:mm')}
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-gray-900">{record.tenant?.name || "Unknown"}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">
                      {record.planType || "CUSTOM"}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-900">
                    {record.currency} {record.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 font-medium">
                    {record.method}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {record.notes || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {history.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              No payments recorded yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
