"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoinController = void 0;
var routing_controllers_1 = require("routing-controllers");
var CoinController = /** @class */ (function () {
    function CoinController(coinService) {
        this.coinService = coinService;
    }
    /**
     * Renvoie l'état du service principale
     */
    CoinController.prototype.getHealth = function () {
        return this.coinService.healthCheck();
    };
    __decorate([
        routing_controllers_1.Get("/health"),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], CoinController.prototype, "getHealth", null);
    CoinController = __decorate([
        routing_controllers_1.JsonController("/"),
        __metadata("design:paramtypes", [CoinService])
    ], CoinController);
    return CoinController;
}());
exports.CoinController = CoinController;
