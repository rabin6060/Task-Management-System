import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import CustomError from '../../../utils/Error';

export interface User {
  username:string,
  email: string;
  password: string;
  pin?:string,
  verificationAttempt?:number | 0,
  accessToken?:string
}

export const userPrivateFields = ['password', '__v', 'createdAt', 'updatedAt'];

export interface UserDocument extends User {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema<UserDocument>(
  {
     username: {
      type: String,
      required: [true, 'Username is Required'],
    },
   
    email: {
      type: String,
      required: [true, 'Email is Required'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Password is Required'],
      unique: false,
    },
    pin:{
      type:String,
      required:false,
    },
    verificationAttempt:{
      type:Number,
      default:0
    },
    accessToken:{
      type:String,
      required:false
    }
  },
  {
    timestamps: true,
  },
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    if (err instanceof Error) next(err);
  }
});

userSchema.methods.comparePassword = async function (candidatePassword: string) {
  if (!this.password) throw new CustomError('Invalid password or email', 401);
  return await bcrypt.compare(candidatePassword, this.password);
};

export const UserModel = mongoose.model<UserDocument>('user', userSchema);
