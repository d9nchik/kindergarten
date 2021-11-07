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

  abstract build(): User;
}

class Builder extends AbstractBuilder {
  public build(): User {
    const user = new User();
    user.login(this.login, this.password);
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
