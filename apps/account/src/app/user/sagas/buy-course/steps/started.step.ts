import { CourseGetCourse, PaymentGenerateLink } from "@nest-monorepo/contracts";
import { PaymentStatus, PurchaseState } from "@nest-monorepo/interfaces";
import { UserEntity } from "../../../entities/user.entity";
import { BuyCourseSagaErrors, BuyCourseSagaState } from "../buy-course.state";

export class BuyCourseSagaStateStarted extends BuyCourseSagaState {
  public async pay(): Promise<{ paymentLink: string; user: UserEntity; }> {
    const { course } = await this.saga.rmqService.send<CourseGetCourse.Request, CourseGetCourse.Response>(CourseGetCourse.topic, {
      id: this.saga.courseId,
    });

    if (!course)
      throw new Error(BuyCourseSagaErrors.COURSE_DOES_NOT_EXIST);

    if (course.price === 0) {
      this.saga.setState(course._id, PurchaseState.Purchased);
      return {
        paymentLink: null,
        user: this.saga.user,
      }
    }

    const { paymentLink, } = await this.saga.rmqService.send<PaymentGenerateLink.Request, PaymentGenerateLink.Response>(PaymentGenerateLink.topic, {
      courseId: course._id,
      userId: this.saga.user._id,
      sum: course.price,
    })
    this.saga.setState(course._id, PurchaseState.WaitingForPayment);

    return {
      paymentLink,
      user: this.saga.user,
    }
  }
  public checkPayment(): Promise<{ paymentLink: string; user: UserEntity; status: PaymentStatus; }> {
    throw new Error(BuyCourseSagaErrors.UNABLE_TO_CHECK_PAYMENT_THAT_HAS_NOT_STARTED_YET);
  }
  public async cancel(): Promise<{ paymentLink?: string; user: UserEntity; }> {
    this.saga.setState(this.saga.courseId, PurchaseState.Cancelled);

    return {
      user: this.saga.user,
    }
  }
  }
