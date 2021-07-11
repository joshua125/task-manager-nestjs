import { Get, Injectable, NotFoundException } from '@nestjs/common';
import {  TaskStatus } from '../models/task.status';
// import {v4 as uuid} from 'uuid' removed in refactor :: handled by TypeORM entity
import { CreateTaskDto } from '../dto/create-task.dto';
import { GetTaskFilterDTO } from '../dto/get-tasks-filter.dto';
import { TaskRepository } from '../tasks.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from '../dto/task.entity';
import { User } from 'src/auth/user.entity';
import { GetUser } from 'src/auth/get-user.decorator';

@Injectable()
export class TasksService {

    constructor(
        @InjectRepository(TaskRepository)
        private taskRepo: TaskRepository){

    }

    getTasks(filterDTO: GetTaskFilterDTO, user: User): Promise<Task[]>{
        return this.taskRepo.getTasks(filterDTO, user);
    }

    // private tasks: Task[] = [];

    // getAllTask(): Task[]{
    //     console.log(this.tasks)
    //     return this.tasks
    // }

    // getTasksWithFilters(filterDTO: GetTaskFilterDTO): Task[]{
    //     const {status, search} = filterDTO;

    //     let tasks = this.getAllTask();

    //     if( status){
    //         tasks = tasks.filter((task)=> task.status == status)
    //     }

    //     if(search){
    //         tasks = tasks.filter((task) => {
    //             if (task.title.includes(search) || task.desc.includes(search)){
    //                 return true
    //             }
    //             return false
    //         })
    //     }

    //     return tasks
    // }

     createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task>{
        return this.taskRepo.createTask(createTaskDto, user);
    }
    // createTask(createTaskDto: CreateTaskDto): Task{

    //     const {title, desc} = createTaskDto

    //     const task: Task = {
    //         id: uuid(),
    //         title,
    //         desc,
    //         status: TaskStatus.OPEN,
    //     }

    //     this.tasks.push(task)
    //     return task
    // }

    async getTaskById(id: string, @GetUser() user: User): Promise<Task>{
        const found = await this.taskRepo.findOne({where: {id, user}})

        if(!found){
            throw new NotFoundException
        }
        return found;
    }
    // getTaskById(id: string){



    //     const found =  this.tasks.find((task)=> task.id === id)

    //     if(!found){
    //         throw new NotFoundException(`Task with id ${id} not found`);
    //     }
    //     return found
    // }


    // updateTaskById(update: CreateTaskDto, id: string): void{
    //     this.tasks.map((task)=>{
    //         if (task.id === id && update.title){
    //             task.title = update.title
    //         }else if(task.id === id ){
    //             task.desc = update.desc
    //         }
    //     })
    // }

    async updateTaskStatus(id: string, status: TaskStatus, @GetUser() user: User){
        const task = await this.getTaskById(id, user )
        task.status = status;
        await this.taskRepo.save(task)
        return task;
    }

     async deleteTaskById(id: string, @GetUser() user: User): Promise<void>{
        const result = await this.taskRepo.delete({id , user})
        if(result.affected === 0){
            throw new NotFoundException(`Task with id ${id} not found`)
        }
    }
    // deleteTaskById(id: string): void{
    //     const found = this.getTaskById(id);
        
    //     this.tasks = this.tasks.filter((task) => task.id !== id)
    // }
}
