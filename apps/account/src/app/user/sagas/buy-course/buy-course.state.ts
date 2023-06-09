import { PaymentStatus } from "@nest-monorepo/interfaces";
import { UserEntity } from "../../entities/user.entity";
import { BuyCourseSaga } from "./buy-course.saga";

export enum BuyCourseSagaErrors {
  COURSE_DOES_NOT_EXIST = "Course does not exist",
  UNABLE_TO_CHECK_PAYMENT_THAT_HAS_NOT_STARTED_YET = "Unable to check a payment that hasn't started yet",

  CANNOT_CREATE_PAYMENT_LINK_DURING_THE_PROCESS = "Cannot create payment link during the process",
  CANNOT_CANCEL_PAYMENT_DURING_THE_PROCESS = "Cannot cancel payment during the process",

  CANNOT_PAY_FOR_PURCHASED_COURSE = "Cannot pay for purchased course",
  CANNOT_CHECK_PAYMENT_FOR_PURCHASED_COURSE = "Cannot check payment for purchased course",
  CANNOT_CANCEL_PURCHASED_COURSE = "Cannot cancel purchased course",

  CANNOT_CHECK_PAYMENT_FOR_CANCELLED_COURSE = "Cannot check payment for cancelled course",
  CANNOT_CANCEL_ALREADY_CANCELLED_COURSE = "Cannot cancel already cancelled course",
}

export abstract class BuyCourseSagaState {
  public saga: BuyCourseSaga;

  public setContext(saga: BuyCourseSaga): void {
    this.saga = saga;
  }

  public abstract pay(): Promise<{ paymentLink?: string, user: UserEntity }>;
  public abstract checkPayment(): Promise<{ paymentLink?: string, user: UserEntity, status: PaymentStatus }>;
  public abstract cancel(): Promise<{ paymentLink?: string, user: UserEntity }>;
}
