import { ControlAndViewModule } from './control-and-view.module';

describe('ControlAndViewModule', () => {
  let controlAndViewModule: ControlAndViewModule;

  beforeEach(() => {
    controlAndViewModule = new ControlAndViewModule();
  });

  it('should create an instance', () => {
    expect(controlAndViewModule).toBeTruthy();
  });
});
