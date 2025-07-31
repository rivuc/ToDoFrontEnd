import { ComponentFixture, TestBed } from '@angular/core/testing';

import { By } from '@angular/platform-browser';
import { AuthService } from './auth.service';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { environment } from '../../environments/environment';
import { BehaviorSubject } from 'rxjs';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [AuthService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Verifica  no pending http requests
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get a token', () => {
    const token: any = { access_token: 'token123' };

    service.getAuthToken().subscribe((expected) => {
      expect(token).toBe(expected);
    });

    // mock HTTP POST
    const req = httpMock.expectOne(`${environment.apiToken}`);
    expect(req.request.method).toBe('GET');

    //mock response
    req.flush(token);
  });

  it('should get a token', () => {
    const token: any = {
      access_token: 'token123',
    };

    service.getAuthToken().subscribe((expected) => {
      expect(token).toBe(expected);
    });

    // mock HTTP POST
    const req = httpMock.expectOne(`${environment.apiToken}`);
    expect(req.request.method).toBe('GET');

    //mock response
    req.flush(token);
  });

  it('should not refresh token', () => {
    const token: any = {
      access_token: 'token123',
      expirationDate: Date.now() * 2,
    };
    (service as any).tokenSubject = new BehaviorSubject<any | null>(token);

    service.getAuthToken().subscribe((expected) => {
      expect(token).toBe(expected);
    });

    // no calls
    httpMock.expectNone(`${environment.apiToken}`);
  });
});
