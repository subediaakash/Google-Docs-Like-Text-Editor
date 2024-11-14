import jwt from "jsonwebtoken";
import { prisma } from "../../utils/db.js";
import bcrypt from "bcrypt";

export const signIn = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const payload = {
      email: user.email,
      id: user.id,
    };

    const token = createToken(payload);

    return res.status(200).json({ message: "Login successful", token: token });
  } catch (error) {
    console.error("Error during sign-in:", error);
    return res
      .status(500)
      .json({ message: "An internal server error occurred" });
  } finally {
    await prisma.$disconnect();
  }
};

export const signUp = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return res.status(400).json({ message: "The user already exists" });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const data = {
      email,
      password: hashedPassword,
    };

    const newUser = await prisma.user.create({
      data: data,
    });

    const token = jwt.sign({ email: email, id: newUser.id }, JWT_SECRET);
    return res
      .status(200)
      .json({ message: "User created successfully", token: token });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
