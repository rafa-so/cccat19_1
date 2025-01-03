export default class CarPlate {
    private value: string;

    constructor(carPlate: string){
        if (carPlate && !this.isValidCarPlate(carPlate)) throw new Error("Invalid Car Plate");
        this.value = carPlate;
    }

    isValidCarPlate(carPlate: string) {
        return carPlate.match(/[A-Z]{3}[0-9]{4}/)
    }

    getValue() {
        return this.value;
    }
}