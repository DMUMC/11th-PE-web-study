
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import type { Request, Response, NextFunction } from 'express';

import {
  Registry,
  collectDefaultMetrics,
  Histogram,
  Counter,
} from 'prom-client';

import { AppModule } from './app.module.js';
import { HttpExceptionFilter } from './filter/http-exception.filter.js';

const registry = new Registry();

collectDefaultMetrics({
  register: registry,
});

const httpDuration = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'HTTP request duration in seconds',
  labelNames: ['method', 'route', 'status'],
  buckets: [0.05, 0.1, 0.2, 0.3, 0.5, 0.8, 1.5, 3, 10],
  registers: [registry],
});

const httpRequests = new Counter({
  name: 'http_requests_total',
  help: 'Total HTTP requests',
  labelNames: ['method', 'route', 'status'],
  registers: [registry],
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Prometheus Metrics 엔드포인트
  app.use('/metrics', async (_req: Request, res: Response) => {
    res.setHeader('Content-Type', registry.contentType);
    res.send(await registry.metrics());
  });

  // HTTP 요청 메트릭 수집
  app.use((req: Request, res: Response, next: NextFunction) => {
    const start = process.hrtime.bigint();

    res.on('finish', () => {
      const duration =
        Number(process.hrtime.bigint() - start) / 1e9;

      const labels = {
        method: req.method,
        route: req.route?.path ?? 'unmatched',
        status: String(res.statusCode),
      };

      httpDuration.observe(labels, duration);
      httpRequests.inc(labels);
    });

    next();
  });

  app.enableCors({
    origin: [
      'http://localhost:5173',
      'http://localhost:3001',
    ],
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());

  // Swagger 설정
  const config = new DocumentBuilder()
    .setTitle('UMCine API')
    .setDescription('UMCine 영화 서비스 API 문서')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT || 3000, '0.0.0.0');
}

bootstrap();
