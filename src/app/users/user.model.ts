

export class User {
  public static count = 0;
  public id: number;
  public tasks = [];
  public projects = [];
  public skills : string[] = [];
  constructor(
    public name: string,
    public password: string,
    public rank: number,
    public photo: string,
    public date_of_birth: string,
    public location: string,
    public address: string,
    public skype: string,
    public phone_number: string
  ) {
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

}
