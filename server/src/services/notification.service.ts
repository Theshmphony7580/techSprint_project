/**
 * Notification Service
 * Handles sending emails and SMS notifications.
 * Currently mocked to log to console for demo purposes.
 */
export class NotificationService {

    static async sendEmail(to: string, subject: string, body: string) {
        // In Prod: await transporter.sendMail(...)
        console.log(`\n[EMAIL_SENT] To: ${to} | Subject: ${subject}`);
        console.log(`Body: ${body}\n`);
        return true;
    }

    static async sendSMS(to: string, message: string) {
        // In Prod: await twilio.messages.create(...)
        console.log(`\n[SMS_SENT] To: ${to} | Message: ${message}\n`);
        return true;
    }

    static async notifyComplaintReceived(userEmail: string, complaintId: string) {
        await this.sendEmail(
            userEmail,
            'Complaint Received',
            `Your complaint (ID: ${complaintId}) has been received and is being reviewed by the department.`
        );
    }

    static async notifyComplaintStatusUpdate(userEmail: string, complaintId: string, status: string, response?: string) {
        await this.sendEmail(
            userEmail,
            `Complaint Status Updated: ${status}`,
            `Your complaint (ID: ${complaintId}) is now ${status}.\n\nOfficial Response: ${response || 'None'}`
        );
    }

    static async notifyAdminNewProject(adminEmail: string, projectName: string) {
        await this.sendEmail(
            adminEmail,
            'New Project Sanctioned',
            `A new project "${projectName}" has been sanctioned and requires your attention.`
        );
    }
}