import { Admin, Laptops } from '../db/index.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import z from 'zod';
import { JWT_SECRET } from '../server.js';

// ZOD validation for login

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

/** @desc create Admin
 * @route GET /api/v1/adminLogin
 * @access public
 */

/*
async function createAdmin(req, res) {
  const { email, password } = req.body;
  const response = await Admin.findOne({ email });
  if (response) {
    return res.status(400).json({ message: 'Admin already exists' });
  }
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPasswod = await bcrypt.hash(password, salt);

    await Admin.create({ email, password: hashedPasswod });
    res.status(201).json({ message: `${email} admin created successfully` });
  } catch (error) {
    res.status(403).json({ message: 'error while creating admin' });
  }
}
  */

/** @desc login
 * @route POST /api/v1/login
 * @access public
 */

async function login(req, res) {
  const { email, password } = req.body;
  const { success } = loginSchema.safeParse(req.body);

  if (!success) {
    return res
      .status(411)
      .json({ message: 'Email already taken / incorrect inputs' });
  }

  const response = await Admin.findOne({ email });
  if (!response) {
    return res.status(400).json({ message: "Admin doesn't exists" });
  }

  try {
    const validPass = await bcrypt.compare(password, response.password);
    if (!validPass) {
      return res.status(411).json({ message: 'invalid password' });
    }
    console.log('one');
    const userId = response._id;
    const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '12h' });
    if (token) {
      res.status(200).json({
        message: `user ${response.email} logged in successfully`,
        token,
      });
    }
  } catch (error) {
    res.status(403).json({ message: 'error while loggin in' });
  }
}

/** @desc get all laptops
 * @route GET /api/v1/allLaptops
 * @access public
 */

async function getAllItems(req, res) {
  const details = await Laptops.find({});
  res.status(200).json({
    status: 'success',
    data: details,
  });
}

/**
 * @desc add new laptop
 * @route POST /api/v1/addLaptop
 * @access public
 */

async function addNewLaptop(req, res) {
  try {
    const {
      laptopName,
      laptopPass,
      systemId,
      assignedTo,
      ownedBy,
      ownerName,
      accessories,
      remark,
      empId,
      date,
    } = req.body;

    const laptop = await Laptops.create({
      laptopName,
      laptopPass,
      systemId,
      assignedTo,
      ownedBy,
      ownerName,
      accessories,
      remark,
      empId,
      date,
      history: [],
    });

    const laptops = await Laptops.find({});
    res.status(200).json({
      status: 'success',
      data: laptops,
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
}

/**
 * @desc re assign to user
 * @route PUT /api/v1/reAssign/:id
 * @access public
 */

// , laptopName, systemId

async function reAssign(req, res) {
  const { empId, assignedTo, date, remark, accessories } = req.body;
  const { id } = req.params;
  const prevUser = await Laptops.findById({ _id: id });
  if (prevUser.assignedTo !== assignedTo) {
    const laptop = await Laptops.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          empId,
          assignedTo,
          date,
          remark,
          accessories,
          history: [
            ...prevUser.history,
            {
              empId: prevUser.empId,
              assignedTo: prevUser.assignedTo,
              fromDate: prevUser.date,
              toDate: date,
              accessories: prevUser.accessories,
              laptopName: prevUser.laptopName,
              systemId: prevUser.systemId,
            },
          ],
        },
      }
    );
  }
  const finalData = await Laptops.find({});
  res.status(200).json({
    message: 'data updated successfully',
    data: finalData,
    prevUserDetails: prevUser,
  });
}

/**
 * @desc delete entry
 * @route POST /api/v1/delete/:id
 * @access public
 */

async function deleteLaptop(req, res) {
  const { id } = req.params;

  try {
    await Laptops.deleteOne({ _id: id });
    const data = await Laptops.find({});
    res.status(200).json({ message: 'success on deletion', data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ err });
  }
}

/**
 * @desc get laptops history
 * @route POST /api/v1/history/:id
 * @access public
 */

async function getHistory(req, res) {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        status: 'error',
        message: 'ID  missing',
      });
    }

    const history = await Laptops.findById(id);

    if (!history) {
      return res.status(404).json({
        status: 'error',
        message: 'Laptop not found',
      });
    }
    res.status(200).json({
      status: 'success',
      data: history,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'An error occurred while retrieving the history',
      error: error.message,
    });
  }
}

export { getAllItems, addNewLaptop, reAssign, deleteLaptop, getHistory, login };
