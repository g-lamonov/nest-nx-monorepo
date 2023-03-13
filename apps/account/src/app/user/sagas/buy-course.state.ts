import { UserEntity } from "../entities/user.entity";
import { BuyCourseSaga } from "./buy-course.saga";

export enum BuyCourseSagaErrors {
  COURSE_DOES_NOT_EXIST = "Course does not exist",
  UNABLE_TO_CHECK_PAYMENT_THAT_HAS_NOT_STARTED_YET = "Unable to check a payment that hasn't started yet"
}

export abstract class BuyCourseSagaState {
  public saga: BuyCourseSaga;

  public setContext(saga: BuyCourseSaga): void {
    this.saga = saga;
  }

  public abstract pay(): Promise<{ paymentLink: string, user: UserEntity }>;
  public abstract checkPayment(): Promise<{ paymentLink: string, user: UserEntity }>;
  public abstract cancel(): Promise<{ paymentLink: string, user: UserEntity }>;
}
