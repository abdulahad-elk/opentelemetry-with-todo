import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TodoModule } from './todo/todo.module';
import { TracingModule } from './common/tracing/tracing.module';

@Module({
  imports: [TodoModule, TracingModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
