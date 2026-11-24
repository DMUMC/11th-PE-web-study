
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtModule } from "@nestjs/jwt";

import { Member } from "./entity/member.entity.js";
import { Rating } from "./entity/rating.entity.js";
import { Favorite } from "./entity/favorite.enttity.js";

import { MemberController } from "./controller/member.controller.js";
import { RatingController } from "./controller/rating.controller.js";
import { AuthController } from "./controller/auth.controller.js";
import { FavoriteController } from "./controller/favorite.controller.js";

import { MemberService } from "./service/member.service.js";
import { RatingService } from "./service/rating.service.js";
import { AuthService } from "./service/auth.service.js";
import { FavoriteService } from "./service/favorite.service.js";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRoot({
      type: "mysql",
      host: process.env.DB_HOST,
      port: 3306,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: false,
    }),

    TypeOrmModule.forFeature([
      Member,
      Rating,
      Favorite,
    ]),

    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>("JWT_SECRET"),
        signOptions: {
          expiresIn: 3600,
        },
      }),
    }),
  ],

  controllers: [
    MemberController,
    RatingController,
    AuthController,
    FavoriteController,
  ],

  providers: [
    MemberService,
    RatingService,
    AuthService,
    FavoriteService,
  ],
})
export class AppModule {}
