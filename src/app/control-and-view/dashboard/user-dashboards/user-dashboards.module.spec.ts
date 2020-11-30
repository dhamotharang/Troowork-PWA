import { UserDashboardsModule } from './user-dashboards.module';

describe('UserDashboardsModule', () => {
  let userDashboardsModule: UserDashboardsModule;

  beforeEach(() => {
    userDashboardsModule = new UserDashboardsModule();
  });

  it('should create an instance', () => {
    expect(userDashboardsModule).toBeTruthy();
  });
});
