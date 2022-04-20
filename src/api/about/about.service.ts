import AboutModel from "../../model/about.model";

export default class AboutService {
  private aboutModel: AboutModel;
  constructor() {
    this.aboutModel = new AboutModel();
  }

  public get = (): Promise<any> => {
    return new Promise(async (resolve) => {
      await this.aboutModel.create({
        name: "test",
        description: "nothing",
      });
      return resolve("success");
    });
  };
}
