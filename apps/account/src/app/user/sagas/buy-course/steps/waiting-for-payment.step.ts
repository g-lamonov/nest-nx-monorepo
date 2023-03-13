import { PaymentCheck, } from "@nest-monorepo/contracts";
import { PaymentStatus, PurchaseState } from "@nest-monorepo/interfaces";
import { UserEntity } from "../../../entities/user.entity";
import { BuyCourseSagaErrors, BuyCourseSagaState } from "../buy-course.state";

export class BuyCourseSagaStateWaitingForPayment extends BuyCourseSagaState {
  public async pay(): Promise<{ paymentLink: string; user: UserEntity; }> {
    throw new Error(BuyCourseSagaErrors.CANNOT_CREATE_PAYMENT_LINK_DURING_THE_PROCESS);
  }
  public async checkPayment(): Promise<{ paymentLink?: string; user: UserEntity; status: PaymentStatus; }> {
    const { status } = await this.saga.rmqService.send<PaymentCheck.Request, PaymentCheck.Response>(PaymentCheck.topic, {
      userId: this.saga.user._id,
      courseId: this.saga.courseId,
    });

    if (status === PaymentStatus.Cancelled) {
      this.saga.setState(this.saga.courseId, PurchaseState.Cancelled);
      return { user: this.saga.user, status: PaymentStatus.Cancelled };
    }

    if (status !== PaymentStatus.Success) return { user: this.saga.user, status: PaymentStatus.Success };

    this.saga.setState(this.saga.courseId, PurchaseState.Purchased);
    return { user: this.saga.user, status: PaymentStatus.Progress };
  }

  public async cancel(): Promise<{ paymentLink: string; user: UserEntity; }> {
    throw new Error(BuyCourseSagaErrors.CANNOT_CANCEL_PAYMENT_DURING_THE_PROCESS);
  }
}
