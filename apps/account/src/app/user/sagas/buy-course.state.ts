import { UserEntity } from "../entities/user.entity";
import { BuyCourseSaga } from "./buy-course.saga";

export abstract class BuyCourseSagaState {
  public saga: BuyCourseSaga;

  public setContext(saga: BuyCourseSaga): void {
    this.saga = saga;
  }

  public abstract pay(): Promise<{ paymentLink: string, user: UserEntity }>;
  public abstract checkPayment(): Promise<{ paymentLink: string, user: UserEntity }>;
  public abstract cancel(): Promise<{ paymentLink: string, user: UserEntity }>;
}
