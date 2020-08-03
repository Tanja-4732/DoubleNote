import Express, { static as express_static, Request, Response } from "express";
import { join } from "path";
import { existsSync } from "fs";

export class Files {
  /**
   * The file serving router of the application
   */
  public router = Express();

  /**
   * Configures the file serving router
   */
  constructor(path: string = Files.getFrontendPath()) {
    // Serve files from the file system
    this.router.use(express_static(path));

    // Serve the main.html file if the requested file was not found
    this.router.use((req: Request, res: Response) =>
      res.sendFile(join(path + "/index.html"))
    );
  }

  /**
   * This method resolves the varying (development vs production) paths of the frontend
   */
  private static getFrontendPath(): string {
    const path = join(__dirname, "../../../../frontend/dist/DoubleNote");

    return existsSync(path)
      ? path
      : join(__dirname, "../../../../doublenote-frontend/dist/DoubleNote");
  }
}
