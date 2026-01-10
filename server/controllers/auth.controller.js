import * as authService from '../services/auth.service.js';
import { success, error } from '../utils/response.js';

export const signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const result = await authService.signup(name, email, password);

    res.status(201).json(success(result, 'User created successfully'));
  } catch (err) {
    if (err.message === 'User with this email already exists') {
      return res.status(409).json(error(err.message, 409));
    }
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const result = await authService.login(email, password);

    res.json(success(result, 'Login successful'));
  } catch (err) {
    if (err.message === 'Invalid email or password') {
      return res.status(401).json(error(err.message, 401));
    }
    next(err);
  }
};

export const getCurrentUser = async (req, res, next) => {
  try {
    const user = await authService.getCurrentUser(req.user.id);

    res.json(success(user));
  } catch (err) {
    next(err);
  }
};

export const logout = async (req, res) => {
  // For JWT, logout is handled client-side by removing the token
  res.json(success(null, 'Logout successful'));
};
