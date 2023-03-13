import { PaymentStatus } from '@nest-monorepo/interfaces';
import { IsString, } from 'class-validator';

export namespace AccountCheckPayment {
  export const topic = 'account.check-payment.command';

  export class Request {
    @IsString()
    userId: string;

    @IsString()
    courseId: string;
  }

  export class Response {
    status: PaymentStatus;
  }
}
