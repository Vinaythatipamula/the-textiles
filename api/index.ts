import { APIGatewayProxyEvent, Context, Callback } from 'aws-lambda';
import serverlessExpress from '@vendia/serverless-express';
import { AppModule } from '../src/app.module';
import { NestFactory } from '@nestjs/core';

let cachedServer: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.init();
  const expressApp = app.getHttpAdapter().getInstance();
  return serverlessExpress({ app: expressApp });
}

export const handler = async (
  event: APIGatewayProxyEvent,
  context: Context,
  callback: Callback
) => {
  if (!cachedServer) {
    cachedServer = await bootstrap();
  }
  return cachedServer(event, context, callback);
};
