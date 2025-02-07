import "~/common/instrumentation";

import { makeTaskRepository } from "~/adapters/drizzle-task-repository";
import { makeUserRepository } from "~/adapters/drizzle-user-repository";
import type { App } from "~/app";
import { makeCommandAddUser } from "~/app/command/add-user";
import { makeQueryAllUsers } from "~/app/query/all-users";
import { log } from "~/common/logger";
import { runHttpServer } from "~/ports/http/server";
import { makeCommandCreateTask } from "~/app/command/create-task";

async function main() {
  const userRepository = makeUserRepository();
  const taskRepository = makeTaskRepository();

  const app: App = {
    command: {
      addUser: makeCommandAddUser({ users: userRepository }),
      createTask: makeCommandCreateTask({ tasks: taskRepository }),
    },
    query: {
      allUsers: makeQueryAllUsers({ users: userRepository }),
    },
  };

  runHttpServer(app);
}

main().catch((error) => {
  log.error(error);
});
