import React from "react";
import { View, Text, StyleSheet,ScrollView, TouchableOpacity, SafeAreaView, TextInput,Picker, Image  ,ActivityIndicator} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import * as Permissions from "expo-permissions";
import Fire from "../Fire";
import * as ImagePicker from "expo-image-picker";

const firebase = require("firebase");
require("firebase/firestore");


export default class LaporTemuScreen extends React.Component {
    
    state = {
        namaorhil: "",
        alamat_temu: "",
        informasi_temu:"",
        keadaan_temu:"",
        email:"",
        image_temu:null,


        image: null,
        image_panggil: null,
        t_post: [],
        id_panggil : '',
        nama_panggil: null,
        email_panggil:'',
        nilai:0,
        token:'',
    body:'Buka aplikasi, ada kabar terbaru mengenai orang hilang yang anda cari',
    title:'Kabar Baik',
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
        this.setState({ id_panggil: JSON.stringify(navigation.getParam('id', 'default value')).replace(/"/g,'') }),
        this.setState({email_panggil:JSON.stringify(navigation.getParam('email_p', 'default value')).replace(/"/g,'')}),
        this.setState({token:JSON.stringify(navigation.getParam('token', 'default value')).replace(/"/g,'')}),
        this.setState({image_panggil:JSON.stringify(navigation.getParam('urii', 'default value')).replace(/"/g,'')}),
        this.setState({image_temu:JSON.stringify(navigation.getParam('urii_temu', 'default value')).replace(/"/g,'')}),
        this.setState({nama_panggil:JSON.stringify(navigation.getParam('nama_orhil', 'default value')).replace(/"/g,'')})
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
        //memasukan seluruh data        
        this.sendPushNotification(this.state.token, title = this.state.title, body = this.state.body)

        Fire.shared
            .addTemu({ 
                nama_panggil: this.state.nama_panggil.trim(),
                nilai: this.state.nilai.trim(),
                alamat_temu: this.state.alamat_temu.trim(),
                informasi_temu: this.state.informasi_temu.trim(),
                keadaan_temu: this.state.keadaan_temu.trim(),
                email: this.state.email.trim(),
                email_panggil: this.state.email_panggil.trim(),
                image_temu: this.state.image_temu.trim(),
                image_panggil: this.state.image_panggil.trim(),
                id_panggil: this.state.id_panggil.trim()
            })
            .then(ref => {
                
                this.setState({ 
                alamat_temu: "",
                informasi_temu: "",
                keadaan_temu:"",
                 });
                 navigate('App')
            })
            .catch(error => {
                alert(error);
            });

    };


    render() {
    
         let id_u=this.state.id_u
         
        // this.rubah()
        // console.log(id_u)
        const { navigation } = this.props;
        const { navigate } = this.props.navigation;
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() =>navigate('App')}>
                        <Ionicons name="md-arrow-back" size={24} color="#D8D9DB"></Ionicons>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.handlePost}>
                        <Text style={{ fontWeight: "500",color: 'white' }}>Post</Text>
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
            Anda Menemukan
            {""}
            {this.state.nama_panggil}
        </Text>
                       <Text style={styles.input}>
                
            yang dilaporkan oleh :
            {this.state.email_panggil}
            
        </Text>

{/* <Image source={require("../assets/tempAvatar.jpg")} style={styles.avatar}></Image> */}

</View>

                
                <View style={styles.inputContainer}>
                    <Text style={styles.inputTitle}>Alamat Temu</Text>
                    <TextInput
                        autoFocus={true}
                        //multiline={true}
                        //numberOfLines={4}
                        style={styles.input}
                        placeholder="Alamat Temu"
                        onChangeText={alamat_temu => this.setState({ alamat_temu })}
                        value={this.state.alamat_temu}
                    ></TextInput>
                </View>
                <View style={styles.inputContainer}>
{/* <Image source={require("../assets/tempAvatar.jpg")} style={styles.avatar}></Image> */}
                    <Text style={styles.inputTitle}>Kronologi Penemuan</Text>
                    <TextInput
                        autoFocus={true}
                        //multiline={true}
                        //numberOfLines={4}
                        style={styles.input}
                        placeholder="Kronologi Penemuan"
                        onChangeText={informasi_temu => this.setState({ informasi_temu })}
                        value={this.state.informasi_temu}
                    ></TextInput>
                </View>
                <View style={styles.inputContainer}>
{/* <Image source={require("../assets/tempAvatar.jpg")} style={styles.avatar}></Image> */}
                    <Text style={styles.inputTitle}>Keadaan 
                    {JSON.stringify(navigation.getParam('nama_orhil', 'default value'))} </Text>
                    <TextInput
                        autoFocus={true}
                        //multiline={true}
                        //numberOfLines={4}
                        style={styles.input}
                        placeholder="keadaan saat ini" 
                        onChangeText={keadaan_temu => this.setState({ keadaan_temu })}
                        value={this.state.keadaan_temu}
                    ></TextInput>
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

