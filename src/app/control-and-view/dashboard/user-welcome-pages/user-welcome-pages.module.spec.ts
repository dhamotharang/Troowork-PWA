import { UserWelcomePagesModule } from './user-welcome-pages.module';

describe('UserWelcomePagesModule', () => {
  let userWelcomePagesModule: UserWelcomePagesModule;

  beforeEach(() => {
    userWelcomePagesModule = new UserWelcomePagesModule();
  });

  it('should create an instance', () => {
    expect(userWelcomePagesModule).toBeTruthy();
  });
});
