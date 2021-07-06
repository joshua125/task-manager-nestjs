import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CreateTaskDto } from '../dto/create-task.dto';
import { GetTaskFilterDTO } from '../dto/get-tasks-filter.dto';
import { Task, TaskStatus } from '../models/task.model';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
    constructor(private tasksService: TasksService){

    }

    @Get()
    getTasks(@Query() filterDTO: GetTaskFilterDTO): Task[]{
        if (Object.keys(filterDTO).length){
            return this.tasksService.getTasksWithFilters(filterDTO)
        }else{
            return this.tasksService.getAllTask()
        }
    }
    @Post()
    createTask(@Body() createTaskDto: CreateTaskDto): Task{
         return this.tasksService.createTask(createTaskDto);

    }
    @Get('/:id')
    getTaskById(@Param('id') id: string): Task{
        console.log(this.tasksService.getTaskById(id))
        return this.tasksService.getTaskById(id)
    }

    // @Patch('/:id')
    // updateTaskById(@Param('id') id: string, @Body() createTaskDto: CreateTaskDto): void{
    //     this.tasksService.updateTaskById(createTaskDto, id);
    // }

    @Patch('/:id/status')
    updateTaskStatus(@Param('id')id: string, @Body('status') status: TaskStatus): Task{
        return this.tasksService.updateTaskStatus(id, status);
    }

    @Delete('/:id')
    deleteTaskById(@Param('id') id: string): void{
         this.tasksService.deleteTaskById(id)
    }
}
