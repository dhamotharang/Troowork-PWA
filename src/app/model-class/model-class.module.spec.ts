import { ModelClassModule } from './model-class.module';

describe('ModelClassModule', () => {
  let modelClassModule: ModelClassModule;

  beforeEach(() => {
    modelClassModule = new ModelClassModule();
  });

  it('should create an instance', () => {
    expect(modelClassModule).toBeTruthy();
  });
});
