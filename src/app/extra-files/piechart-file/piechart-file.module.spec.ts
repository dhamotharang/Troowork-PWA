import { PiechartFileModule } from './piechart-file.module';

describe('PiechartFileModule', () => {
  let piechartFileModule: PiechartFileModule;

  beforeEach(() => {
    piechartFileModule = new PiechartFileModule();
  });

  it('should create an instance', () => {
    expect(piechartFileModule).toBeTruthy();
  });
});
