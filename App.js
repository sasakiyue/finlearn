import {withAuthenticator} from 'aws-amplify-react-native';
import {Amplify} from 'aws-amplify';
import awsconfig from './src/aws-exports';
import {I18n} from 'aws-amplify';

Amplify.configure(awsconfig);

import React from 'react';
import {StatusBar, StyleSheet, Text, View, Image, Button} from 'react-native';
import Home from './src/Home.js';

function App() {
  return (
    <View style={styles.container}>
      <StatusBar />
      <Home />
    </View>
  );
}
export default withAuthenticator(App);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
  },
});

const dict = {
  ja: {
    'Back to Sign In': 'サインイン画面に戻る',
    Confirm: '確認',
    'Confirmation Code': '検証コード',
    'Confirm a Code': '検証コードの確認',
    'Confirm Sign Up': 'アカウントの検証',
    'Create a new account': 'アカウントの新規登録',
    Email: 'メールアドレス',
    'Enter your confirmation code': '検証コードを入力してください',
    'Enter your new password': '新しいパスワードを入力してください',
    'Enter your password': 'パスワードを入力してください',
    'Enter your username': 'ユーザー名を入力してください',
    'Forgot Password': 'パスワードをお忘れの方 ',
    Hello: 'こんにちは ',
    Password: 'パスワード',
    'Password cannot be empty': 'パスワードは必須入力です',
    'Phone Number': '電話番号',
    'Please Sign In / Sign Up': 'サインインまたは新規登録をしてください',
    'Resend code': '検証コードの再送',
    Send: '検証コードの送信',
    'Sign In': 'サインイン',
    'Sign Out': 'サインアウト',
    'Sign Up': 'アカウントの新規登録',
    'Sign in': 'サインイン',
    'Sign in to your account': 'サインイン',
    Submit: '実行',
    'User does not exist': 'ユーザーが存在しません',
    Username: 'ユーザー名',
    'Username cannot be empty': 'ユーザー名は必須入力です',
    'Username/client id combination not found.': 'ユーザー名が見つかりません',
  },
};

I18n.putVocabularies(dict);
I18n.setLanguage('ja');
