import { IsBoolean, IsEnum, IsNumber, IsOptional, IsPositive, Min } from "class-validator"
import { OrderStatusList } from "../enum/order-enum"
import { OrderStatus } from "@prisma/client"

export class CreateOrderDto {

    
    @Min(1)
    @IsPositive()
    total:number

    @IsNumber()
    @IsPositive()
    items:number

    @IsEnum(OrderStatusList,{
        message: `Status must be one of the following: ${OrderStatusList.join(', ')}`
    })
    @IsOptional()
    status: OrderStatus

    @IsBoolean()
    @IsOptional()
    paid: boolean
    
}
