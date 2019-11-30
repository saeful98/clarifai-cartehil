import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  RefreshControl,
  Button,
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



export default class HomeScreen extends React.Component {
  
  state = { t_post: [], al: [] , refreshing: false, };

   

    _onRefresh = () => {
      this.setState({refreshing: true});
      firebase
        .firestore()
        .collection("posts")
        //.doc()
        //.doc("LvkwO94PsZwAGr50QXs0")
        //.where('id', '==','EERrLTRVFktYJH399H5A')
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
          });
  
          this.setState({
            t_post: tab_post
          });
          this.setState({refreshing: false});
        });
    }

  

    componentDidMount() {
      firebase
        .firestore()
        .collection("posts")
        //.doc()
        //.doc("LvkwO94PsZwAGr50QXs0")
        //.where('id', '==','EERrLTRVFktYJH399H5A')
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
          // tab_post.push( tab_post.push({
          //       //text: doc.id
          //       image: querySnapshot.data().image,
          //       text: querySnapshot.data().tect
          //     }));
  
          this.setState({
            t_post: tab_post
          });
  
          //console.log(this.state.t_post);
  
          ////test
          //     console.log(this.state.t_post[1].image)
          //     app.models.predict("nhjobw409sautwlncvo8c", this.state.t_post[1].image)
          //   .then(response => {
          //     //const { concepts } = response.outputs[0].data
          //     console.log(response.outputs[0].data.regions[0].data.concepts[0].value);
          // }).catch((err) => console.log(err))
  
          // //endtest
        });
    }

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
                    <Button title="Lapor temu" color="#e91e63" />
                  </View>
                  <View style={styles.infoButton}>
                    <Button title="Detail" color="#e91e63"   />
                  </View>
                </View>
              </View>
            );
          })}
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
