
import { Catch, RpcExceptionFilter, ArgumentsHost } from '@nestjs/common';

import { RpcException } from '@nestjs/microservices';

@Catch(RpcException)
export class RpcCustomExceptionFilter implements RpcExceptionFilter {
  catch(exception: RpcException, host: ArgumentsHost) {
    
    const ctx = host.switchToHttp();

    const resp = ctx.getResponse();

    const rpcError = exception.getError();
    console.log('RPC Error:', rpcError);

    if( typeof rpcError === 'object' && 'status' in rpcError && 'message' in rpcError ){
      const status = typeof rpcError.status === 'number' ? rpcError.status : 400;
      return resp.status(status).json(rpcError);
    }


    return resp.status(400).json({
      status: 400,
      msg: rpcError
    })


  }
}
