import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => console.log('DataBase is connected successfully...!'));

const adminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    minLength: 3,
    maxLength: 30,
  },
  password: { type: String, required: true, minLength: 6 },
});

/**
 * Account Schema
 * @module models/historySchema
 * @requires mongoose
 */

const laptopHistory = new mongoose.Schema({
  systemId: { type: String, required: true },
  laptopName: { type: String, required: true },
  empId: { type: String, required: true },
  assignedTo: { type: String, required: true },
  fromDate: { type: String, required: true },
  toDate: { type: String, required: true },
  accessories: [
    {
      name: { type: String, required: true },
      id: { type: String, required: true }
    },
  ],
});

/**
 * Account Schema
 * @module models/laptopSchema
 * @requires mongoose
 */

const laptopSchema = new mongoose.Schema({
  systemId: { type: String, required: true },
  laptopName: {
    type: String,
    required: true,
    minLength: 3,
  },
  laptopPass: { type: String, required: true, minLength: 1 },
  date: { type: String, required: true },
  ownedBy: { type: String, required: true, default: 'Company' },
  ownerName: { type: String, default: 'Panorama' },
  accessories: [
    {
      name: { type: String, required: true },
      id: { type: String, required: true }
    },
  ],
  assignedTo: {
    type: String,
    required: true,
    minLength: 2,
    trim: true,
    default: 'N/A',
  },
  empId: { type: String, required: true, trim: true },
  remark: { type: String, default: 'None' },
  history: [laptopHistory],
});

laptopSchema.pre('save', function (next) {
  if (this.ownerName.length === 0) this.ownerName = 'Panorama';
  next();
});

// EmpSchema for enter employee detailed-------------------------
const empSchema = new mongoose.Schema({
  empId: { type: String, required: true },
  empName: { type: String, required: true },
  empDob: { type: String, required: true },
  /*   empPhone:{type:Number, required:true}, */
  empPhone: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^[0-9]+$/.test(v); // Regular expression to ensure only numbers
      },
      message: (props) =>
        `${props.value} is not a valid phone number! Only numeric values are allowed.`,
    },
  },
  empEmail: { type: String, required: true },
  address: { type: String },
});
const Admin = mongoose.model('Admin', adminSchema);
const Laptops = mongoose.model('Laptops', laptopSchema);
const Employee = mongoose.model('Employee', empSchema);
// const History = mongoose.model("History", laptopHistory);

export { Laptops, Admin, Employee };

// history :- laptop history - username, userId, accessories, date
