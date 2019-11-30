import React, {Component} from "react";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { createBottomTabNavigator } from "react-navigation-tabs";
import { Ionicons } from "@expo/vector-icons";
import LoadingScreen from "./screens/LoadingScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";

import LaporTemuScreen from "./screens/LaporTemuScreen";
import KonfirmasiScreen from "./screens/KonfirmasiScreen";
import PostDScreen from "./screens/PostDScreen";


import HomeScreen from "./screens/HomeScreen";
import MyPostScreen from "./screens/MyPostScreen";
import PostScreen from "./screens/PostScreen";
import SearchScreen from "./screens/SearchScreen";
import ProfileScreen from "./screens/ProfileScreen";

import * as firebase from "firebase";

firebaseConfig = {
  apiKey: "AIzaSyDItuC83vSiJ-tjKXjbGjMaSMM4fGq0BtQ",
  authDomain: "oranghilang-e7293.firebaseapp.com",
  databaseURL: "https://oranghilang-e7293.firebaseio.com",
  projectId: "oranghilang-e7293",
  storageBucket: "oranghilang-e7293.appspot.com",
  messagingSenderId: "1046397544307",
  appId: "1:1046397544307:web:385648f71ec81be69b4706"
};

firebase.initializeApp(firebaseConfig);

const AppContainer = createStackNavigator(
    {
        default: createBottomTabNavigator(
            {
                Home: {
                    screen: HomeScreen,
                    navigationOptions: {
                        tabBarIcon: ({ tintColor }) => <Ionicons name="ios-home" size={24} color={tintColor} />
                    }
                },
                Search: {
                    screen: SearchScreen,
                    navigationOptions: {
                        tabBarIcon: ({ tintColor }) => <Ionicons name="md-search" size={24} color={tintColor} />
                    }
                },
                Post: {
                    screen: PostScreen,
                    navigationOptions: {
                        tabBarIcon: ({ tintColor }) => (
                            <Ionicons
                                name="ios-add-circle"
                                size={48}
                                color="#E9446A"
                                style={{
                                    shadowColor: "#E9446A",
                                    shadowOffset: { width: 0, height: 10 },
                                    shadowRadius: 10,
                                    shadowOpacity: 0.3
                                }}
                            />
                        )
                    }
                },
                Notification: {
                    screen: MyPostScreen,
                    navigationOptions: {
                        tabBarIcon: ({ tintColor }) => <Ionicons name="ios-document" size={24} color={tintColor} />
                    }
                },
                Profile: {
                    screen: ProfileScreen,
                    navigationOptions: {
                        tabBarIcon: ({ tintColor }) => <Ionicons name="ios-person" size={24} color={tintColor} />
                    }
                }
            },
            {
                defaultNavigationOptions: {
                    tabBarOnPress: ({ navigation, defaultHandler }) => {
                        if (navigation.state.key === "Post") {
                            navigation.navigate("postModal");
                        } else {
                            defaultHandler();
                        }
                    }
                },
                tabBarOptions: {
                    activeTintColor: "#161F3D",
                    inactiveTintColor: "#B8BBC4",
                    showLabel: false
                }
            }
        ),
        postModal: {
            screen: PostScreen
        }
    },
    {
        mode: "modal",
        headerMode: "none"
        //initialRouteName: "postModal"
    }
);

const AuthStack = createStackNavigator({
    Login: LoginScreen,
    Register: RegisterScreen,
    
});

const Laporan = createStackNavigator({
    Search: SearchScreen,  
    LaporTemu: LaporTemuScreen,
    Post : PostScreen,
    PostD : PostDScreen,
});

const hasil = createStackNavigator({
    MyPostScreen: MyPostScreen,  
    KonfirmasiScreen: KonfirmasiScreen,
},
{
    initialRouteName: "MyPostScreen"
});




export default createAppContainer(
    createSwitchNavigator(
        {
            Loading: LoadingScreen,
            App: AppContainer,
            Laporan: Laporan,
            hasil : hasil,
            Auth: AuthStack
        },
        {
            initialRouteName: "Loading"
        }
    )
);
