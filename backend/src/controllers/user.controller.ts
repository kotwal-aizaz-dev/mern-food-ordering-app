import { Request, Response } from "express";
import User from "../models/user.model";

// Retrieve the current user's information from the database
export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    // Find user by ID stored in request object (set by auth middleware)
    const currentUser = await User.findOne({ _id: req.userId });
    if (!currentUser) {
      res.status(404).json({ message: "User not found" });
    }

    res.json(currentUser);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// Create a new user or handle existing user from Auth0 authentication
export const createCurrentUser = async (req: Request, res: Response) => {
  try {
    const { auth0Id } = req.body;
    // Check if user already exists with the given Auth0 ID
    const existingUser = await User.findOne({ auth0Id });

    // If user exists, return success without creating new user
    if (existingUser) {
      res.status(200).send();
    }

    // Create and save new user with data from request body
    const newUser = new User(req.body);
    await newUser.save();

    res.status(201).json(newUser.toObject());
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error creating user" });
  }
};

// Update the current user's profile information
export const updateCurrentUser = async (req: Request, res: Response) => {
  try {
    const { name, addressLine1, country, city } = req.body;

    // Validate that all required fields are provided
    if (!name || !addressLine1 || !country || !city) {
      res.status(400).json({ message: "All fields are required" });
    }

    // Find user by ID from request object
    const user = await User.findById(req.userId);

    if (!user) {
      res.status(404).json({ message: "User not found" });
    }
    else {

      // Update user fields with new information
      user.name = name;
      user.addressLine1 = addressLine1;
      user.city = city;
      user.country = country;
      
      // Save updated user information
      await user.save();
      
      res.status(200).json(user.toObject());
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error updating user" });
  }
};
