import * as Hapi from "@hapi/hapi";

export default class AboutRoute {
  public async register(server: Hapi.Server): Promise<any> {
    return new Promise((resolve) => {
      server.route([
        {
          method: "GET",
          path: `/api/about`,
          options: {
            handler: async (req: Hapi.Request, res: Hapi.ResponseToolkit) => {
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
