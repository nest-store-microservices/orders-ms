import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PRODUCT_SERVICE, envs } from 'src/config';

@Module({
   imports:[
       ClientsModule.register([
         { 
           name: PRODUCT_SERVICE, 
           transport: Transport.NATS,
           options:{
                servers: envs.natsServer,   
           } 
         },
       ]),
     ],
     exports:[
        ClientsModule.register([
            { 
              name: PRODUCT_SERVICE, 
              transport: Transport.NATS,
              options:{
                   servers: envs.natsServer,   
              } 
            },
          ]),
     ],
    
    providers: [],
})
export class NatsModule {}
