import React from "react";
import { View, Text, StyleSheet,ScrollView, TouchableOpacity, SafeAreaView, TextInput,Picker, Image  ,ActivityIndicator} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import * as Permissions from "expo-permissions";
import Fire from "../Fire";
import * as ImagePicker from "expo-image-picker";
import  * as firebase from "firebase";




export default class KonfirmasiScreen extends React.Component {
    
    state = {
        uid: "",
        uri: "",
        uri2: "",
        email_asal: "",
        id_panggil: "",
        nama: "",
        keadaan: "",
        alamat_temu: "",
        nilai:0,
    };
    
    static navigationOptions = {
        header: null,
        };

    rubah=()=> {
        let id_u=this.state.value
        this.setState({id_u: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) })
    
    }

    masukan=()=> {
        const { navigation } = this.props;
        this.setState({ uid: JSON.stringify(navigation.getParam('uid', 'default value')).replace(/"/g,'') }),
        this.setState({uri:JSON.stringify(navigation.getParam('uri', 'default value')).replace(/"/g,'')}),
        this.setState({id_panggil:JSON.stringify(navigation.getParam('id_panggil', 'default value')).replace(/"/g,'')}),
        this.setState({uri2:JSON.stringify(navigation.getParam('uri2', 'default value')).replace(/"/g,'')}),
        this.setState({email_asal:JSON.stringify(navigation.getParam('email_asal', 'default value')).replace(/"/g,'')}),
        this.setState({nama:JSON.stringify(navigation.getParam('nama', 'default value')).replace(/"/g,'')}),
        this.setState({keadaan:JSON.stringify(navigation.getParam('keadaan', 'default value')).replace(/"/g,'')}),
        this.setState({alamat_temu:JSON.stringify(navigation.getParam('alamat_temu', 'default value')).replace(/"/g,'')})
        this.setState({nilai:JSON.stringify(navigation.getParam('nilai', 'default value')).replace(/"/g,'')})
        
        
    }

    sendPushNotification(token = this.state.token, title = this.state.title, body = this.state.body) {
        return fetch('https://exp.host/--/api/v2/push/send', {
          body: JSON.stringify({
            to: token,
            title: title,
            body: body,
            data: { message: `${title} - ${body}` },
          }),
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'POST',
        });
      }

    componentDidMount() {
        this.getPhotoPermission();
        
       this.masukan()

       const { email } = firebase.auth().currentUser;
        this.setState({ email  });
     
    }
    
    // atas dan bawah untuk cek permission 
    
    getPhotoPermission = async () => {
        if (Constants.platform.ios) {
            const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

            if (status != "granted") {
                alert("We need permission to use your camera roll if you'd like to incude a photo.");
            }
        }
    };

    static navigationOptions = {
        header: null,
        };
        
    pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true
        });

        if (!result.cancelled) {
            this.setState({ image: result.uri });
        }
    };  
           
    
    handlePost = () => {
        const { navigate } = this.props.navigation;

        firebase
        .firestore()
        .collection("Temu")
        .where('id_panggil', '==',this.state.id_panggil)
        .get()
        .then(querySnapshot => {
            querySnapshot.forEach(doc => {
                
                firebase
                .firestore()
                .collection("Temu")
                .doc(doc.id).delete().then(function() {
                    console.log("Document successfully deleted!")
                    navigate("App")
                }).catch(function(error) {
                    console.error("Error removing document: ", error);
                    
                });
            })
    })}


    render() {
    
         let id_u=this.state.id_u
         
        // this.rubah()
        // console.log(id_u)
        const { navigation } = this.props;
        const { navigate } = this.props.navigation;
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate("MyPostScreen")}>
                        <Ionicons name="md-arrow-back" size={24} color="#D8D9DB"></Ionicons>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.handlePost}>
                        <Text style={{ fontWeight: "500",color: 'white' }}>Delete</Text>
                    </TouchableOpacity>
                </View>

            <ScrollView>
                <View style={styles.inputContainer}>

                {/* <View style={{ justifyContent: "center",alignItems: 'center', marginHorizontal: 32, marginTop: 32, height: 250 }}>
          <Image
            source={{uri: this.state.image_panggil}}
            style={{ width: "70%", height: "90%" }}
          ></Image>
        </View> */}
                <Text style={styles.input}>
            Email asal
            {""}
            {this.state.email_asal}
        </Text>
                       <Text style={styles.input}>
                
            Nama orang hilang :
            {this.state.nama}
            
        </Text>
        <Text style={styles.input}>
                
                keadaan :
                {this.state.keadaan}
                
            </Text>
            <Text style={styles.input}>
                
                alamat temu :
                {this.state.alamat_temu}
                
            </Text>
            <Text style={styles.input}>
                
                nilai :
                {this.state.nilai}
                
            </Text>
    


{/* <Image source={require("../assets/tempAvatar.jpg")} style={styles.avatar}></Image> */}

</View>


                </ScrollView>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    header: {
        flexDirection: "row",
        alignItems: 'baseline',
        backgroundColor :'#b0003a',
        justifyContent: 'space-between',
        paddingHorizontal: 32,
            paddingVertical: 12,
            borderBottomWidth: 1,
        borderBottomColor: "#D8D9DB",
        marginBottom: 10,
    },
    inputContainer: {
        marginBottom: 8,
        marginHorizontal: 12
        //margin: 32,
        //flexDirection: "row"
    },
    inputTitle: {
        //color: "#8A8F9E",
        fontSize: 20,
        paddingVertical: 5,
    },
    input:{
        borderColor: "#8A8F9E",
        borderWidth: StyleSheet.hairlineWidth,
        height: 40,
        fontSize: 15,
        color: "#161F3D"
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        marginRight: 16
    },
    photo: {
        alignItems: "flex-end",
        marginHorizontal: 32
    }
});

