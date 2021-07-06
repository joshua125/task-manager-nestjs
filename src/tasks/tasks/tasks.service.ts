import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from '../models/task.model';
import {v4 as uuid} from 'uuid'
import { CreateTaskDto } from '../dto/create-task.dto';
import { GetTaskFilterDTO } from '../dto/get-tasks-filter.dto';

@Injectable()
export class TasksService {

    private tasks: Task[] = [];

    getAllTask(): Task[]{
        console.log(this.tasks)
        return this.tasks
    }

    getTasksWithFilters(filterDTO: GetTaskFilterDTO): Task[]{
        const {status, search} = filterDTO;

        let tasks = this.getAllTask();

        if( status){
            tasks = tasks.filter((task)=> task.status == status)
        }

        if(search){
            tasks = tasks.filter((task) => {
                if (task.title.includes(search) || task.desc.includes(search)){
                    return true
                }
                return false
            })
        }

        return tasks
    }

    createTask(createTaskDto: CreateTaskDto): Task{

        const {title, desc} = createTaskDto

        const task: Task = {
            id: uuid(),
            title,
            desc,
            status: TaskStatus.OPEN,
        }

        this.tasks.push(task)
        return task
    }

    getTaskById(id: string){



        const found =  this.tasks.find((task)=> task.id === id)

        if(!found){
            throw new NotFoundException(`Task with id ${id} not found`);
        }
        return found
    }


    updateTaskById(update: CreateTaskDto, id: string): void{
        this.tasks.map((task)=>{
            if (task.id === id && update.title){
                task.title = update.title
            }else if(task.id === id ){
                task.desc = update.desc
            }
        })
    }

    updateTaskStatus(id: string, status: TaskStatus){
        const task = this.getTaskById(id)
        task.status = status;
        return task;
    }

    deleteTaskById(id: string): void{
        const found = this.getTaskById(id);
        
        this.tasks = this.tasks.filter((task) => task.id !== id)
    }
}
