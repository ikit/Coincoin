import { Service } from "typedi";

@Service()
export default class CoinService {

    constructor() {
        console.log("construct CoinServiec")
    }

    healthCheck() {
        return "Hello, I'm ready :)";
    }
}