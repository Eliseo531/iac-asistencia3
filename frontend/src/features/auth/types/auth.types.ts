export interface StudentModuleInfo {
  id: string;
  name: string;
  code: string;
  status: string;
}

export interface StudentProfile {
  id: string;
  registrationNumber: string;
  fullName: string;
  email: string;
  module: StudentModuleInfo;
}

export interface StudentLoginResponse {
  token: string;
  student: StudentProfile;
}

export interface StudentSession {
  token: string;
  student: StudentProfile;
}
