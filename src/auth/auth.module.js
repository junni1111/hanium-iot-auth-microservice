"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AuthModule = void 0;
var common_1 = require("@nestjs/common");
var auth_service_1 = require("./auth.service");
var auth_controller_1 = require("./auth.controller");
var microservices_1 = require("@nestjs/microservices");
var jwt_1 = require("@nestjs/jwt");
var local_strategy_1 = require("./local.strategy");
var user_module_1 = require("../user/user.module");
var passport_1 = require("@nestjs/passport");
var AuthModule = /** @class */ (function () {
    function AuthModule() {
    }
    AuthModule = __decorate([
        (0, common_1.Module)({
            imports: [
                user_module_1.UserModule,
                passport_1.PassportModule,
                microservices_1.ClientsModule.register([
                    {
                        name: "USER_CLIENT",
                        transport: microservices_1.Transport.TCP,
                        options: {
                            host: "localhost",
                            port: 9999
                        }
                    },
                ]),
                jwt_1.JwtModule.register({
                    secret: "mock_secret",
                    signOptions: { expiresIn: "60s" }
                }),
            ],
            controllers: [auth_controller_1.AuthController],
            providers: [auth_service_1.AuthService, local_strategy_1.LocalStrategy]
        })
    ], AuthModule);
    return AuthModule;
}());
exports.AuthModule = AuthModule;
