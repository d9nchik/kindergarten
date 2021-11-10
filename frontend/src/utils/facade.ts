import Builder from './builder';
import Manager from './manager';
import Organizer from './organizer';
import User from './user';

class UserFacade {
  private builder: Builder = new Builder();
  private user: User | null = null;

  public async login(login: string, password: string) {
    this.builder.setLogin(login);
    this.builder.setPassword(password);
    await this.createInstance();
  }

  public logout() {
    this.builder.reset();
    this.user = null;
  }

  protected async createInstance() {
    this.user = await this.builder.build();
  }

  public getInstance(): User | null {
    return this.user;
  }

  public isManager(): boolean | null {
    if (!this.user) {
      return null;
    }
    return this.user.status_array.includes('manager');
  }

  public isOrganizer(): boolean | null {
    if (!this.user) {
      return null;
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

  public isAuthenticated(): boolean {
    return !!this.user;
  }
}

export const user = new UserFacade();

export default UserFacade;
