import { HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { PrismaClient } from '@prisma/client';
import { RpcException } from '@nestjs/microservices';
import { OrderPaginationDto } from './dto';
import { ChangeOrderStatusDto } from './dto/change-order-status';




@Injectable()
export class OrdersService extends PrismaClient implements OnModuleInit {

  private readonly logger = new Logger('OrdersService');


  async onModuleInit() {
    await this.$connect();
    this.logger.log('Database connected');
  }

  create(createOrderDto: CreateOrderDto) {
    
    return this.order.create({
      data: createOrderDto
    })

  }

  async findAll(orderPaginationDto: OrderPaginationDto) {
    const { page = 1, limit = 10 } = orderPaginationDto;
    const totalPages = await this.order.count({
      where: {
        status: orderPaginationDto.status
      }
    });  


    return {
      meta: {
        total: totalPages,
        page,
        lastPage: Math.ceil( totalPages / page )
      },
      data: await this.order.findMany({
        skip: ( page - 1 ) * limit,
        take: limit       
      })
     
    }
  }
  

  async findOne(id: string) {

    const order = await this.order.findFirst({
      where: { id }
    });

    if ( !order ) {
      throw new RpcException({ 
        status: HttpStatus.NOT_FOUND, 
        message: `Order with id ${ id } not found`
      });
    }

    return order;

  }

  async changeOrderStatus(changeOrderStatusDto: ChangeOrderStatusDto) {

    const { id, status } = changeOrderStatusDto;

    const order = await this.findOne(id);
    if ( order.status === status ) {
      return order;
    }

    return this.order.update({
      where: { id },
      data: { status: status }
    });


  }



}
