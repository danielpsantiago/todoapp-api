import * as bodyParser from "body-parser";
import * as cookieParser from "cookie-parser";
import * as express from "express";
import * as logger from "morgan";
import * as methodOverride from "method-override";
import * as path from "path";
import * as mongoose from "mongoose";
import * as cors from "cors";
import baseRouter = require("./routes/baseRouter");
import HTTPError from "./models/httperror";

/**
 * The server.
 *
 * @class Server
 */
export class Server {

  public app: express.Application;

  /**
   * Bootstrap the application.
   *
   * @class Server
   * @method bootstrap
   * @static
   * @return {ng.auto.IInjectorService} Returns the newly created injector for this app.
   */
  public static bootstrap(): Server {
    return new Server();
  }

  /**
   * Constructor.
   *
   * @class Server
   * @constructor
   */
  constructor() {
    // create expressjs application
    this.app = express();

    // configure application
    this.config();

    // add routes
    this.routes();

    // add api
    this.api();
  }

  /**
   * Create REST API routes
   *
   * @class Server
   * @method api
   */
  public api() {
    // empty for now
  }

  /**
   * Configure application
   *
   * @class Server
   * @method config
   */
  public config() {
    this.app.use(express.static(path.join(__dirname, "public")));

    this.app.use(logger("dev"));

    this.app.use(bodyParser.json());

    this.app.use(bodyParser.urlencoded({
      extended: true
    }));

    // use cookie parser middleware
    this.app.use(cookieParser("SECRET_GOES_HERE"));
    
    // use override middlware
    this.app.use(methodOverride());
    
    // use cors middleware
    this.app.use(cors());
 

    if (process.env.NODE_ENV === "production") {            
      this.app.use(function(err: HTTPError, req: express.Request, res: express.Response, next: express.NextFunction) {
        console.log("production error handler called");             
        res.statusCode = err.statusCode || 500;
        err.stack = undefined;
        res.send(err);
      });
       
    } else {
      this.app.use(function(err: HTTPError, req: express.Request, res: express.Response, next: express.NextFunction) {
        console.log("development error handler called");             
        res.statusCode = err.statusCode || 500;
        res.send(err);
      });
    }
    // catch 404 and forward to error handler
    this.app.use(function(err: any, req: express.Request, res: express.Response, next: express.NextFunction) {
      console.log("404 error handler called") ;             
      err.status = 404;
      next(err);
    }); 

    if (process.env.DB_CONN) {
      mongoose.connect(process.env.DB_CONN!);
    } else {
      throw new Error("You need to set the environment var DB_CONN");
    }

  }

  /**
   * Create router
   *
   * @class Server
   * @method api
   */
  public routes() {
    this.app.use("/", baseRouter);
  }
}