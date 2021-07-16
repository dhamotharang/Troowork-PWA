import { WorkorderAverageReportModule } from './workorder-average-report.module';

describe('WorkorderAverageReportModule', () => {
  let workorderAverageReportModule: WorkorderAverageReportModule;

  beforeEach(() => {
    workorderAverageReportModule = new WorkorderAverageReportModule();
  });

  it('should create an instance', () => {
    expect(workorderAverageReportModule).toBeTruthy();
  });
});
