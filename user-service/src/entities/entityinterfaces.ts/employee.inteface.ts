export interface Employee {
  fullname: string,
  email: string,
  phone: string,
  salary: number,
  gender: string,
  birthdate: Date,
  role: string,
  designation: string,
  departmentId: number
}

export interface EmployeeResponse {
  status?: string,
  data?: {
    id: number,
    fullname: string,
    email: string,
    phone: string,
    salary: number,
    gender: string,
    birthdate: Date,
    role: string,
    designation: string,
    departmentId: 1,
    joindate: Date,
    updatedAt: Date
  }
}
