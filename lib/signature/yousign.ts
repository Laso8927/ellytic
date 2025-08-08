import { SignatureProvider, PoAData, SignatureDocument, DocumentStatus } from "./types";

export class YousignProvider implements SignatureProvider {
  private apiKey: string;
  private apiBaseUrl: string;
  private webhookSecret: string;

  constructor() {
    this.apiKey = process.env.YOUSIGN_API_KEY || "";
    this.apiBaseUrl = process.env.YOUSIGN_API_BASE_URL || "https://api-sandbox.yousign.app/v3";
    this.webhookSecret = process.env.YOUSIGN_WEBHOOK_SECRET || "";
  }

  async createDocument(data: PoAData): Promise<SignatureDocument> {
    const htmlContent = this.generatePoAHTML(data);
    
    // Create signature request via Yousign API
    const response = await fetch(`${this.apiBaseUrl}/signature_requests`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "Greek TIN Authorization (PoA)",
        delivery_mode: "email",
        documents: [{
          name: "authorization_tin_authentication_key.pdf",
          nature: "signable_document",
          content: Buffer.from(htmlContent).toString('base64'),
          parse_anchors: true
        }],
        signers: [{
          info: {
            first_name: data.fullName.split(' ')[0],
            last_name: data.fullName.split(' ').slice(1).join(' '),
            email: data.email,
            phone_number: data.mobilePhone,
            locale: "el"
          },
          signature_authentication_mode: "no_otp",
          signature_level: "electronic_signature"
        }],
        webhook_subscription: {
          target: `${process.env.NEXT_PUBLIC_BASE_URL}/api/signature/webhook`,
          secret: this.webhookSecret
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Yousign API error: ${response.statusText}`);
    }

    const result = await response.json();
    
    return {
      id: result.id,
      signUrl: result.signers[0].signature_link,
      status: this.mapStatus(result.status)
    };
  }

  async getDocumentStatus(documentId: string): Promise<DocumentStatus> {
    const response = await fetch(`${this.apiBaseUrl}/signature_requests/${documentId}`, {
      headers: {
        "Authorization": `Bearer ${this.apiKey}`,
      }
    });

    if (!response.ok) {
      throw new Error(`Yousign API error: ${response.statusText}`);
    }

    const result = await response.json();
    return this.mapStatus(result.status);
  }

  private mapStatus(yousignStatus: string): DocumentStatus {
    switch (yousignStatus) {
      case "draft": return "draft";
      case "ongoing": return "pending";
      case "done": return "signed";
      case "expired": return "expired";
      case "canceled": return "cancelled";
      default: return "draft";
    }
  }

  private generatePoAHTML(data: PoAData): string {
    return `
<!DOCTYPE html>
<html lang="el">
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; font-size: 12px; line-height: 1.4; margin: 20px; }
        .header { text-align: center; font-weight: bold; font-size: 14px; margin-bottom: 20px; }
        .section { margin-bottom: 15px; }
        .field-row { display: flex; margin-bottom: 8px; }
        .field-label { width: 200px; font-weight: bold; }
        .field-value { flex: 1; border-bottom: 1px solid #000; min-height: 20px; padding: 2px; }
        .checkbox-section { margin: 15px 0; }
        .checkbox-row { display: flex; align-items: center; margin-bottom: 8px; }
        .checkbox { width: 15px; height: 15px; border: 1px solid #000; margin-right: 8px; display: inline-block; }
        .checkbox.checked::after { content: "✓"; font-weight: bold; }
        .signature-section { margin-top: 30px; display: flex; justify-content: space-between; }
        .signature-box { width: 200px; height: 80px; border: 1px solid #000; text-align: center; padding-top: 60px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 15px; }
        td { border: 1px solid #000; padding: 8px; vertical-align: top; }
        .center { text-align: center; }
        .bold { font-weight: bold; }
    </style>
</head>
<body>
    <div class="header">
        AUTHORIZATION TO ISSUE TIN AND AUTHENTICATION KEY
    </div>
    
    <div class="section">
        <p><strong>The undersigned:</strong></p>
        <table>
            <tr>
                <td class="bold" style="width: 25%;">Full Name:</td>
                <td style="width: 25%;">${data.fullName}</td>
                <td class="bold" style="width: 25%;">Date and Authority of Issue:</td>
                <td style="width: 25%;">${data.dateAuthority}</td>
            </tr>
            <tr>
                <td class="bold">Father's Full Name:</td>
                <td>${data.fatherFullName}</td>
                <td class="bold" rowspan="2">Competent Tax Office:</td>
                <td rowspan="2">${data.competentTaxOffice || ''}</td>
            </tr>
            <tr>
                <td class="bold">Mother's Full Name:</td>
                <td>${data.motherFullName}</td>
            </tr>
            <tr>
                <td class="bold">Identity Card or Passport Number:</td>
                <td>${data.identityNumber}</td>
                <td class="bold">TIN (Tax Identification Number):</td>
                <td>${data.tin || ''}</td>
            </tr>
            <tr>
                <td class="bold">Email Address:</td>
                <td colspan="3">${data.email}</td>
            </tr>
            <tr>
                <td class="bold">Mobile phone number:</td>
                <td colspan="3">${data.mobilePhone}</td>
            </tr>
        </table>

        ${data.legalRepFullName ? `
        <p><strong>Legal representative of the Legal Person:</strong></p>
        <table>
            <tr>
                <td class="bold" style="width: 50%;">Tax Identification Number of a Legal Person:</td>
                <td style="width: 50%;">${data.legalRepTaxId || ''}</td>
            </tr>
        </table>
        ` : ''}
    </div>

    <div class="checkbox-section">
        <p><strong>I declare that I authorize:</strong></p>
        <div class="checkbox-row">
            <span class="checkbox ${data.declareAuthorize ? 'checked' : ''}"></span>
            <span>Full Name: ${data.fullName}</span>
        </div>
        <div class="checkbox-row">
            <span class="checkbox ${data.onMyBehalf ? 'checked' : ''}"></span>
            <span>on my behalf</span>
        </div>
        ${data.onBehalfOf ? `
        <div class="checkbox-row">
            <span class="checkbox checked"></span>
            <span>on behalf of:</span>
        </div>
        <table style="margin-left: 25px;">
            <tr>
                <td class="bold">Full Name:</td>
                <td>${data.representedFullName || ''}</td>
            </tr>
            <tr>
                <td class="bold">Father's Full Name:</td>
                <td>${data.representedFatherName || ''}</td>
            </tr>
            <tr>
                <td class="bold">Mother's Full Name:</td>
                <td>${data.representedMotherName || ''}</td>
            </tr>
            <tr>
                <td class="bold">Identity Card or Passport Number:</td>
                <td>${data.representedIdentityNumber || ''}</td>
            </tr>
            <tr>
                <td class="bold">Email Address:</td>
                <td>${data.representedEmail || ''}</td>
            </tr>
            <tr>
                <td class="bold">Mobile phone number:</td>
                <td>${data.representedMobile || ''}</td>
            </tr>
        </table>
        ` : ''}
        
        <p style="margin-top: 15px;"><strong>whom I legally represent as:</strong></p>
        <p>Person that legally represents the taxpayer, e.g., an institution that is a guardian, curator, or administrator, etc.</p>
        
        <p style="margin-top: 15px;"><strong>to submit a request for the simultaneous issuance of a TIN and an Authentication Key:</strong></p>
        
        <div class="checkbox-row">
            <span class="checkbox ${data.toReceive ? 'checked' : ''}"></span>
            <span>to receive</span>
        </div>
        <div class="checkbox-row">
            <span class="checkbox ${data.notToReceive ? 'checked' : ''}"></span>
            <span>not to receive</span>
        </div>
        
        <p style="margin-top: 15px;">the Authentication Key and access codes to the IAPR's digital services.</p>
    </div>

    <div class="signature-section">
        <div>
            <p><strong>Date:</strong></p>
            <div style="border-bottom: 1px solid #000; width: 150px; margin-top: 10px;">${new Date().toLocaleDateString('el-GR')}</div>
        </div>
        <div>
            <p><strong>The authorizer:</strong></p>
            <div class="signature-box">
                <p style="margin-top: 30px;">{{signature_1}}</p>
            </div>
        </div>
    </div>

    <p style="margin-top: 20px; font-size: 10px; text-align: center;">
        <em>Authorization to issue TIN and Authentication Key v1.0_en-v1</em>
    </p>
</body>
</html>`;
  }
}