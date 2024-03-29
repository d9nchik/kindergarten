import Builder from './builder';
import Manager from './manager';
import Organizer from './organizer';
import Parent from './parent';
import User from './user';

class UserFacade {
  private builder: Builder = new Builder();
  private user: User | null = null;

  constructor() {
    const cred = sessionStorage.getItem('cred');
    if (cred) {
      this.user = this.builder.buildFromUser(JSON.parse(cred));
    }
  }

  public async login(login: string, password: string) {
    this.builder.setLogin(login);
    this.builder.setPassword(password);
    await this.createInstance();
    sessionStorage.setItem('cred', JSON.stringify(this.user));
  }

  public logout() {
    this.builder.reset();
    this.user = null;
    sessionStorage.removeItem('cred');
  }

  protected async createInstance() {
    this.user = await this.builder.build();
  }

  public getInstance(): User | null {
    return this.user;
  }

  public isManager(): boolean | null {
    if (!this.user) {
      return false;
    }
    return this.user.status_array.includes('manager');
  }

  public isOrganizer(): boolean | null {
    if (!this.user) {
      return false;
    }
    return this.user.organizer_company.length !== 0;
  }

  public getManager(): Manager | null {
    if (this.user instanceof Manager) {
      return this.user;
    }
    return null;
  }

  public getOrganizer(): Organizer | null {
    if (this.user instanceof Organizer) {
      return this.user;
    }
    return null;
  }
  public getParent(): Parent | null {
    if (this.user instanceof Parent) {
      return this.user;
    }
    return null;
  }

  public isAuthenticated(): boolean {
    return !!this.user;
  }
}

export const user = new UserFacade();

export default UserFacade;
