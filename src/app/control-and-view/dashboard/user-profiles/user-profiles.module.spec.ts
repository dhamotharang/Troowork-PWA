import { UserProfilesModule } from './user-profiles.module';

describe('UserProfilesModule', () => {
  let userProfilesModule: UserProfilesModule;

  beforeEach(() => {
    userProfilesModule = new UserProfilesModule();
  });

  it('should create an instance', () => {
    expect(userProfilesModule).toBeTruthy();
  });
});
