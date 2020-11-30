import { UserPasswordChangesModule } from './user-password-changes.module';

describe('UserPasswordChangesModule', () => {
  let userPasswordChangesModule: UserPasswordChangesModule;

  beforeEach(() => {
    userPasswordChangesModule = new UserPasswordChangesModule();
  });

  it('should create an instance', () => {
    expect(userPasswordChangesModule).toBeTruthy();
  });
});
