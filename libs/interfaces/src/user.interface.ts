export enum UserRole {
  Teacher = 'teacher',
  Student = 'student',
}

export enum PurchaseState {
  Started = 'started',
  WaitingForPayment = 'waitingForPayment',
  Purchased = 'purchased',
  Cancelled = 'cancelled'
}

export interface IUser {
  _id?: string;
  displayName: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  courses?: IUserCourse[];
}

export interface IUserCourse {
  _id?: string;
  courseId: string;
  purchaseState: PurchaseState;
}