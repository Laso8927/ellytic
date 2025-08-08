export interface SignatureProvider {
  createDocument(data: PoAData): Promise<SignatureDocument>;
  getDocumentStatus(documentId: string): Promise<DocumentStatus>;
}

export interface PoAData {
  // Primary applicant
  fullName: string;
  fatherFullName: string;
  motherFullName: string;
  identityNumber: string;
  identityType: "passport" | "id";
  dateAuthority: string;
  tin?: string;
  competentTaxOffice?: string;
  email: string;
  mobilePhone: string;
  
  // Legal representative (if applicable)
  legalRepFullName?: string;
  legalRepFatherName?: string;
  legalRepMotherName?: string;
  legalRepIdentityNumber?: string;
  legalRepTaxId?: string;
  
  // Authorization type
  authorizationType: "myself" | "behalf_of" | "legal_rep";
  
  // Person being represented (if behalf_of)
  representedFullName?: string;
  representedFatherName?: string;
  representedMotherName?: string;
  representedIdentityNumber?: string;
  representedEmail?: string;
  representedMobile?: string;
  
  // Checkboxes
  declareAuthorize: boolean;
  onMyBehalf: boolean;
  onBehalfOf: boolean;
  toReceive: boolean;
}

export interface SignatureDocument {
  id: string;
  signUrl: string;
  status: DocumentStatus;
}

export type DocumentStatus = "draft" | "pending" | "signed" | "expired" | "cancelled";