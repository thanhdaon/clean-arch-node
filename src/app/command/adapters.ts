import type { Task } from "~/domain/task/task";
import type { User } from "~/domain/user/user";

export interface TaskRepository {
  add(task: Task): Promise<void>;
  updateById(id: string, updateFn: (target: Task) => Task): Promise<void>;
}

export interface UserRepository {
  add(task: User): Promise<void>;
  findById(id: string): Promise<User | undefined>;
  updateById(id: string, updatefn: (target: User) => User): Promise<void>;
}
