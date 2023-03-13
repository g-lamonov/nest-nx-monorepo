import { PurchaseState } from "@nest-monorepo/interfaces";
import { RMQService } from "nestjs-rmq";
import { UserEntity } from "../entities/user.entity";

export class BuyCourseSaga {
  private state: unknown;

  constructor(private courseId: string, private user: UserEntity, private rmqService: RMQService) {}

  setState(courseId: string, state: PurchaseState) {
    switch (state) {
      case PurchaseState.Started:
        // TODO
        break;
      case PurchaseState.WaitingForPayment:
        // TODO
        break;
      case PurchaseState.Purchased:
        // TODO
        break;
      case PurchaseState.Cancelled:
        // TODO
        break;
      }

      this.user.updateCourseStatus(courseId, state);
  }

  getState() {
    return this.state;
  }
}