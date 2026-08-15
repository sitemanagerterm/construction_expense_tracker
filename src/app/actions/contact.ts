"use server";

import { prisma } from "@/lib/prisma";

export async function submitContactForm(data: {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  subject?: string;
  message: string;
}) {
  try {
    if (!data.name || !data.email || !data.message) {
      return { success: false, error: "Missing required fields." };
    }

    await prisma.contactMessage.create({
      data: {
        name: data.name,
        email: data.email,
        company: data.company || null,
        phone: data.phone || null,
        subject: data.subject || null,
        message: data.message,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to save contact message:", error);
    return { success: false, error: "Failed to send message. Please try again later." };
  }
}
