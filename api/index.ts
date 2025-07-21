import { Handler } from 'aws-lambda';
import serverlessExpress from '@vendia/serverless-express';
import { AppModule } from '../src/app.module';
import { NestFactory } from '@nestjs/core';

let cachedServer: Handler;

async function bootstrap(): Promise<Handler> {
  const app = await NestFactory.create(AppModule);
  await app.init();
  const expressApp = app.getHttpAdapter().getInstance();
  return serverlessExpress({ app: expressApp });
}

export const handler: Handler = async (event, context) => {
  if (!cachedServer) {
    cachedServer = await bootstrap();
  }
  return cachedServer(event, context);
};
