import { Router } from 'express';
import {
  addEmployee,
  getEmpById,
  updateEmpById,
  deleteEmpById,
} from '../controllers/employeeController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

/**
 * @desc add new Employee
 * @route POST /api/v2/addemp
 * @access public
 */
router.post('/addemp', authMiddleware, addEmployee);

/**
 * @desc get Employee
 * @route GET /api/v2/getemp
 * @access public
 */
router.get('/getemp/:id', authMiddleware, getEmpById);

/**
 * @desc Update Employee
 * @route GET/api/v2/updatemp
 * @access public
 */
router.put('/updateemp/:id', authMiddleware, updateEmpById);

/**
 * @desc Delete Employee By Id
 * @route delete/api/v2/deleteemp
 * @access public
 */
router.delete('/deleteemp/:id', authMiddleware, deleteEmpById);

export { router };
