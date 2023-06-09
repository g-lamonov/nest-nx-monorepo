import { PurchaseState } from "@nest-monorepo/interfaces";
import { RMQService } from "nestjs-rmq";
import { UserEntity } from "../../entities/user.entity";
import { BuyCourseSagaState } from "./buy-course.state";
import { BuyCourseSagaStatePurchased, BuyCourseSagaStateWaitingForPayment, BuyCourseSagaStateStarted, BuyCourseSagaStateCancelled } from "./buy-course.steps";

export class BuyCourseSaga {
  private state: BuyCourseSagaState;

  constructor(public courseId: string, public user: UserEntity, public rmqService: RMQService) {}

  setState(courseId: string, state: PurchaseState) {
    switch (state) {
      case PurchaseState.Started:
        this.state = new BuyCourseSagaStateStarted();
        break;
      case PurchaseState.WaitingForPayment:
        this.state = new BuyCourseSagaStateWaitingForPayment();
        break;
      case PurchaseState.Purchased:
        this.state = new BuyCourseSagaStatePurchased();
        break;
      case PurchaseState.Cancelled:
        this.state = new BuyCourseSagaStateCancelled();
        break;
      default:
        throw new Error(`${state} not implemented`);
    }

    this.state.setContext(this);
    this.user.setCourseStatus(courseId, state);
  }

  getState() {
    return this.state;
  }
}
