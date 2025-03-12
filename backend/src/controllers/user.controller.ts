import { Request, Response } from "express";
import User from "../models/User.model";

 export const createUser = async (
  req: Request,
  res: Response
) => {
  try {
    const { auth0Id } = req.body;
    if (!auth0Id) {
      return res.status(400).json({ message: "auth0Id is required" });
    }
    const existingUser = await User.findOne({ auth0Id });
    if (existingUser) {
      return res.status(200).json({
        message: "User already exists",
      });
    }
    console.log(req.body)
    const newUser = new User(req.body);
    console.log(newUser)
    await newUser.save();

    res.status(201).json({
      message: "success",
      data: newUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error creating user", error: error });

  }
};

