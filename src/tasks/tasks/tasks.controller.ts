import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { CreateTaskDto } from '../dto/create-task.dto';
import { GetTaskFilterDTO } from '../dto/get-tasks-filter.dto';
import { Task } from '../dto/task.entity';
import {  TaskStatus } from '../models/task.status';
import { TasksService } from './tasks.service';


@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
    constructor(private tasksService: TasksService){

    }

    

    @Get()
    getTasks(@Query() filterDTO: GetTaskFilterDTO, @GetUser() user: User): Promise<Task[]>{
        return this.tasksService.getTasks(filterDTO, user)
    }
    @Post()
    createTask(
        @Body() createTaskDto: CreateTaskDto,
        @GetUser() user: User): Promise<Task>{
         return this.tasksService.createTask(createTaskDto, user);
    }

    @Get('/:id')
    getTaskById(@Param('id') id : string, @GetUser() user: User): Promise<Task>{
        return this.tasksService.getTaskById(id, user);
    }
    // @Get('/:id')
    // getTaskById(@Param('id') id: string): Task{
    //     console.log(this.tasksService.getTaskById(id))
    //     return this.tasksService.getTaskById(id)
    // }

    // // @Patch('/:id')
    // // updateTaskById(@Param('id') id: string, @Body() createTaskDto: CreateTaskDto): void{
    // //     this.tasksService.updateTaskById(createTaskDto, id);
    // // }

    @Patch('/:id/status')
    updateTaskStatus(@Param('id')id: string, @Body('status') status: TaskStatus, @GetUser() user: User): Promise<Task>{
        return this.tasksService.updateTaskStatus(id, status, user);
    }

    @Delete('/:id')
    deleteTaskById(@Param('id') id: string, @GetUser() user: User): Promise<void>{
        return this.tasksService.deleteTaskById(id, user)
     }
}
