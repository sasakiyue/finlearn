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
} from 'react-native';
import {DataStore, Auth} from 'aws-amplify';
import {User} from './models';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/FontAwesome';
Icon.loadFont();

const Header = () => (
  <View style={styles.headerContainer}>
    <Text style={styles.headerTitle}>Finoble</Text>
  </View>
);

function HomeScreen({user}) {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>Home!</Text>
      <Text>{user.point}</Text>
    </View>
  );
}

function QuizScreen({user}) {
  //   useEffect(() => {
  //     const savePoint = async () => {
  //       await DataStore.save(
  //         User.copyOf(user, updated => {
  //           updated.point = user.point + 1;
  //         }),
  //       );
  //     };
  //     savePoint();
  //   }, []);
  const savePoint = async () => {
    await DataStore.save(
      User.copyOf(user, updated => {
        updated.point = user.point + 1;
        console.log('よう');
      }),
    );
    console.log('かずや');
  };
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>{user.point}</Text>
      <Button onPress={savePoint} title="かずや" />
    </View>
  );
}

function SettingsScreen() {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>Settings!</Text>
    </View>
  );
}

const Tab = createBottomTabNavigator();

const Home = () => {
  const [currentUserName, setCurrentUserName] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const init = async () => {
      const currentUser = await Auth.currentUserInfo();
      setCurrentUserName(currentUser.attributes.email);
    };
    init();
  }, []);

  useEffect(() => {
    // const getPoint = async () => {
    //   const user = await DataStore.query(
    //     User,
    //     '08039bb4-e9d2-45eb-ab28-355c5b2f3fde',
    //   );
    //   console.log(user.point);
    //   setUserData(user);
    // };
    // getPoint();

    // const id = '08039bb4-e9d2-45eb-ab28-355c5b2f3fde';
    const id = currentUserName;
    // const userId = currentUserName;
    DataStore.clear();
    const subscription = DataStore.observe(User, id).subscribe(msg => {
      console.log(msg.element);
      setUserData(msg.element);
    });
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const HomeComponent = useMemo(() => {
    return () => <HomeScreen user={userData} />;
  }, [userData]);

  const QuizComponent = useMemo(() => {
    return () => <QuizScreen user={userData} />;
  }, [userData]);

  if (!userData) {
    return null;
  }
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
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#4696ec',
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
