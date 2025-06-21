import { faker } from "@faker-js/faker";
import { db } from "~/db/db";
import { Id } from "~/domain/id";
import { user } from "~/db/schema/auth";
import { task } from "~/db/schema/others";

type User = typeof user.$inferInsert;
type Task = typeof task.$inferInsert;

async function main() {
  await db.delete(task);
  await db.delete(user);

  const insertUsers = await db
    .insert(user)
    .values(generateUsers(10))
    .$returningId();

  const insertUserIDs = insertUsers.map((user) => user.id);

  await db.insert(task).values(generateTasks(100, insertUserIDs));
}

function generateUsers(count: number): User[] {
  return Array.from({ length: count }, () => ({
    id: Id.newId(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    role: faker.helpers.arrayElement(["employee", "employer"]),
  }));
}

function generateTasks(count: number, userIDs: string[]): Task[] {
  return Array.from({ length: count }, () => ({
    id: Id.newId(),
    title: faker.company.catchPhrase(),
    status: faker.helpers.arrayElement([
      "todo",
      "inprogress",
      "done",
      "pending",
      "rejected",
    ]),
    createdBy: faker.helpers.arrayElement(userIDs),
    assignedTo: faker.helpers.arrayElement(userIDs),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
  }));
}

main()
  .then(() => {
    console.log("🌱 Seed success! ✨");
  })
  .catch((error) => {
    console.error("🚫 Seed failed:", error);
  })
  .finally(() => {
    process.exit(0);
  });
