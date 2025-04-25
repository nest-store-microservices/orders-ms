import { ArrayMinSize, IsArray,  ValidateNested } from "class-validator"

import { Type } from "class-transformer"
import { OrderItemDto } from "./"

export class CreateOrderDto {

    
    // @Min(1)
    // @IsPositive()
    // total:number

    // @IsNumber()
    // @IsPositive()
    // items:number

    // @IsEnum(OrderStatusList,{
    //     message: `Status must be one of the following: ${OrderStatusList.join(', ')}`
    // })
    // @IsOptional()
    // status: OrderStatus

    // @IsBoolean()
    // @IsOptional()
    // paid: boolean


    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested({
        each: true,
    })
    @Type(() => OrderItemDto)
    items: OrderItemDto[]
    
}
