import React from "react";
import CustomerPaymentPreview from "@/components/payment/CustomerPaymentPreview";
import { getSecurePaymentRequestData } from "@/app/actions/payment-links";

export default async function SecurePaymentRequestPage({ 
  params
}: { 
  params: Promise<{ requestId: string }>
}) {
  const { requestId } = await params;
  
  // Fetch secure payment request data
  const response = await getSecurePaymentRequestData(requestId);
  
  if (!response.success || !response.data) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-8">
        <div className="bg-white p-8 rounded-2xl shadow-sm text-center max-w-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Invalid Link</h2>
          <p className="text-gray-600">This payment request link is invalid or has expired.</p>
        </div>
      </div>
    );
  }

  const { project, financials, recentCredits, tenant, requestDetails } = response.data;
  
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 md:p-8">
      <CustomerPaymentPreview
        project={project}
        financials={financials}
        recentCredits={recentCredits}
        requestAmount={requestDetails.amount.toString()}
        paymentFor={requestDetails.paymentFor || ""}
        dueDate={requestDetails.dueDate ? new Date(requestDetails.dueDate) : null}
        notes={requestDetails.notes || ""}
        currency={tenant.currency}
        tenantName={tenant.name}
      />
    </div>
  );
}
