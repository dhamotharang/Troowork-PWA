import { ExtraFilesModule } from './extra-files.module';

describe('ExtraFilesModule', () => {
  let extraFilesModule: ExtraFilesModule;

  beforeEach(() => {
    extraFilesModule = new ExtraFilesModule();
  });

  it('should create an instance', () => {
    expect(extraFilesModule).toBeTruthy();
  });
});
