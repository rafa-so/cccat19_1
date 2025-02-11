import { PgPromiseAdapter } from "./infra/database/DatabaseConnecction";
import { ExpressAdapter, HapiAdapter } from "./infra/http/HttpServer";

// Entrypoint - Composition Root
const httpServer = new ExpressAdapter();
const connection = new PgPromiseAdapter();
httpServer.listen(3000);
