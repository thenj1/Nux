import { Injectable, NotFoundException, ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserRepository } from './users.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginDto } from './dto/login-user.dto';
import { LoginResponse, PaginatedResponse, RefreshTokenResponse, UserResponse } from './dto/user-response.dto';

@Injectable()
export class UsersService {
    constructor(private userRepository: UserRepository, private jwt: JwtService) { }

    async findAll(pages: number, limit: number, sort: 'asc' | 'desc' = 'desc'): Promise<PaginatedResponse<UserResponse>> {
        const skip = (pages - 1) * limit;
        const { data: users, total } = await this.userRepository.findAll(skip, limit, sort)

        if (total == 0) {
            throw new NotFoundException('No users found')
        }

        const totalPages = Math.ceil(total / limit);
        const Safeuser = users.map(userData => {
            const { password: _, ...usersSafe } = userData;
            return usersSafe
        })

        return {
            data: Safeuser,
            meta: {
                pages,
                limit,
                total,
                totalPages
            }
        }
    }

    async findById(id: number): Promise<UserResponse> {
        const user = await this.userRepository.findById(id);

        if (!user) {
            throw new NotFoundException('User not found')
        }
        const { password: _, ...userSafe } = user;

        return userSafe
    }

    async findByData(data: any): Promise<UserResponse> {
        const user = await this.userRepository.findData(data);

        if (!user) {
            throw new NotFoundException('User not found')
        }
        const { password: _, ...userSafe } = user;

        return userSafe
    }

    async createUser(data: CreateUserDto): Promise<UserResponse> {
        const { email, name, password } = data

        const userAlreadyExist = await this.userRepository.findData({ email });
        if (userAlreadyExist) {
            throw new ConflictException('User already exists')
        }

        const passwordHashed = await bcrypt.hash(password, 10);

        const user = await this.userRepository.createUser({
            email,
            name,
            password: passwordHashed
        })
        const { password: _, ...userSafe } = user;

        return userSafe;
    }

    async updateUser(data: UpdateUserDto, id: number): Promise<UserResponse> {
        const { email, name, password } = data;

        const userExist = await this.userRepository.findData({ email });
        if (!userExist) {
            throw new NotFoundException('User not found')
        }

        let newPassword = userExist.password
        if (password) {
            newPassword = await bcrypt.hash(password, 10)
        }

        const userUpdated = await this.userRepository.updateUser({
            email: email || userExist.email,
            name: name || userExist.name,
            password: newPassword
        }, id)

        const { password: _, ...userSafe } = userUpdated;

        return userSafe;
    }

    async deleteUser(id: number): Promise<{ message: string }> {
        const userExist = await this.userRepository.findById(id);
        if (!userExist) {
            throw new NotFoundException('User not found')
        }

        await this.userRepository.deleteUser(userExist.id);

        return { message: 'user deleted successfully' }
    }

    async login(data: LoginDto): Promise<LoginResponse> {
        const { email, password } = data;
        const userExist = await this.userRepository.findData({ email });

        if (!userExist) {
            throw new NotFoundException('User not found')
        }

        const passwordMatch = await bcrypt.compare(password, userExist.password);
        if (!passwordMatch) {
            throw new UnauthorizedException('Email or password incorrect')
        }

        const token = this.jwt.sign(
            {
                id: userExist.id,
                name: userExist.name,
                email: userExist.email,
            },
            { expiresIn: "30m" }
        )

        const refreshToken = this.jwt.sign({
            id: userExist.id,
            name: userExist.name,
            email: userExist.email
        }, 
        { 
            expiresIn: "7d",
            secret: process.env.JWT_SECRET_REFRESH
        } 
        )

        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7)

        await this.userRepository.createRefreshToken({
            token: refreshToken,
            user:{
                connect: {
                    id: userExist.id
                }
            },
            expiresAt
        })

        const { password: _, ...userSafe } = userExist;
        return { user: userSafe, token, refreshToken }
    }

    async refreshAcessToken(refreshToken: string): Promise<RefreshTokenResponse> {
        const refreshTokenExist = await this.userRepository.findRefreshToken(refreshToken)
        if(!refreshTokenExist){
            throw new NotFoundException('Token not found')
        }

        if(refreshTokenExist.expiresAt < new Date()){
            await this.userRepository.deleteRefreshToken(refreshTokenExist.id);
            throw new UnauthorizedException('Token invalid')
        }

        await this.userRepository.deleteRefreshToken(refreshTokenExist.id);

        const userFound = await this.findById(refreshTokenExist.userId);
        if(!userFound){
            throw new NotFoundException('User not found')
        }

        const token = await this.jwt.sign({
            id: userFound.id,
            email: userFound.email,
            name: userFound.name
        },
        { expiresIn: "30m" }
        )

        const newRefreshToken = await this.jwt.sign({
            id: userFound.id,
            email: userFound.email,
            name: userFound.name
        },
        {
            expiresIn: "7d",
            secret: process.env.JWT_SECRET_REFRESH
        }
        )
        
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);

        await this.userRepository.createRefreshToken({
            token: newRefreshToken,
            user: {
                connect: {
                    id: userFound.id
                }
            },
            expiresAt
        })
        return { token, refreshToken: newRefreshToken }
    }

    async logout(refreshToken: string): Promise<{ message: string }> {
        const token = await this.userRepository.findRefreshToken(refreshToken);
        if(!token){
            throw new NotFoundException('Token not found')
        }

        await this.userRepository.deleteRefreshToken(token.id);
        return { message: "Logout sucessfully" };
    }
}

