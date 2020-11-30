import { CreateshiftModule } from './createshift.module';

describe('CreateshiftModule', () => {
  let createshiftModule: CreateshiftModule;

  beforeEach(() => {
    createshiftModule = new CreateshiftModule();
  });

  it('should create an instance', () => {
    expect(createshiftModule).toBeTruthy();
  });
});
