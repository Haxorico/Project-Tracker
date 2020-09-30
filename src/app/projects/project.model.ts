import { User } from './../users/user.model'
import * as _ from "lodash";

export class Project {

  public id: string;
  public name: string;
  public type: string;
  public logo: string;
  public client_name: string;
  public start_date: string;
  public end_date: string;
  public description: string;
  public team_members_ids: string[];

  constructor(obj) {
    this.id = obj.id;
    this.name = obj.name;
    this.type = obj.type;
    this.logo = obj.logo;
    this.client_name = obj.client_name;
    this.start_date = obj.start_date;
    this.end_date = obj.end_date;
    this.description = obj.description;
    this.team_members_ids = obj.team_members_ids;
   }
}
