import { Test, TestingModule } from '@nestjs/testing';
import { MemberAuthService } from './member.auth.service';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Member } from '../model/member.entity';
import { Repository } from 'typeorm';

const mockMemberRepository = () => ({
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
});

const mockJwtService = () => ({
  sign: jest.fn().mockReturnValue('mocked-jwt-token'),
});

describe('MemberAuthService', () => {
  let service: MemberAuthService;
  let memberRepository: any;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MemberAuthService,
        { provide: getRepositoryToken(Member), useFactory: mockMemberRepository },
        { provide: JwtService, useFactory: mockJwtService },
      ],
    }).compile();

    service = module.get<MemberAuthService>(MemberAuthService);
    memberRepository = module.get<Repository<Member>>(getRepositoryToken(Member));
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signup', () => {
    it('should create and save a member', async () => {
  memberRepository.create.mockReturnValue({ email: 'test@test.com', password: 'hashed', name: 'Test', phone: '01012345678' });
  memberRepository.save.mockResolvedValue({ id: 1, email: 'test@test.com', password: 'hashed', name: 'Test', phone: '01012345678' });
      const result = await service.signup('test@test.com', 'password', 'Test', '01012345678');
      expect(memberRepository.create).toHaveBeenCalled();
      expect(memberRepository.save).toHaveBeenCalled();
      expect(result.email).toBe('test@test.com');
    });
  });

  describe('validateUser', () => {
    it('should return member if password matches', async () => {
  memberRepository.findOne.mockResolvedValue({ email: 'test@test.com', password: '$2b$10$hash', name: 'Test', phone: '01012345678' });
      jest.spyOn(require('bcrypt'), 'compare').mockResolvedValue(true);
      const result = await service.validateUser('test@test.com', 'password');
      expect(result).not.toBeNull();
    });
    it('should return null if member not found', async () => {
  memberRepository.findOne.mockResolvedValue(null);
      const result = await service.validateUser('notfound@test.com', 'password');
      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return access_token', async () => {
      const member = { id: 1, email: 'test@test.com', name: 'Test', phone: '01012345678' } as Member;
      const result = await service.login(member);
      expect(result.access_token).toBe('mocked-jwt-token');
    });
  });
});
