import Model from "./index";
export interface IAboutAttributes {
  id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}
export default class AboutModel extends Model<IAboutAttributes> {
  constructor() {
    super("about");
  }
}
