import { ManagerDashboardPagesModule } from './manager-dashboard-pages.module';

describe('ManagerDashboardPagesModule', () => {
  let managerDashboardPagesModule: ManagerDashboardPagesModule;

  beforeEach(() => {
    managerDashboardPagesModule = new ManagerDashboardPagesModule();
  });

  it('should create an instance', () => {
    expect(managerDashboardPagesModule).toBeTruthy();
  });
});
