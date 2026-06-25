export interface Address {
  id: string;
  type: 'home' | 'work' | 'other';
  street: string;
  city: string;
  state: string;
  pincode: string;
}

export interface Education {
  id: string;
  degree: string;
  university: string;
  year: string;
  percentage: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  role: string;
  fromDate: string;
  toDate: string;
  currentlyWorking: boolean;
}

export interface FormData {
  id?: string;
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  maritalStatus: string;
  nationality: string;
  aadharNumber: string;
  panNumber: string;
  addresses: Address[];
  emergencyName: string;
  emergencyRelation: string;
  emergencyPhone: string;
  education: Education[];
  workExperience: WorkExperience[];
  skills: string[];
  languages: string[];
  hobbies: string[];
  documents: string[];
  termsAccepted: boolean;
  declaration: boolean;
  created_at?: string;
}