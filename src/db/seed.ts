import { faker } from "@faker-js/faker";
import { db } from "~/db/db";
import { Id } from "~/domain/id";

import { tasks, users } from "~/db/schema";

type User = typeof users.$inferInsert;
type Task = typeof tasks.$inferInsert;

async function main() {
  await db.delete(tasks);
  await db.delete(users);

  const insertUsers = await db
    .insert(users)
    .values(generateUsers(10))
    .$returningId();

  const insertUserIDs = insertUsers.map((user) => user.id);

  await db.insert(tasks).values(generateTasks(10, insertUserIDs));
}

function generateUsers(count: number): User[] {
  return Array.from({ length: count }, () => ({
    id: Id.newId(),
    role: faker.helpers.arrayElement(["employee", "employer"]),
  }));
}

function generateTasks(count: number, userIDs: string[]) {
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
    console.log("Seed success!");
  })
  .catch((error) => {
    console.error("Seed failed:", error);
  })
  .finally(() => {
    process.exit(0);
  });
