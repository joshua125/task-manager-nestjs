import { User } from "src/auth/user.entity";
import { EntityRepository, Repository } from "typeorm";
import { CreateTaskDto } from "./dto/create-task.dto";
import { GetTaskFilterDTO } from "./dto/get-tasks-filter.dto";
import { Task } from "./dto/task.entity";
import {  TaskStatus } from './models/task.status';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {

    async getTasks(filterDTO: GetTaskFilterDTO, user: User): Promise<Task[]>{
        const {status , search} = filterDTO;

        const query = this.createQueryBuilder('task');
        query.where({user})

        if (status){
            query.andWhere('task.status = :status', {status: 'OPEN'})
        }

        if(search){
            query.andWhere(
                'LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.desc) LIKE LOWER(:search)',
                { search: `%${search}%`}
            )
        }
        
        const tasks = await query.getMany();

        return tasks
    }

    async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task>{
        const {title, desc} = createTaskDto
        const task = this.create({
            title,
            desc,
            status: TaskStatus.OPEN,
            user
        });

        await this.save(task);
        return task;
    }



}