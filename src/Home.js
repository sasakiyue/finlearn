import React, {useState, useEffect, useMemo} from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  Platform,
  Button,
  Dimensions,
} from 'react-native';
import {DataStore, Auth, selectInput} from 'aws-amplify';
import {User, Quiz} from './models';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as Progress from 'react-native-progress';
import {ProgressChart} from 'react-native-chart-kit';
import {withAuthenticator} from 'aws-amplify-react-native/dist/Auth';
import Question from './components/Question';
Icon.loadFont();

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const data = {
  labels: ['Swim', 'Bike'],
  data: [Math.random() * 0.9, Math.random() * 0.9],
};

const chartConfig = {
  backgroundGradientFrom: 'black',
  backgroundGradientFromOpacity: 0,
  backgroundGradientTo: 'black',
  backgroundGradientToOpacity: 0,
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // グラフの色
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // ラベルの色
};

const Header = () => (
  <View style={styles.headerContainer}>
    <Text style={styles.headerTitle}>Finoble</Text>
  </View>
);

function HomeScreen({authUser, user}) {
  console.log(authUser);
  console.log(user);
  const userPoint = user ? user[0].point : 0;
  const maxPoint = 1000;
  const currentProgress = userPoint / maxPoint;
  return (
    <View style={{flex: 1}}>
      <View style={{flex: 1}}>
        <Text style={styles.userIdText}>
          {authUser && authUser.email}でログイン中
        </Text>
      </View>
      <View style={{flex: 1}}>
        <Text style={styles.text}>お知らせが入ります</Text>
      </View>
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>{user && user.map(item => item && item.point)}pt</Text>
        <Progress.Bar
          animated={true}
          // indeterminate={true}
          borderRadius={100}
          height={10}
          progress={currentProgress}
          width={200}
          // animationType="timing"
        />
      </View>
      <View style={{flex: 3, justifyContent: 'center', alignItems: 'center'}}>
        <Progress.Circle
          size={100}
          showsText={true}
          formatText={progress => `${userPoint} pt`}
          progress={currentProgress}
        />
        <ProgressChart
          data={data}
          chartConfig={chartConfig}
          width={windowWidth * 0.99}
          height={windowHeight / 6}
          strokeWidth={10}
          hideLegend={true}
        />
      </View>
      <View style={{flex: 3, justifyContent: 'center', alignItems: 'center'}}>
        <Text style={styles.text}>いったん枠確保</Text>
      </View>
    </View>
  );
}

function QuizScreen({user, quiz}) {
  console.log(quiz);
  const savePoint = async () => {
    console.log(user);
    await DataStore.save(
      User.copyOf(user[0], updated => {
        console.log('ポイント加算するメソッド');
        updated.point = user[0].point + 1;
        console.log(updated.point);
      }),
    );
  };
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>{quiz && quiz.map(quizItem => quizItem && quizItem.question)}</Text>
      <Button onPress={savePoint} title="かずや" />
      <Text>{user && user.map(userItem => userItem && userItem.point)}</Text>
    </View>
  );
}

function SettingsScreen() {
  async function signOut() {
    try {
      await Auth.signOut();
      DataStore.clear();
    } catch (error) {
      console.log('error signing out: ', error);
    }
  }
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>Settings!</Text>
      <Button onPress={signOut} title="サインアウト" />
    </View>
  );
}

const Tab = createBottomTabNavigator();

const Home = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [quizInfo, setQuizInfo] = useState(null);

  //   認証情報を取得するファンクション
  useEffect(() => {
    const init = async () => {
      currentUserInfo = await Auth.currentUserInfo();
      setCurrentUser(currentUserInfo.attributes);
      console.log('デバッグコード：認証情報取得が完了しました');
      console.log(currentUserInfo);
    };
    init();
  }, []);

  //   認証ユーザ取得後、Userテーブルからユーザ情報を取得するファンクション
  useEffect(() => {
    if (!currentUser) {
      console.log('デバッグコード：currentUserの取得できていません');
    } else {
      console.log(currentUser.email);
      console.log('デバッグコード：ユーザのemail表示');
      const subscription = DataStore.observeQuery(User, p =>
        p.email('eq', currentUser.email),
      ).subscribe(snapshot => {
        const {items, isSynced} = snapshot;
        console.log(
          `[Snapshot] item count: ${items.length}, isSynced: ${isSynced}`,
          //   setUserData(items.map(item => item && item.point)),
          setUserData(items),
          console.log(items),
          console.log('デバッグコード：認証ユーザのポイントを取得完了'),
          console.log(items => items.map(item => item.point)),
        );
      });
      return () => {
        subscription.unsubscribe();
      };
    }
  }, [currentUser]);

  //   クイズ情報を取得するファンクション
  useEffect(() => {
    const getQuizInfo = async () => {
      const queryQuiz = await DataStore.query(Quiz);
      setQuizInfo(queryQuiz);
    };
    getQuizInfo();
    console.log(quizInfo);
    console.log('クイズ情報取得完了');
  }, []);

  const HomeComponent = useMemo(() => {
    console.log('デバッグコード：Homeコンポーネント実行');
    return () => <HomeScreen authUser={currentUser} user={userData} />;
  }, [userData]);

  const QuizComponent = useMemo(() => {
    return () => <QuizScreen user={userData} quiz={quizInfo} />;
  }, [userData]);

  if (!currentUser) {
    console.log('ユーザデータが取得できてないよ');
    return null;
  } else {
    return (
      <>
        <Header />
        <NavigationContainer>
          <Tab.Navigator>
            <Tab.Screen
              name="Home"
              component={HomeComponent}
              options={{
                headerShown: false,
                tabBarIcon: ({color, size}) => (
                  <Icon name="home" color={color} size={size} />
                ),
              }}
            />
            <Tab.Screen
              name="クイズ"
              component={QuizComponent}
              options={{
                tabBarIcon: ({color, size}) => (
                  <Icon name="trophy" color={color} size={size} />
                ),
              }}
            />
            <Tab.Screen
              name="動画"
              component={SettingsScreen}
              options={{
                tabBarIcon: ({color, size}) => (
                  <Icon name="toggle-right" color={color} size={size} />
                ),
              }}
            />
            <Tab.Screen
              name="特典"
              component={SettingsScreen}
              options={{
                tabBarIcon: ({color, size}) => (
                  <Icon name="gift" color={color} size={size} />
                ),
              }}
            />
            <Tab.Screen
              name="アカウント"
              component={SettingsScreen}
              options={{
                headerShown: false,
                tabBarIcon: ({color, size}) => (
                  <Icon name="user-circle" color={color} size={size} />
                ),
              }}
            />
          </Tab.Navigator>
        </NavigationContainer>
      </>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  text: {
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
    margin: 10,
  },
  userIdText: {
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'left',
    margin: 10,
  },
  headerContainer: {
    backgroundColor: '#00008B',
    paddingTop: Platform.OS === 'ios' ? 44 : 0,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
    paddingVertical: 16,
    textAlign: 'center',
  },
  todoContainer: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 2,
    elevation: 4,
    flexDirection: 'row',
    marginHorizontal: 8,
    marginVertical: 4,
    padding: 8,
    shadowOffset: {
      height: 1,
      width: 1,
    },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  todoHeading: {
    fontSize: 20,
    fontWeight: '600',
  },
  checkbox: {
    borderRadius: 2,
    borderWidth: 2,
    fontWeight: '700',
    height: 20,
    marginLeft: 'auto',
    textAlign: 'center',
    width: 20,
  },
  completedCheckbox: {
    backgroundColor: '#000',
    color: '#fff',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    padding: 16,
  },
  buttonContainer: {
    alignSelf: 'center',
    backgroundColor: '#4696ec',
    borderRadius: 99,
    paddingHorizontal: 8,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 44,
    elevation: 6,
    shadowOffset: {
      height: 4,
      width: 1,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  modalContainer: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  modalInnerContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    justifyContent: 'center',
    padding: 16,
  },
  modalInput: {
    borderBottomWidth: 1,
    marginBottom: 16,
    padding: 8,
  },
  modalDismissButton: {
    marginLeft: 'auto',
  },
  modalDismissText: {
    fontSize: 20,
    fontWeight: '700',
  },
});

export default Home;
