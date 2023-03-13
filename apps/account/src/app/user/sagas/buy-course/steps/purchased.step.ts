import { UserEntity } from "../../../entities/user.entity";
import { BuyCourseSagaErrors, BuyCourseSagaState } from "../buy-course.state";

export class BuyCourseSagaStatePurchased extends BuyCourseSagaState {
  public pay(): Promise<{ paymentLink?: string; user: UserEntity; }> {
    throw new Error(BuyCourseSagaErrors.CANNOT_PAY_FOR_PURCHASED_COURSE);
  }

  public async checkPayment(): Promise<{ paymentLink?: string; user: UserEntity; }> {
    throw new Error(BuyCourseSagaErrors.CANNOT_CHECK_PAYMENT_FOR_PURCHASED_COURSE);
  }

  public cancel(): Promise<{ paymentLink?: string; user: UserEntity; }> {
    throw new Error(BuyCourseSagaErrors.CANNOT_CANCEL_PAYMENT_DURING_THE_PROCESS);
  }
}
