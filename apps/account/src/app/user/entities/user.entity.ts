import { AccountChangedCourse } from "@nest-monorepo/contracts";
import { IUser, UserRole, IUserCourse, PurchaseState, IDomainEvent, } from "@nest-monorepo/interfaces";
import { genSalt, hash, compare } from "bcryptjs";

export enum UserEntityErrors {
  COURSE_ALREADY_EXISTS = 'Сourse already exists',
}

export class UserEntity implements IUser {
  _id?: string;
  displayName: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  courses: IUserCourse[];
  events: IDomainEvent[] = [];

  constructor(user: Partial<IUser>) {
    this._id = user._id;
    this.displayName = user.displayName;
    this.passwordHash = user.passwordHash;
    this.email = user.email;
    this.role = user.role;
    this.courses = user.courses;
  }

  public setCourseStatus(courseId: string, state: PurchaseState) {
    const exists = this.courses.find(course => course._id === courseId);
    if (exists) {
      this.courses.push({
        courseId,
        purchaseState: state
      })
      return this;
    }

    if (state === PurchaseState.Cancelled) {
      this.courses = this.courses.filter(course => course._id !== courseId)
      return this;
    }

    this.courses = this.courses.map(course => {
      if (course._id === courseId)
        course.purchaseState = state;

      return course;
    })

    this.events.push({
      topic: AccountChangedCourse.topic,
      data: {
        userId: this._id,
        courseId,
      }
    })
  }

  public getPublicProfile() {
    return {
      email: this.email,
      role: this.role,
      displayName: this.displayName,
    }
  }

  public async setPassword(password: string) {
    const salt = await genSalt(10);
    this.passwordHash = await hash(password, salt);
    return this;
  }

  public validatePassword(password: string) {
    return compare(password, this.passwordHash);
  }

  public updateProfile(displayName: string) {
    this.displayName = displayName;
    return this;
  }
}