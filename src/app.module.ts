import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TodoModule } from './todo/todo.module';
import { TracingModule } from './common/tracing/tracing.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/todo-app'),
    TodoModule,
    TracingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
