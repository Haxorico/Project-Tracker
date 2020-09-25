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

  private getWorkerIndex(userID : string) {
      return _.findIndex(this.team_members_ids, user => user==userID);
  } 
  public IsUserInTeam(userIDToFind: string){
    return (_.find(this.team_members_ids, user => user == userIDToFind) != undefined)
  }
  RemoveTeamMember(userIDToRemove: string): void {
    const index = this.getWorkerIndex(userIDToRemove);
    if (index == -1)
      return;
    this.team_members_ids.splice(index, 1);
  }
  public AddTeamMember(userIDToAdd: string): void {
    let newMember = !this.IsUserInTeam(userIDToAdd);
    if (newMember) {
      //add the user to the team array
      this.team_members_ids.push(userIDToAdd);
      //sort the array by rank.
      //#TODO  need a new sort as now we ONLY have ids.
      /* this.team_members_ids = this.team_members_ids.sort((a, b) => {
        if (a.rank > b.rank) {
          return -1;
        }
        if (a.rank < b.rank) {
          return 1;
        }
        return 0;
      }) */

      //add the project to the user
      //#FIX LATER WITH IDS
      /* userToAdd.projects.push(this); */
    }
  }
}
