import config from '../config';
import prisma from '../prisma/client';
import { NotificationChannel, NotificationType } from '@prisma/client';

export class WhatsAppService {
  /**
   * Send WhatsApp Message via Cloud API / Provider
   */
  static async sendMessage(recipientPhone: string, templateName: string, parameters: string[], userId?: string) {
    // Clean phone number (Indian standard format with country code 91)
    let phone = recipientPhone.replace(/[^0-9]/g, '');
    if (phone.length === 10) phone = '91' + phone;

    const payload = {
      messaging_product: 'whatsapp',
      to: phone,
      type: 'template',
      template: {
        name: templateName,
        language: { code: 'en' },
        components: [
          {
            type: 'body',
            parameters: parameters.map((param) => ({ type: 'text', text: param })),
          },
        ],
      },
    };

    if (!config.whatsapp.enabled || !config.whatsapp.apiUrl || !config.whatsapp.token) {
      // Record notice and log actual configuration status
      if (userId) {
        await prisma.notification.create({
          data: {
            userId,
            title: `WhatsApp Notice: ${templateName}`,
            message: parameters.join(' | '),
            type: NotificationType.GENERAL,
            channel: NotificationChannel.WHATSAPP,
            metadata: {
              phone,
              providerStatus: 'CONFIG_PENDING',
              note: 'WhatsApp Business API credentials not yet provisioned in production .env',
            },
          },
        });
      }

      return {
        success: false,
        status: 'PROVIDER_NOT_CONFIGURED',
        message: 'WhatsApp Business API token or phone ID not configured in environment.',
        phone,
      };
    }

    try {
      const response = await fetch(config.whatsapp.apiUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${config.whatsapp.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (userId) {
        await prisma.notification.create({
          data: {
            userId,
            title: `WhatsApp Notice: ${templateName}`,
            message: parameters.join(' | '),
            type: NotificationType.GENERAL,
            channel: NotificationChannel.WHATSAPP,
            metadata: data,
          },
        });
      }

      return {
        success: response.ok,
        status: response.ok ? 'DELIVERED' : 'FAILED',
        providerResponse: data,
      };
    } catch (err: any) {
      return {
        success: false,
        status: 'NETWORK_ERROR',
        error: err.message,
      };
    }
  }

  // Helper Methods for specific school alerts
  static async sendFeeReminder(parentPhone: string, studentName: string, amount: string, dueDate: string, userId?: string) {
    return this.sendMessage(parentPhone, 'fee_due_reminder_apps', [studentName, amount, dueDate, 'A. P PUBLIC SCHOOL'], userId);
  }

  static async sendPaymentConfirmation(parentPhone: string, studentName: string, receiptNo: string, amount: string, userId?: string) {
    return this.sendMessage(parentPhone, 'payment_receipt_apps', [studentName, receiptNo, amount, 'A. P PUBLIC SCHOOL'], userId);
  }

  static async sendAbsenceAlert(parentPhone: string, studentName: string, dateStr: string, userId?: string) {
    return this.sendMessage(parentPhone, 'student_absence_alert_apps', [studentName, dateStr, 'A. P PUBLIC SCHOOL'], userId);
  }
}
