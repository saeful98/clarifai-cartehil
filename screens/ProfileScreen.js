import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, LayoutAnimation } from "react-native";
import * as firebase from "firebase";

export default class ProfileScreen extends React.Component {
    state = { email: "", displayName: "",displayTelp:""  };

    componentDidMount() {
        const { email, displayName, displayTelp } = firebase.auth().currentUser;

        this.setState({ email, displayName,displayTelp  });
    }

    signOutUser = () => {
        firebase.auth().signOut();
    };

    render() {
        LayoutAnimation.easeInEaseOut();

        return (
            <View style={styles.container}>
                <Text>Hi {this.state.email}!</Text>
                <Text>Hi {this.state.displayName}!</Text>
                <Text>Hi {this.state.displayTelp}!</Text>
                <TouchableOpacity style={{ marginTop: 32 }} onPress={this.signOutUser}>
                    <Text>Logout</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    }
});
