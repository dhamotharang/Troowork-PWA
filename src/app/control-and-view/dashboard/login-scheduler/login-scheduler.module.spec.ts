import { LoginSchedulerModule } from './login-scheduler.module';

describe('LoginSchedulerModule', () => {
  let loginSchedulerModule: LoginSchedulerModule;

  beforeEach(() => {
    loginSchedulerModule = new LoginSchedulerModule();
  });

  it('should create an instance', () => {
    expect(loginSchedulerModule).toBeTruthy();
  });
});
