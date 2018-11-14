import { validateFileType, validateMaxFilesize, validatePhoneNumber } from './index';

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

  describe('should validate telephone number', () => {
    const meta = {
      maxFileSize: 8388608
    };

    it('with correct telephone number', () => {
      const control = {
        value: '+3120-6793793'
      };

      expect(validatePhoneNumber(control, meta)).toEqual(null);
    });

    it('with incorrect telephone number with letter', () => {
      const file = {
        value: '+3120-6a'
      };

      expect(validatePhoneNumber(file, meta)).toEqual({
        custom: 'Ongeldig telefoonnummer, alleen cijfers, + en - zijn toegestaan.'
      });
    });

    it('with incorrect telephone number with space', () => {
      const file = {
        value: '+3120-6 '
      };

      expect(validatePhoneNumber(file, meta)).toEqual({
        custom: 'Ongeldig telefoonnummer, alleen cijfers, + en - zijn toegestaan.'
      });
    });

    it('with empty value', () => {
      expect(validatePhoneNumber()).toEqual(null);
    });
  });
});
