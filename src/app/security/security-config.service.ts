// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { ConfigService } from '../core/config/config.service';
import { AuthConfig } from '../core/config/config.contract';

@Injectable()
export class SecurityConfigService {

  private securityConfig;
  languagePreferenceFromCookie = '';
  languageToUse = '';
  localizationData: boolean;
  auth: AuthConfig;
  // replace with dynamic list of languages in PHASE 2
  languagesSupported = ['de', 'en', 'es', 'fr', 'hu', 'it', 'ja', 'ko', 'pl', 'pt', 'ru', 'zh'];
  private localizationEnable = new BehaviorSubject<boolean>(false);

  constructor(private config: ConfigService) {
    this.auth = config.getConfig('auth');
    this.getCookiesLanguagePreference();
    this.localizationSecurityConfig();
  }

  localizationSecurityConfig() {
    this.localizationData = this.getLocalizationUpdated();
    this.languageToUse = this.languagePreferenceFromCookie ? this.languagePreferenceFromCookie : this.getUsersLocale();
    this.languageToUse = this.languagesSupported.find(x => x === this.languageToUse.toLowerCase()) || 'en';

    this.securityConfig = {
      el: '#login-container',
      baseUrl: this.auth.orgUrl,
      clientId: this.auth.clientId,
      language: this.languageToUse,
      redirectUri: this.auth.redirectUri,
      logo: this.config.getConfig('logo'),
      helpLinks: {
        forgotPassword: this.auth.resetPassword
      },
      authParams: {
        issuer: this.auth.issuer,
        // authorizeUrl: this.config.appConfig.auth.authorizeUrl,
        scopes: this.auth.scopes,
        pkce: this.auth.pkce,
        cookies: {
          secure: false
        }
      },
      i18n: {
        'en': {
          'primaryauth.title': 'Please sign in.',
          'password.expired.title.generic': 'Reset password',
          'password.complexity.length': 'At least {0} characters',
          'password.complexity.number': 'At least 1 number',
          'password.oldPassword.placeholder': 'Current password',
          'password.oldPassword.tooltip': ' ',
          'password.confirmPassword.placeholder': 'Re-enter new password',
          'password.confirmPassword.tooltip': ' ',
          'password.expired.submit': 'Next',
          'signout': 'Cancel',
          'forgotpassword': 'Forgot password?',
          'remember': 'Remember me',
          'primaryauth.username.placeholder': 'Username',
          'primaryauth.password.placeholder': 'Password',
          'primaryauth.submit': 'Sign In' // signin
        },
        'de': {
          'primaryauth.title': 'Bitte einloggen',
          'password.expired.title.generic': 'Passwort zurücksetzen',
          'password.complexity.length': 'Mindestens {0} Zeichen',
          'password.complexity.number': 'Mindestens 1 Zahl',
          'password.oldPassword.placeholder': 'Aktuelles Passwort',
          'password.oldPassword.tooltip': ' ',
          'password.confirmPassword.placeholder': 'Neues Passwort erneut eingeben',
          'password.confirmPassword.tooltip': ' ',
          'password.expired.submit': 'Weiter',
          'signout': 'Abbrechen',
          'forgotpassword': 'Passwort vergessen?',
          'remember': 'Erinnere dich an mich',
          'primaryauth.username.placeholder': 'Benutzername',
          'primaryauth.password.placeholder': 'Passwort',
          'primaryauth.submit': 'ANMELDEN' // signin
        },
        'fr': {
          'primaryauth.title': 'Veuillez vous connecter',
          'password.expired.title.generic': 'Réinitialiser le mot de passe',
          'password.complexity.length': 'Au moins {0} caractères',
          'password.complexity.number': 'Au moins 1 chiffre',
          'password.oldPassword.placeholder': 'Mot de passe actuel',
          'password.oldPassword.tooltip': '',
          'password.confirmPassword.placeholder': 'Nouveau mot de passe (répétez)',
          'password.confirmPassword.tooltip': ' ',
          'password.expired.submit': 'Suivant',
          'signout': 'Annuler',
          'forgotpassword': 'Mot de passe oublié ?',
          'remember': 'Souviens-toi de moi',
          'primaryauth.username.placeholder': 'Nom d\'utilisateur',
          'primaryauth.password.placeholder': 'Mot de passe',
          'primaryauth.submit': 'CONNEXION' // signin
        },
        'es': {
          'primaryauth.title': 'Por favor, inicia sesión',
          'password.expired.title.generic': 'Restablecer contraseña',
          'password.complexity.length': 'Al menos {0} caracteres',
          'password.complexity.number': 'Al menos 1 número',
          'password.oldPassword.placeholder': 'Contraseña actual',
          'password.oldPassword.tooltip': ' ',
          'password.confirmPassword.placeholder': 'Reingresa la nueva contraseña',
          'password.confirmPassword.tooltip': ' ',
          'password.expired.submit': 'Siguiente',
          'signout': 'Cancelar',
          'forgotpassword': '¿Olvidó su contraseña?',
          'remember': 'Recuérdame',
          'primaryauth.username.placeholder': 'Nombre de usuario',
          'primaryauth.password.placeholder': 'Contraseña',
          'primaryauth.submit': 'INICIAR SESIÓN' // signin
        },
        'it': {
          'primaryauth.title': 'Accedi per favore',
          'password.expired.title.generic': 'Reimposta la password',
          'password.complexity.length': 'Almeno {0} caratteri',
          'password.complexity.number': 'Almeno 1 numero',
          'password.oldPassword.placeholder': 'Password attuale',
          'password.oldPassword.tooltip': ' ',
          'password.confirmPassword.placeholder': 'Reinserisci nuova password',
          'password.confirmPassword.tooltip': ' ',
          'password.expired.submit': 'Avanti',
          'signout': 'Annulla',
          'forgotpassword': 'Password dimenticata?',
          'remember': 'Ricordami',
          'primaryauth.username.placeholder': 'Nome utente',
          'primaryauth.password.placeholder': 'Password',
          'primaryauth.submit': 'ACCEDI' // signin
        },
        'pt': {
          'primaryauth.title': 'Por favor, faça login',
          'password.expired.title.generic': 'Redefinir senha',
          'password.complexity.length': 'Pelo menos {0} caracteres',
          'password.complexity.number': 'Pelo menos 1 número',
          'password.oldPassword.placeholder': 'Senha atual',
          'password.oldPassword.tooltip': '',
          'password.confirmPassword.placeholder': 'Reintroduza a nova senha',
          'password.confirmPassword.tooltip': ' ',
          'password.expired.submit': 'Avançar',
          'signout': 'Cancelar',
          'forgotpassword': 'Esqueceu a senha??',
          'remember': 'Lembra-me',
          'primaryauth.username.placeholder': 'Nome de usuário',
          'primaryauth.password.placeholder': 'Senha',
          'primaryauth.submit': 'ENTRAR' // signin
        },
        'pl': {
          'primaryauth.title': 'Proszę się zalogować',
          'password.expired.title.generic': 'Zresetuj hasło',
          'password.complexity.length': 'Co najmniej {0} znaków',
          'password.complexity.number': 'Co najmniej 1 cyfra',
          'password.oldPassword.placeholder': 'Obecne hasło',
          'password.oldPassword.tooltip': '',
          'password.confirmPassword.placeholder': '',
          'password.confirmPassword.tooltip': 'Powtórz nowe hasło ',
          'password.expired.submit': 'Dalej',
          'signout': 'Anuluj',
          'forgotpassword': 'Nie pamiętasz hasła?',
          'remember': 'Zapamiętaj mnie',
          'primaryauth.username.placeholder': 'Nazwa użytkownika',
          'primaryauth.password.placeholder': 'Hasło',
          'primaryauth.submit': 'ZALOGUJ SIĘ' // signin
        },
        'hu': {
          'primaryauth.title': 'Kérlek jelentkezz be',
          'password.expired.title.generic': 'Jelszó visszaállítása',
          'password.complexity.length': 'Legalább {0} karakter',
          'password.complexity.number': 'Legalább 1 szám',
          'password.oldPassword.placeholder': 'Jelenlegi jelszó',
          'password.oldPassword.tooltip': '',
          'password.confirmPassword.placeholder': 'Új jelszó újból',
          'password.confirmPassword.tooltip': ' ',
          'password.expired.submit': 'Tovább',
          'signout': 'Mégse',
          'forgotpassword': 'Elfelejtette a jelszavát?',
          'remember': 'Emlékezz rám',
          'primaryauth.username.placeholder': 'Felhasználónév',
          'primaryauth.password.placeholder': 'Jelszó',
          'primaryauth.submit': 'BEJELENTKEZÉS' // signin
        },
        'ru': {
          'primaryauth.title': 'Пожалуйста, войдите в систему',
          'password.expired.title.generic': 'Сбросить пароль',
          'password.complexity.length': 'Не менее {0} символов',
          'password.complexity.number': 'Не менее 1 числа',
          'password.oldPassword.placeholder': 'Текущий пароль',
          'password.oldPassword.tooltip': '',
          'password.confirmPassword.placeholder': '"Повторите новый пароль',
          'password.confirmPassword.tooltip': ' ',
          'password.expired.submit': 'Далее',
          'signout': 'Отмена',
          'forgotpassword': 'Забыли пароль?',
          'remember': 'Запомни меня',
          'primaryauth.username.placeholder': 'Имя пользователя',
          'primaryauth.password.placeholder': 'Пароль',
          'primaryauth.submit': 'ВОЙТИ' // signin
        },
        'ko': {
          'primaryauth.title': '로그인해주세요',
          'password.expired.title.generic': '비밀번호 재설정',
          'password.complexity.length': '{0}자 이상이어야 합니다',
          'password.complexity.number': '숫자를 적어도 1개 이상 입력해주세요',
          'password.oldPassword.placeholder': '현재 비밀번호',
          'password.oldPassword.tooltip': ' ',
          'password.confirmPassword.placeholder': '새로운 비밀번호 재입력',
          'password.confirmPassword.tooltip': ' ',
          'password.expired.submit': '다음',
          'signout': '취소',
          'forgotpassword': '비밀번호를 잊으셨나요?',
          'remember': '나를 기억해',
          'primaryauth.username.placeholder': '사용자 이름',
          'primaryauth.password.placeholder': '비밀번호',
          'primaryauth.submit': '로그인' // signin
        },
        'ja': {
          'primaryauth.title': 'ログインしてください。',
          'password.expired.title.generic': 'パスワードをリセット',
          'password.complexity.length': '{0}文字以上で設定してください',
          'password.complexity.number': '少なくとも1つの数字を含めてください。',
          'password.oldPassword.placeholder': '現在のパスワード',
          'password.oldPassword.tooltip': ' ',
          'password.confirmPassword.placeholder': '新しいパスワードを再入力',
          'password.confirmPassword.tooltip': ' ',
          'password.expired.submit': '次へ',
          'signout': 'キャンセル',
          'forgotpassword': 'パスワードをお忘れですか?',
          'remember': '私を覚えてください',
          'primaryauth.username.placeholder': 'ユーザー名',
          'primaryauth.password.placeholder': 'パスワード',
          'primaryauth.submit': 'サインイン' // signin
        },
        'zh': {
          'primaryauth.title': '请登录。',
          'password.expired.title.generic': '重置密码',
          'password.complexity.length': '至少 {0} 个字符',
          'password.complexity.number': '至少 1 个数字',
          'password.oldPassword.placeholder': '当前密码',
          'password.oldPassword.tooltip': ' ',
          'password.confirmPassword.placeholder': '重新输入新密码',
          'password.confirmPassword.tooltip': ' ',
          'password.expired.submit': '下一步',
          'signout': '取消',
          'forgotpassword': '忘记密码?',
          'remember': '记住我',
          'primaryauth.username.placeholder': '用户名',
          'primaryauth.password.placeholder': '密码',
          'primaryauth.submit': '登录' // signin
        },
      },
    };
  }

  setLocalizationUpdated(status: boolean) {
    this.localizationEnable.next(status);
    this.localizationSecurityConfig();
  }

  getLocalizationUpdated(): boolean {
    return this.localizationEnable.getValue();
  }

  get OktaConfig() {
    return this.securityConfig;
  }

  getCookiesLanguagePreference() {
    const cookieData = this.getCookie('language');
    return cookieData;
  }

  getCookie(cookieName: string) {
    const cookieData = document.cookie.split(';');
    for (let i = 0; i < cookieData.length; i++) {
      if (cookieData[i].split('=')[0].trim() === cookieName) {
        this.languagePreferenceFromCookie = cookieData[i].split('=')[1].trim();
        return true;
      }
    }
  }

  getUsersLocale(): string {
    if (typeof window === 'undefined' || typeof window.navigator === 'object') {
      return 'en';
    }
    const wn = window.navigator as any;
    let lang = wn.languages ? wn.languages[0] : 'en';
    lang = lang || wn.language || wn.browserLanguage || wn.userLanguage;
    return lang;
  }
}
