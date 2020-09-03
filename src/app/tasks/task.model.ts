import { Project } from '../projects/project.model';
import { User } from '../users/user.model'
export class Task {
  public id: string;
  public work_times = [];
  constructor(
    public name: string,
    public project: Project,
    public status: number,
    public type: number,
    public estimate: string,
    public start_date: string,
    public end_date: string,
    public description: string,
    public user: User,
    public reporter: User
  ) {}

  GetStatus() {
    if (this.status == 0)
      return "Open";
    if (this.status == 1)
      return "Development";
    if (this.status == 2)
      return "Ready for QA";
    if (this.status == 3)
      return "Closed";
    if (this.status == -1)
      return "No status given";
    return "Error - Wrong status number.";
  }
  GetType() {
    if (this.type == 0)
      return "Technical Task";
    if (this.type == 1)
      return "Bug";
    if (this.type == 2)
      return "Improvement";
    if (this.type == 3)
      return "Feature";
    if (this.type == 4)
      return "Task";
    if (this.type == -1)
      return "No type given";
    return "Error - Wrong type number.";
  }

  AddWorkTime(date: string, time_hh: number, time_mm: number, comment : string = "") {
    const user = this.user;
    //sometimes this gets converted into string so need to re-convert it back to number
    time_hh = Number(time_hh);
    time_mm = Number(time_mm);
    this.work_times.push({ user, date, time_hh, time_mm, comment });
  }

  Number2Time(n : number){
    let ret : string = "";
    if (n < 10)
      ret = "0"
    ret += n.toString();
    return ret;
  }

  GetTotalTime() {
    let totalH: number = 0;
    let totalM: number = 0;
    this.work_times.forEach(time => {
      totalH += time.time_hh;
      totalM += time.time_mm;
    });
    totalH += Math.floor(totalM / 60);
    totalM = totalM % 60;
    let hh = this.Number2Time(totalH);
    let mm = this.Number2Time(totalM);
    return hh + ":" + mm;
  }
}
