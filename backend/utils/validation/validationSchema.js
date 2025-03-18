import Joi from "joi";

const userSchema = Joi.object({
  name: Joi.string().min(3).max(30).required().messages({
    "string.base": "Name must be a string.",
    "string.empty": "Name is required.",
    "string.min": "Name must be at least 3 characters long.",
    "string.max": "Name cannot exceed 30 characters.",
    "any.required": "Name is required.",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Please enter a valid email address.",
    "string.empty": "Email is required.",
    "any.required": "Email is required.",
  }),
  password: Joi.string().min(8).required().messages({
    "string.base": "Password must be a string.",
    "string.min": "Password must be at least 8 characters long.",
    "string.max": "Password is required.",
    "any.required": "Password is required.",
  }),
});

export { userSchema };
