import  { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { IUser, UserRole, IUserCourse, PurchaseState, } from '@nest-monorepo/interfaces';
import { Document, Types, } from 'mongoose';

@Schema()
export class UserCourse extends Document implements IUserCourse {
    @Prop({ required: true })
    courseId: string;

    @Prop({ required: true, enum: PurchaseState, type: String })
    purchaseState: PurchaseState;
}
export const UserCourseSchema = SchemaFactory.createForClass(UserCourse);

@Schema()
export class User extends Document implements IUser {
    @Prop()
    displayName: string;

    @Prop({ required: true })
    email: string;

    @Prop({ required: true })
    passwordHash: string;

    @Prop({ required: true, enum: UserRole, type: String, default: UserRole.Student })
    role: UserRole;

    @Prop({ type: [UserCourseSchema] })
    courses: Types.Array<UserCourse>
}

export const UserSchema = SchemaFactory.createForClass(User);