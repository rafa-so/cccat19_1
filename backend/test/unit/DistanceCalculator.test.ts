import DistanceCalculator from "../../src/domain/service/DistanceCalculator";
import Coord from "../../src/domain/vo/Coord";

test("Deve calcular a distância entre dois pontos", () => {
    const fromLat = -27.584905257808835;
    const fromLong = -48.545022195325124;

    const toLat = -27.496887588317275;
    const toLong = -48.522234807851476;

    const from = new Coord(fromLat, fromLong);
    const to = new Coord(toLat, toLong);

    expect(DistanceCalculator.calculate(from, to)).toBe(10);
});