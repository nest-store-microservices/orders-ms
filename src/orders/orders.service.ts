import { HttpStatus, Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';

import { PrismaClient } from '@prisma/client';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { OrderPaginationDto, ChangeOrderStatusDto, CreateOrderDto } from './dto';
import { PRODUCT_SERVICE } from 'src/config';
import { firstValueFrom } from 'rxjs';





@Injectable()
export class OrdersService extends PrismaClient implements OnModuleInit {

  constructor(
    @Inject(PRODUCT_SERVICE) private readonly productsClient: ClientProxy
  ) {
    super();
  }

  private readonly logger = new Logger('OrdersService');

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Database connected');
  }


  async create(createOrderDto: CreateOrderDto) {
    
    try {
      
      const productIds = createOrderDto.items.map((item) => item.productId);
      const products: any[] = await firstValueFrom(
        this.productsClient.send({ cmd: 'validate_products' }, productIds),
      );
      const totalAmount = createOrderDto.items.reduce((acc, orderItem) => {
        const price = products.find(
          (product) => product.id === orderItem.productId,
        ).price;
        return price * orderItem.quantity;
      }, 0);

      const totalItems = createOrderDto.items.reduce((acc, orderItem) => {
        return acc + orderItem.quantity;
      }, 0);

      //3. Crear una transacción de base de datos
      const order = await this.order.create({
        data: {
          total: totalAmount,
          items: totalItems,
          OrderItem: {
            createMany: {
              data: createOrderDto.items.map((orderItem) => ({
                price: products.find(
                  (product) => product.id === orderItem.productId,
                ).price,
                productId: orderItem.productId,
                quantity: orderItem.quantity,
              })),
            },
          },
        },
        include: {
          OrderItem: {
            select: {
              price: true,
              quantity: true,
              productId: true,
            },
          },
        },
      });



      return {
        ...order,
        OrderItem: order.OrderItem.map((orderItem) => ({
          ...orderItem,
          name: products.find((product) => product.id === orderItem.productId)
            .name,
        })),
      };
    } catch (error) {
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: 'Check logs',
      });
    }
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
        lastPage: Math.ceil(totalPages / page)
      },
      data: await this.order.findMany({
        skip: (page - 1) * limit,
        take: limit
      })

    }
  }


  async findOne(id: string) {

    const order = await this.order.findFirst({
      where: { id },
      include: {
        OrderItem: {
          select: {
            price: true,
            quantity: true,
            productId: true,
          },
        },
      },
    });

    if (!order) {
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: `Order with id ${id} not found`
      });
    }

    const productIds = order.OrderItem.map((item) => item.productId);
    const products: any[] = await firstValueFrom(
      this.productsClient.send({ cmd: 'validate_products' }, productIds),
    );
    if (!products || products.length === 0) {
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: 'Products not found',
      });
    }

    return {
      ...order,
      OrderItem: order.OrderItem.map((orderItem) => ({
        ...orderItem,
        name: products.find((product) => product.id === orderItem.productId)
          .name,
      })),
    };



  }

  async changeOrderStatus(changeOrderStatusDto: ChangeOrderStatusDto) {

    const { id, status } = changeOrderStatusDto;

    const order = await this.findOne(id);
    if (order.status === status) {
      return order;
    }

    return this.order.update({
      where: { id },
      data: { status: status }
    });


  }

  async validateProducts(ids: number[]) {
    const products = await this.productsClient.send({ cmd: 'validate_products' }, ids).toPromise();
    return products;
  }



}
