import * as Hapi from "@hapi/hapi";
import AboutService from './about.service'

export default class AboutRoute {
  private aboutService : AboutService
  constructor() {
    this.aboutService = new AboutService()
  }
  public async register(server: Hapi.Server): Promise<any> {
    return new Promise((resolve) => {
      server.route([
        {
          method: "GET",
          path: `/api/about`,
          options: {
            handler: async (req: Hapi.Request, res: Hapi.ResponseToolkit) => {
              await this.aboutService.get()
              return res.response("hello").code(200);
            },
            description: "Method that authenticate user",
            tags: ["api", "About"],
            auth: false,
          },
        },
      ]);
      resolve(true);
    });
  }
}
