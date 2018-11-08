import { validateFileType, validateMaxFilesize } from './index';

describe('The costom validators service', () => {
  describe('should validate file type', () => {
    const meta = {
      allowedFileTypes: ['image/jpeg', 'application/pdf']
    };

    it('with correct file type', () => {
      const file = {
        type: 'application/pdf'
      };
      expect(validateFileType(file, meta)).toEqual(null);
    });

    it('with incorrect file type', () => {
      const file = {
        type: 'image/png'
      };

      expect(validateFileType(file, meta)).toEqual({
        custom: 'Dit bestand heeft niet het juiste type (png). Toegestaan zijn: jpeg, pdf.'
      });
    });

    it('with empty value', () => {
      expect(validateFileType()).toEqual(null);
    });
  });

  describe('should validate max file size', () => {
    const meta = {
      maxFileSize: 8388608
    };

    it('with correct file type', () => {
      const file = {
        size: 8388607
      };

      expect(validateMaxFilesize(file, meta)).toEqual(null);
    });

    it('with incorrect file type', () => {
      const file = {
        size: 8388608
      };

      expect(validateMaxFilesize(file, meta)).toEqual({
        custom: 'Dit bestand is te groot (8 MB). Maximale bestandgrootte is 8 MB.'
      });
    });

    it('with empty value', () => {
      expect(validateMaxFilesize()).toEqual(null);
    });
  });
});
