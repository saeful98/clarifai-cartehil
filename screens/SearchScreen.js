import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Button,
  Image,
  ScrollView,
  ActivityIndicator
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import * as Permissions from "expo-permissions";
import * as firebase from "firebase";
import Spinner from 'react-native-loading-spinner-overlay';
import Fire from "../Fire";
import * as ImagePicker from "expo-image-picker";
import Clarifai from "clarifai";

//const Clarifai = require('clarifai');
const app = new Clarifai.App({
  apiKey: "d52fefff477e4e1b8115ea7976dbfb38"
});
process.nextTick = setImmediate;

export default class SearchScreen extends React.Component {
  state = {
    image: null,
    base: null,
    predictions: [],
    t_post: [],
    al: "",
    test: "",
    id_u: "",
    id_ambil: "",
    nilai: 0,
    spinner: false,
  };

  componentDidMount() {
    this.getPhotoPermission();

    
   
  }

  // atas dan bawah untuk cek permission

  getPhotoPermission = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

      if (status != "granted") {
        alert(
          "We need permission to use your camera roll if you'd like to incude a photo."
        );
      }
    }
  };

  pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      base64: true
    });


    //ambil gambar di uri & base64 untuk clarifai
    if (!result.cancelled) {
      this.setState({ image: result.uri });
      this.setState({ base: result.base64 });
    }
  };

  static navigationOptions = {
    header: null,
    };

  handlePost = async () => {
    const file = { base64: this.state.base };

    firebase
      .firestore()
      .collection("IdClarifai")
      .get()
      .then(querySnapshot => {
        

        {setTimeout(() => {

          this.setState({ spinner:true })  

        });}

        querySnapshot.forEach(doc => {
          app.models
            .predict(doc.data().id_u.toString(), file)
            .then(response => {

              {setTimeout(() => {

                this.setState({ spinner:true })  
      
              });}

              response.outputs[0].data.regions.forEach(isi => {
                
                console.log(isi);
                //this.setState({ hitung: this.setState.hitung + 1 })

                if (isi.data.concepts[0].value > this.state.nilai) {
                  this.setState({ nilai: isi.data.concepts[0].value });
                  this.setState({ id_ambil: isi.data.concepts[0].id });
                }
              })  
              
              if (this.state.nilai > 0.8){
              
              firebase
                .firestore()
                .collection("posts")
                //.doc()
                //.doc("LvkwO94PsZwAGr50QXs0")
                .where("id_u", "==", this.state.id_ambil)
                .get()
                .then(querySnapshot => {
                 { setTimeout(() => {

                    this.setState({ spinner:true })  
          
                  });}
                  const tab_post = [];
                  querySnapshot.forEach(doc => {
                      console.log(doc.data().alamat, 'alamat')
                    // doc.data() is never undefined for query doc snapshots
                    //tab_post.push( tab_post.push({
                    tab_post.push({
                      //text: doc.id
                      email_p: doc.data().email_p,
                      alamat: doc.data().alamat,
                      image: doc.data().image,
                      jk: doc.data().jk,
                      kronologi: doc.data().kronologi,
                      token: doc.data().token,
                      lokasi: doc.data().lokasi,
                      nama: doc.data().nama,
                      umur: doc.data().umur
                    });

                  });

                  this.setState({
                    t_post: tab_post
                  });
                
                  {setTimeout(() => {

                    this.setState({ spinner:false })  
          
                  });}
                });
              
              }
                {setTimeout(() => {

                  this.setState({ spinner:false })  
        
                });}
              
            })
            .catch(err => console.log(err));
        
        });
        

        console.log("kembali")
        
        {setTimeout(() => {

          this.setState({ spinner:false })  

        });}
      });

  };


  rendersalah() {

 
    if (this.state.nilai <= 0.8 && this.state.nilai > 0) {
      return (
       
        <View>
          <Text
            style={{
              fontSize: 12,
              fontWeight: "500",
              marginTop: 10,
              marginBottom: 7
            }}
          >
            {" "}
            Tingkat Kecocokan foto dengan laporan adalah {this.state.nilai * 100} % Oleh
            karena itu, disarankan anda melaporkan orang tersebut sebagai orang
            hilang
          </Text>

          <Button
            title="Lapor Orang Hilang"
            //Button Title
            onPress={() =>
              this.props.navigation.navigate("Post")
            }
          />
        </View>
      );
    } else if (this.state.nilai >= 0.8 && this.state.nilai > 0) {

      return (
        <View>
        <Text
          style={{
            fontSize: 12,
            fontWeight: "500",
            marginTop: 10,
            marginBottom: 7
          }}
        >
          {" "}
          Tingkat Kecocokan foto dengan laporan adalah {this.state.nilai * 100} % {" "}
        </Text>

        {this.state.t_post.map((t_post, idx) => {
      return (
        <View key={idx} style={{ orderBottomColor: "gray" }}>
        <View style={styles.infogambar}>
          <Image
            style={{ width: 88, height: 88 }}
            source={{ uri: t_post.image }}
          />
          <View style={styles.info}>
            <Text>{t_post.nama}</Text>
            <Text>{t_post.umur}</Text>
            <Text>{t_post.jk}</Text>
            <Text>{t_post.alamat}</Text>
            <Text>{t_post.lokasi}</Text>
            <Text>{t_post.kronologi}</Text>
          </View>
        </View>
        <View style={styles.listButton}>
          <View style={styles.infoButton}>
            <Button
              title="Lapor Temu"
              //Button Title
              onPress={() =>
                this.props.navigation.navigate("LaporTemu", {
                  id: this.state.id_ambil,
                  email_p: t_post.email_p,
                  token: t_post.token,
                  urii: t_post.image,
                  urii_temu:this.state.image,
                  nama_orhil: t_post.nama,
                  nilai: this.state.nilai
                })
              }
            />
        
           </View>
           <View style={styles.infoButton}>
             <Button title="Detail" color="#e91e63" />
           </View>
         </View>
        </View>


      )

  })}
      
        </View>
      )

                  }  
                }
      
      



  render() {
    let id_u = this.state.id_u;
    
    const { navigation } = this.props;
    return (
      
      
      <SafeAreaView style={styles.container}>
       <ScrollView>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
            <Ionicons name="md-arrow-back" size={24} color="#D8D9DB"></Ionicons>
          </TouchableOpacity>
            <Text style={{ fontWeight: "500", color: 'white' }}>Pencarian Dan Pencocokan</Text>
        </View>

        <TouchableOpacity style={styles.button} onPress={this.pickImage}>
          <Ionicons name="md-camera" size={32} color="#D8D9DB"></Ionicons>
        </TouchableOpacity>
        

        <View style={{ justifyContent: "center",alignItems: 'center', marginHorizontal: 32, marginTop: 32, height: 250 }}>
          <Image
            source={{ uri: this.state.image }}
            style={{ width: "70%", height: "90%" }}
          ></Image>
        </View>

        <TouchableOpacity style={styles.button} onPress={this.handlePost}>
            <Text style={{ fontWeight: "500", color: 'white' }}>Cari</Text>
          </TouchableOpacity>

          <Spinner
          visible={this.state.spinner}
          textContent={'Loading...'}
          textStyle={styles.spinnerTextStyle}
        />

        <Text style={{ fontSize:12,  fontWeight: "500", marginTop:10, marginBottom:7 }}> Hasil   :</Text>
        
      
        {this.rendersalah()}
      
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
    paddingVertical: 5
  },
  input: {
    borderColor: "#8A8F9E",
    borderWidth: StyleSheet.hairlineWidth,
    height: 40,
    fontSize: 15,
    color: "#161F3D"
  },
  photo: {
    alignItems: "flex-end",
    marginHorizontal: 32
  },
  button: {
    //display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 40, 
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',

    backgroundColor: '#e91e63',
    shadowColor: 'gray',
    shadowOpacity: 0.4,
    shadowOffset: { height: 10, width: 0 },
    shadowRadius: 20,
},
      infogambar: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginBottom: 10,
        //marginRight: 5
      },
      info: {
        flexDirection: "column",
        justifyContent: "flex-start"
      },
      listButton: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginRight: 5,
        borderBottomWidth: 2 ,
        marginBottom: 15,
        borderBottomColor: "#8A8F9E",
      },
      infoButton: {
        flexDirection: "row",
        justifyContent: "flex-start",
        marginBottom: 15,
        borderBottomColor: "white"
      }
});
