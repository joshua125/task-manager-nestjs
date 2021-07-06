import { TaskStatus } from "../models/task.model";

export class GetTaskFilterDTO {
    status?: TaskStatus
    search?: string
}