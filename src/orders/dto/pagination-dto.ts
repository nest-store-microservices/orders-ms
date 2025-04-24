import { OrderStatus } from "@prisma/client";
import { IsEnum, IsOptional } from "class-validator";
import { PaginationDto } from "src/common/dto/pagination.dto";




export class OrderPaginationDto extends PaginationDto {

    @IsOptional()
    @IsEnum(OrderStatus, {
        message: `Status must be one of the followingssss: ${Object.values(OrderStatus).join(', ')}`,
     })
    status: OrderStatus


}