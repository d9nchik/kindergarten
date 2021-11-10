import User from './user';
import Manager from './manager';
import Organizer from './organizer';
import Parent from './parent';

abstract class AbstractBuilder {
  protected login: string = '';
  protected password: string = '';

  public setLogin(login: string) {
    this.login = login;
  }
  public setPassword(password: string) {
    this.password = password;
  }

  public reset() {
    this.password = '';
    this.login = '';
  }

  abstract build(): Promise<User>;
  abstract buildFromUser(user: User): User;
}

class Builder extends AbstractBuilder {
  public async build(): Promise<User> {
    const user = new User();
    await user.login(this.login, this.password);
    return this.buildFromUser(user);
  }

  public buildFromUser(user: User): User {
    if (user.status_array.includes('manager')) {
      return new Manager(user);
    }
    if (user.organizer_company.length > 0) {
      return new Organizer(user);
    }
    return new Parent(user);
  }
}

export default Builder;
