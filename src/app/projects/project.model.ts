import { User } from './../users/user.model'
import * as _ from "lodash";

export class Project {

  public id: string;
  constructor(
    public name: string,
    public type: string,
    public logo: string,
    public client_name: string,
    public start_date: string,
    public end_date: string,
    public description: string,
    public team_members: User[]
  ) { }

  private getWorkerLoc(u: User) {
      return _.findIndex(this.team_members, {id: u.id});
  }
  public IsUserInTeam(u: User){
    return (_.find(this.team_members, user => user.id == u.id) != undefined)
  }
  RemoveTeamMember(u: User): void {
    const loc = this.getWorkerLoc(u);
    if (loc == -1)
      return;
    this.team_members.splice(loc, 1);
  }
  public AddTeamMember(u: User): void {
    let newMember = !this.IsUserInTeam(u);
    if (newMember) {
      //add the user to the team array
      this.team_members.push(u);
      //sort the array by rank.

      this.team_members = this.team_members.sort((a, b) => {
        if (a.rank > b.rank) {
          return -1;
        }
        if (a.rank < b.rank) {
          return 1;
        }
        return 0;
      })
      //add the project to the user
      u.projects.push(this);
    }
  }
}
