import { Controller, Get, Post, Put, Body, Param, Query, HttpCode, HttpStatus, Headers, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginDto } from './dto/login-user.dto';

@Controller('users')
export class UsersController {
    constructor(private readonly userService: UsersService) { }

    @Get()
    async findAll(
        @Query('page') page: string = '1',
        @Query('limit') limit: string = '20',
        @Query('sort') sort: 'asc' | 'desc' = 'desc'
    ) {
        const pageSafe = Math.max(1, parseInt(page) || 1);
        const limitSafe = Math.min(100, Math.max(1, parseInt(limit) || 20))

        return await this.userService.findAll(pageSafe, limitSafe, sort)
    }

    @Get(':id')
    async findById(@Param('id') id: string) {
        return await this.userService.findById(Number(id))
    }

    @Get('filter')
    async findByData(
        @Body('filter') filter: string
    ) {
        return await this.userService.findByData(filter)
    }

    @Post("create")
    @HttpCode(HttpStatus.CREATED)
    async createUser(
        @Body() createUserDto: CreateUserDto
    ) {
        return await this.userService.createUser(createUserDto)
    }

    @Put('update/:id')
    async updateUser(
        @Param('id') id: string,
        @Body() updateUserDto: UpdateUserDto
    ) {
        return await this.userService.updateUser(updateUserDto, Number(id));
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(
        @Body() loginDto: LoginDto
    ) {
        return await this.userService.login(loginDto)
    }

    @Delete('delete/:id')
    async deleteUser(
        @Param('id') id: string
    ) {
        return await this.userService.deleteUser(Number(id))
    }
}
