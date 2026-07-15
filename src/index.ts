import express from "express";
import { eq } from "drizzle-orm";
import { db } from "./db";
import { demoUsers } from "./db/schema";

const app = express();
const port = 8000;

app.use(express.json());

app.get("/", (_req, res) => {
  res.json({ message: "Hello from Express!" });
});

async function runCrudDemo() {
  if (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes("[user]")) {
    console.log("DATABASE_URL is not configured. Skipping CRUD demo.");
    return;
  }

  if (!db) {
    console.log("Drizzle database client is unavailable. Skipping CRUD demo.");
    return;
  }

  try {
    console.log("Performing CRUD operations...");

    const [newUser] = await db
      .insert(demoUsers)
      .values({ name: "Admin User", email: "admin@example.com" })
      .returning();

    if (!newUser) {
      throw new Error("Failed to create user");
    }

    console.log("✅ CREATE: New user created:", newUser);

    const foundUser = await db
      .select()
      .from(demoUsers)
      .where(eq(demoUsers.id, newUser.id));
    console.log("✅ READ: Found user:", foundUser[0]);

    const [updatedUser] = await db
      .update(demoUsers)
      .set({ name: "Super Admin" })
      .where(eq(demoUsers.id, newUser.id))
      .returning();

    if (!updatedUser) {
      throw new Error("Failed to update user");
    }

    console.log("✅ UPDATE: User updated:", updatedUser);

    await db.delete(demoUsers).where(eq(demoUsers.id, newUser.id));
    console.log("✅ DELETE: User deleted.");

    console.log("\nCRUD operations completed successfully.");
  } catch (error) {
    console.error("❌ Error performing CRUD operations:", error);
  }
}

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

void runCrudDemo();
