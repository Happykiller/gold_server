import { describe, expect, it } from '@jest/globals';
import { mock, MockProxy } from 'jest-mock-extended';

import { AuthUsecase } from '@usecase/auth.usecase';
import { Inversify } from '@src/inversify/investify';
import { GetUserUsecase } from '@usecase/getUser.usecase';
import { CryptService } from '@service/crypt/crypt.service';

describe('AuthUsecase', () => {
  const mockInversify: MockProxy<Inversify> = mock<Inversify>();
  const mockGetUserUsecase: MockProxy<GetUserUsecase> = mock<GetUserUsecase>();
  const mockCryptService: MockProxy<CryptService> = mock<CryptService>();

  mockInversify.cryptService = mockCryptService;
  mockInversify.getUserUsecase = mockGetUserUsecase;

  const usecase: AuthUsecase = new AuthUsecase(mockInversify);

  describe('#execute', () => {

    it('should build', () => {
      // arrange
      // act
      // assert
      expect(usecase).toBeDefined();
    });

    it('should get response of auth', async () => {
      // arrange
      const data = {
        id: 1,
        code: 'faro',
        name_first: 'Fabrice',
        name_last: 'Rosito',
        description: 'Admin',
        mail: 'fabrice.rosito@gmail.com',
        creation: '1706429496000',
        modification: '1706429496000',
        language: 'fr'
      };
      mockGetUserUsecase.execute.mockResolvedValue({
        active: true,
        password: 'password',
        ... data
      });
      mockCryptService.crypt.mockReturnValue('password');
      // act
      const response = await usecase.execute({
        login: 'login',
        password: 'password'
      });
      // assert
      expect(response).toEqual(data);
    });

    it('should get response wrong credential', async () => {
      // arrange
      mockGetUserUsecase.execute.mockResolvedValue({
        id: 1,
        code: 'faro',
        password: 'password',
        name_first: 'Fabrice',
        name_last: 'Rosito',
        description: 'Admin',
        mail: 'fabrice.rosito@gmail.com',
        creation: '1706429496000',
        modification: '1706429496000',
        language: 'fr',
        active: true
      });
      mockCryptService.crypt.mockReturnValue('wrong');
      // act
      const response = await usecase.execute({
        login: 'login',
        password: 'password'
      });
      // assert
      expect(response).toEqual(null);
    });

  });
});