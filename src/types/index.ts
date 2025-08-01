export type UserRole = 'admin' | 'data-entry';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  dateAdded: string;
}

export interface FormField {
  id: string;
  type: 'text' | 'dropdown' | 'number' | 'date' | 'email' | 'textarea';
  label: string;
  required: boolean;
  options?: string[];
}

export interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
}

export interface MemberData {
  id: string;
  memberName: string;
  email: string;
  address: string;
  phoneNumber: string;
  alternatePhone?: string;
  familyMembers: FamilyMember[];
  festival: string;
  fees: number;
  denomination: string;
  paymentMode: string;
  paymentStatus: string;
  dateCreated: string;
}