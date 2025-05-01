import { OrderStatus } from "@prisma/client";

export interface OrderWithProducts {
    OrderItem: {
        name: any;
        productId: number;
        quantity: number;
        price: number;
    }[];
    id: string;
    total: number;
    items: number;
    status: OrderStatus;
    paid: boolean;
    paidAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
}