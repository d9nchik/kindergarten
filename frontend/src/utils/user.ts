export const SERVER_URL = 'localhost:3000';

class User {
  protected jwt_token: string = '';
  public status_array: string[] = [];
  public organizer_company: number[] = [];

  constructor(user: User | null = null) {
    if (!user) {
      return;
    }
    this.jwt_token = user.jwt_token;
  }
  public isLogin(): boolean {
    return !!this.jwt_token;
  }

  public async login(email: string, password: string) {
    const body = JSON.stringify({ login: email, password });
    const result = await fetch(`${SERVER_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
    });
    if (!result.ok) {
      throw new Error('check your credentials');
    }
    const payload = (await result.json()) as {
      token: string;
      statusArray: string[];
      organizerArray: number[];
    };
    this.jwt_token = payload.token;
    this.organizer_company = payload.organizerArray;
    this.status_array = payload.statusArray;
  }

  public logout() {
    this.jwt_token = '';
    this.status_array = [];
    this.organizer_company = [];
  }
}

export default User;
