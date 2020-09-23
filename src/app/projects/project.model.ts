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

  private getWorkerLoc(user : User) {
      return _.findIndex(this.team_members, {id: user.id});
  }
  public IsUserInTeam(userToFind: User){
    return (_.find(this.team_members, user => user.id == userToFind.id) != undefined)
  }
  RemoveTeamMember(userToRemove: User): void {
    const index = this.getWorkerLoc(userToRemove);
    if (index == -1)
      return;
    this.team_members.splice(index, 1);
  }
  public AddTeamMember(userToAdd: User): void {
    let newMember = !this.IsUserInTeam(userToAdd);
    if (newMember) {
      //add the user to the team array
      this.team_members.push(userToAdd);
      //sort the array by rank.
      userToAdd
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
      //#FIX LATER WITH IDS
      /* userToAdd.projects.push(this); */
    }
  }
}
