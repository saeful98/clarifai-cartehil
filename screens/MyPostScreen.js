import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Button,
  RefreshControl,
  Header
} from "react-native";
import * as firebase from "firebase";
import Clarifai from "clarifai";
import Fire from "../Fire";
import { ScrollView } from "react-native-gesture-handler";
// import ItemComponent from '../component/ItemComponents';

// var postsRef = firebase.firestore().collection('posts');
const app = new Clarifai.App({
  apiKey: "f27e8dbceb8c48048c3e48ef94852507"
});
process.nextTick = setImmediate;


export default class MyPostScreen extends React.Component {
    state = { t_post: [], laportemu: [], hasiltemu:[], email:"",show_p: false,show_l: false,show_t: false,refreshing: false, };

    _onRefresh = () => {
      this.setState({refreshing: true});
    
      this.componentDidMount()

      this.setState({refreshing: false});
    
    }
    
    static navigationOptions = {
      header: null,
      };


    componentDidMount() {
        const { email } = firebase.auth().currentUser;

        this.setState({ email  });

      firebase
        .firestore()
        .collection("posts")
        .where('email_p', '==',email)
        .get()
        .then(querySnapshot => {
          const tab_post = [];
          querySnapshot.forEach(doc => {
            // doc.data() is never undefined for query doc snapshots
            //tab_post.push( tab_post.push({
            tab_post.push({
              //text: doc.id
              alamat: doc.data().alamat,
              image: doc.data().image,
              jk: doc.data().jk,
              kronologi: doc.data().kronologi,
              lokasi: doc.data().lokasi,
              nama: doc.data().nama,
              umur: doc.data().umur
            });
  
            //console.log(doc, "=>", doc.data());
          });

          this.setState({
            t_post: tab_post
          });
          console.log(this.state.t_post )
        });

        firebase
        .firestore()
        .collection("Temu")
        .where('email', '==',email)
        .get()
        .then(querySnapshot => {
          const laportemu2 = [];
          querySnapshot.forEach(doc => {
            // doc.data() is never undefined for query doc snapshots
            //tab_post.push( tab_post.push({
                laportemu2.push({
              //text: doc.id
              uid: doc.data().uid,
              id_panggil: doc.data().id_panggil,
              alamat_temu: doc.data().alamat_temu,
              image: doc.data().image_panggil,
              image_temu: doc.data().image_temu,
              email_asal: doc.data().email_panggil,
              keadaan_temu: doc.data().keadaan_temu,
              nilai: doc.data().nilai,
              nama_panggil: doc.data().nama_panggil,
              informasi: doc.data().informasi_temu
            });
  
          });
  
          this.setState({
            laportemu: laportemu2
          });
        });

        firebase
        .firestore()
        .collection("Temu")
        .where('email_panggil', '==',email)
        .get()
        .then(querySnapshot => {
          const hasiltemu2 = [];
          querySnapshot.forEach(doc => {
            // doc.data() is never undefined for query doc snapshots
            //tab_post.push( tab_post.push({
                hasiltemu2.push({
              //text: doc.id
              uid: doc.data().uid,
              id_panggil: doc.data().id_panggil,
              alamat_temu: doc.data().alamat_temu,
              image: doc.data().image_panggil,
              image_temu: doc.data().image_temu,
              email_penemu: doc.data().email,
              keadaan_temu: doc.data().keadaan_temu,
              nilai: doc.data().nilai,
              nama_panggil: doc.data().nama_panggil,
              informasi: doc.data().informasi_temu
            });
  
          });
  
          this.setState({
            hasiltemu: hasiltemu2
          });
        });

    }

    ShowHidePost = () => {
        if (this.state.show_p == true) {
          this.setState({ show_p: false });
        } else {
          this.setState({ show_p: true });
        }
      };

      ShowHidelapor = () => {
        if (this.state.show_l == true) {
          this.setState({ show_l: false });
        } else {
          this.setState({ show_l: true });
        }
      };

      ShowHidetemu = () => {
        if (this.state.show_t == true) {
          this.setState({ show_t: false });
        } else {
          this.setState({ show_t: true });
        }
      };



    render() {
      const { navigate } = this.props.navigation;
        return (
            <View style={styles.container}>
<View style={styles.header}>
            <Text style={{fontSize:12, color:'white',fontWeight: 'bold'}}>Halaman Utama</Text>
        </View>
        <ScrollView refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh}/>
          }>

        <View style={styles.jarak}>
        <Button title="data laporan yang berhasil ditemukan" onPress={this.ShowHidetemu} color="#ed407a"/>
        </View>
        <View style={styles.jarak}>
        {this.state.show_t ? (
          this.state.hasiltemu.map((hasiltemu, idx) => {
            return (
              <View key={idx} style={{ orderBottomColor: "gray" }}>
                <View style={styles.infogambar}>
                  <Image
                    style={{ width: 88, height: 88 }}
                    source={{ uri: hasiltemu.image }}
                  />
                  <Image
                    style={{ width: 88, height: 88 }}
                    source={{ uri2: hasiltemu.image_temu }}
                  />
                  <View style={styles.info}>
                  <Text>{hasiltemu.email_temu}</Text>
                    <Text>{hasiltemu.nama_panggil}</Text>
                    <Text>{hasiltemu.keadaan_temu}</Text>
                    <Text>{hasiltemu.informasi}</Text>
                    <Text>{hasiltemu.nilai}</Text>
                    <Text>{hasiltemu.alamat_temu}</Text>
                  </View>
                </View>
                <View style={styles.listButton}>
                  <View style={styles.infoButton}>
                    <Button title="Cek Data" color="#e91e63"  
                   onPress={() =>  this.props.navigation.navigate("KonfirmasiScreen", {
                    uid: hasiltemu.uid,
                    uri: hasiltemu.image,
                    id_panggil:hasiltemu.id_panggil,
                    uri2: hasiltemu.image_temu,
                    email_asal: hasiltemu.email_temu,
                    nama: hasiltemu.nama_panggil,
                    keadaan: hasiltemu.keadaan_temu,
                    nilai: hasiltemu.nilai,
                    alamat_temu: hasiltemu.alamat_temu,
                  })
                }
              />
                  </View>
                </View>
              </View>
            );
          })
        ) : null}

        </View>


        <View style={styles.jarak}>
        <Button title="data orang yang anda temukan" onPress={this.ShowHidelapor} color="#ed407a"/>
        </View>
        <View style={styles.jarak}>
        {this.state.show_l ? (
          this.state.laportemu.map((laportemu, idx) => {
            return (
              <View key={idx} style={{ orderBottomColor: "gray" }}>
                <View style={styles.infogambar}>
                <Image
                    style={{ width: 88, height: 88 }}
                    source={{ uri: laportemu.image }}
                  />
                  <Image
                    style={{ width: 88, height: 88 }}
                    source={{ uri: laportemu.image_temu }}
                  />
                  <View style={styles.info}>
                  <Text>{laportemu.email_asal}</Text>
                    <Text>{laportemu.nama_panggil}</Text>
                    <Text>{laportemu.keadaan_temu}</Text>
                    <Text>{laportemu.nilai}</Text>
                    <Text>{laportemu.alamat_temu}</Text>
                  </View>
                </View>
                <View style={styles.listButton}>
                  <View style={styles.infoButton}>
                  <Button title="Cek Data" color="#e91e63"  
                    onPress={() =>  this.props.navigation.navigate("KonfirmasiScreen", {
                  uid: laportemu.uid,
                  id_panggil:laportemu.id_panggil,
                  uri: laportemu.image,
                  uri: laportemu.image_temu,
                  email_asal: laportemu.email_asal,
                  nama: laportemu.nama_panggil,
                  keadaan: laportemu.keadaan_temu,
                  nilai: laportemu.nilai,
                  alamat_temu: laportemu.alamat_temu,
                })
              }
              />
                  </View>
                </View>
              </View>
            );
          })
        ) : null}
        </View>

        <View style={styles.jarak}>
        <Button title="data orang hilang yang saya buat" onPress={this.ShowHidePost} color="#ed407a"/>
        </View>
        <View style={styles.jarak}>
        {this.state.show_p ? (
          this.state.t_post.map((t_post, idx) => {
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
                    <Button title="Lapor temu" color="#e91e63" />
                  </View>
                  <View style={styles.infoButton}>
                    <Button title="Detail" color="#e91e63"   />
                  </View>
                </View>
              </View>
            );
          })
        ) : null}
  
        </View>

          
        </ScrollView>
      </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "space-between",
        marginBottom: 10,
        alignItems: "stretch",
        justifyContent: "center",
        borderBottomColor: "gray"
      },
      jarak:{
        justifyContent: "space-between",
        marginBottom: 10,
        justifyContent: "center",
      },
      header: {
        flexDirection: "row",
        alignItems: "flex-start",
        backgroundColor :'#b0003a',
        justifyContent: "flex-start",
        paddingHorizontal: 32,
            paddingVertical: 12,
            borderBottomWidth: 1,
        borderBottomColor: "#D8D9DB",
        marginBottom: 10,
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
