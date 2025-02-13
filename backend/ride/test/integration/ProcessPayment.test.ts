import UUID from "../../src/domain/vo/UUID";
import { PgPromiseAdapter } from "../../src/infra/database/DatabaseConnecction";

test("Deve processar o pagamento", async function(){
    const connection = new PgPromiseAdapter();
    const transactionRepository = new transactionRepositoryDatabase(connection);
    const processPayment = ProcessPayment(transactionRepository);
    const getTransaction = new outputGetTransaction(transactionRepository);
    const inputProcessPayment = {
        rideId: UUID.create().getValue(),
        amount: 100
    };
    const outputProcessPayment = await processPayment.execute(input);
    const outputGetTransaction = await getTransaction.execute(outputProcessPayment.transactionId);
    expect(outputGetTransaction.rideId).toBe(inputProcessPayment.rideId);
    expect(outputGetTransaction.amount).toBe(inputProcessPayment.amount);

});