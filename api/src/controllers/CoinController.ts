import { Get, JsonController } from "routing-controllers";
import CoinService from "../services/CoinService";


@JsonController("")
export class CoinController {


    constructor (private readonly coinService: CoinService) {
        console.log("construc controller: ", coinService)
    }

    /**
     * Renvoie l'état du service principale
     */
    @Get("/health")
    getHealth() {
         return this.coinService.healthCheck();
    }

}