import { PurchaseState } from "@nest-monorepo/interfaces";
import { UserEntity } from "../../../entities/user.entity";
import { BuyCourseSagaErrors, BuyCourseSagaState } from "../buy-course.state";

export class BuyCourseSagaStateCancelled extends BuyCourseSagaState {
  public pay(): Promise<{ paymentLink?: string; user: UserEntity; }> {
    this.saga.setState(this.saga.courseId, PurchaseState.Started);
    return this.saga.getState().pay();
  }

  public async checkPayment(): Promise<{ paymentLink?: string; user: UserEntity; }> {
    throw new Error(BuyCourseSagaErrors.CANNOT_CHECK_PAYMENT_FOR_CANCELLED_COURSE);
  }

  public cancel(): Promise<{ paymentLink?: string; user: UserEntity; }> {
    throw new Error(BuyCourseSagaErrors.CANNOT_CANCEL_ALREADY_CANCELLED_COURSE);
  }
}
