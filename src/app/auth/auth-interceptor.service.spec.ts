import { ComponentFixture, TestBed } from '@angular/core/testing';

import { By } from '@angular/platform-browser';
import { AuthService } from './auth.service';
import {
  HTTP_INTERCEPTORS,
  HttpClient,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { environment } from '../../environments/environment';
import { AuthInterceptorService } from './auth-interceptor.service';
import { of, throwError } from 'rxjs';

describe('AuthInterceptorService', () => {
  let service: AuthInterceptorService;
  let httpMock: HttpTestingController;
  let interceptor: AuthInterceptorService;
  let httpClient: HttpClient;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    const AuthServiceSpy = jasmine.createSpyObj('AuthService', [
      'getAuthToken',
    ]);

    await TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: AuthServiceSpy },
        AuthInterceptorService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        {
          provide: HTTP_INTERCEPTORS,
          useClass: AuthInterceptorService,
          multi: true,
        },
      ],
    });

    interceptor = TestBed.inject(AuthInterceptorService);
    //  service = TestBed.inject(AuthInterceptorService);
    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should not modify requests to /api/token', () => {
    const url = '/api/token';
    authServiceSpy.getAuthToken.and.returnValue(of('test token'));

    httpClient.get(url).subscribe();

    const httpRequest = httpMock.expectOne(url);
    expect(httpRequest.request.headers.has('Authorization')).toBeFalse();
  });

  it('should add authorization header to /api/token', () => {
    const url = '/api/data';
    authServiceSpy.getAuthToken.and.returnValue(
      of({ access_token: 'test token', expires_in: 900 })
    );

    httpClient.get(url).subscribe();

    const httpRequest = httpMock.expectOne(url);
    console.log(httpRequest);
    expect(httpRequest.request.headers.get('Authorization')).toBe(
      `Bearer test token`
    );
  });

  it('should handle errors during the token retrieval process', () => {
    authServiceSpy.getAuthToken.and.returnValue(
      throwError(() => new Error('Auth error'))
    );

    const url = '/api/data';
    httpClient.get(url).subscribe({
      next: () => fail('error'),
      error: (e) => expect(e).toBeTruthy(),
    });

    const httpRequest = httpMock.expectNone(url);
  });
});
