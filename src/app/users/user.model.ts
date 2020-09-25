import * as _ from "lodash";

export class User {
  public name: string;
    public password: string;
    public rank: number;
    public photo: string;
    public date_of_birth: string;
    public location: string;
    public address: string;
    public skype: string;
    public phone_number: string;
    public id: string;
    public task_ids: string[];
    public project_ids: string[];
    public skills: string[];
  constructor(obj){ 
    this.name = obj.name;
    this.password = obj.password;
    this.rank = obj.rank;
    this.photo = obj.photo;
    this.date_of_birth = obj.date_of_birth;
    this.location = obj.location;
    this.address = obj.address;
    this.skype = obj.skype;
    this.phone_number = obj.phone_number;
    this.id = obj.id;
    this.task_ids = obj.task_ids;
    this.project_ids = obj.project_ids;
    this.skills = obj.skills;
  }


  GetTitle() {
    if (this.rank <= 0)
      return "Guest";
    if (this.rank < 10) {
      return "Employee";
    }
    if (this.rank < 50) {
      return "Project Manager";
    }
    if (this.rank <= 100) {
      return "Admin";
    }
    return "Unknown Title";
  }
    IsUserInProject(projectID: string) {
      return (_.find(this.project_ids, project => project == projectID) != undefined);
  } 

  public IsUserInTask(taskID: string){
    return (_.find(this.task_ids, task => task == taskID) != undefined);
  }
  private getTaskIndex(taskID : string){
    return (_.findIndex(this.task_ids, task => task == taskID));
  }
  public AddToTask(taskID : string){
    //check if user already in task
    if (this.IsUserInTask(taskID)){
      return;
    }
    //add to the list of tasks
    this.task_ids.push(taskID);
    
    //#FIX LATER WITH IDS
    /* if (!newUser.IsUserInProject(this.task.project)){
      
      //#FIX LATER WITH IDS
      //newUser.projects.push(this.task.project);
      
      this.task.project.AddTeamMember(newUser);
    } */

    //update the user.
    //#ASK_ALEX where to use the update user function. Should it be in model? 

  }
  public RemoveFromTask(taskID : string){
    //check if user already in task
    if (!this.IsUserInTask(taskID)){
      return;
    }
    //add to the list of tasks
    this.task_ids.splice(this.getTaskIndex(taskID));
    //update the user.
    //#ASK_ALEX where to use the update user function. Should it be in model? 
  }
}
