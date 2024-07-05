import mongoose, { Document, Schema } from 'mongoose';

interface IUser extends Document {
    account: string;
    password: string;
    tokenVersion: number;
}

const UserSchema: Schema = new Schema({
    account: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    tokenVersion: { type: Number, default: 0 }  
});

export default mongoose.model<IUser>('User', UserSchema);
