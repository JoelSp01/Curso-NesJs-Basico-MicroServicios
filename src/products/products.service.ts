import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaClient } from '@prisma/client';
import { PaginationDto } from 'src/common';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {

  private readonly logger = new Logger('ProductsService');

  onModuleInit() {
    this.$connect();
    this.logger.log('Connected to the database');
  }
  create(createProductDto: CreateProductDto) {
    return this.product.create({
      data: createProductDto
    })
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;

    const totalPages = await this.product.count();

    return {
      data: await this.product.findMany({
        skip: (page - 1) * limit,
        take: limit,
        where:{
          available: true
        }
      }),
      meta: {
        total: totalPages,
        page: page,
      }
    }
  }

  findOne(id: number) {
    return this.product.findUnique({
      where: {
        id
      }
    })
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return this.product.update({
      where: {
        id
      },
      data: updateProductDto
    })
  }

  remove(id: number) {
    return this.product.update({
      where: {id},
      data:{
        available: false
      }
    })
  }

}
