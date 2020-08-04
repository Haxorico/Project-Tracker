import { User } from './../users/user.model'

export class Project {

  public static count = 0;
  public id: number;
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
    for (let loc = 0; loc < this.team_members.length; loc++) {
      if (this.team_members[loc].id == u.id && this.team_members[loc].name == u.name) {
        return loc;
      }
    }
    return -1;
  }

  RemoveTeamMember(u: User): void {
    const loc = this.getWorkerLoc(u);
    if (loc == -1)
      return;
    this.team_members.splice(loc, 1);
  }
  public AddTeamMember(u: User): void {

    let newMember = true;
    this.team_members.forEach(member => {
      if (member == u)
        newMember = false;
    });
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
