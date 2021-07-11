import { TaskStatus } from "../models/task.status";

export class GetTaskFilterDTO {
    status?: TaskStatus
    search?: string
}