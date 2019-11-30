import  * as firebase from "firebase";


class Fire {


   addPost = async ({ email_p,nama,alamat,jk,umur,lokasi,kronologi,token,id_u, localUri }) => {
      //tambahkan diatas menjadi    addPost = async ({ text, localUri }) => {
      const remoteUri = await this.uploadPhotoAsync(localUri);

      return new Promise((res, rej) => {
          this.firestore
              .collection("posts")
              .add({
                  email_p,
                  nama,
                  alamat,
                  jk,
                  umur,
                  lokasi,
                  kronologi,
                  token,
                  id_u,
                  uid: this.uid,
                  timestamp: this.timestamp,
                  image: remoteUri
              })
              .then(ref => {
                  res(ref);
              })
              .catch(error => {
                  rej(error);
              });
      });
  };

  addTemu = async ({ nama_panggil,nilai,alamat_temu,informasi_temu,keadaan_temu,email,email_panggil,image_temu,image_panggil,id_panggil }) => {
    //tambahkan diatas menjadi    addPost = async ({ text, localUri }) => {
    

    return new Promise((res, rej) => {
        this.firestore
            .collection("Temu")
            .add({
                nama_panggil,
                nilai,
                alamat_temu,
                informasi_temu,
                keadaan_temu,
                email,
                email_panggil,
                image_temu,
                image_panggil,
                id_panggil,
                uid: this.uid,
                timestamp: this.timestamp
            })
            .then(ref => {
                res(ref);
            })
            .catch(error => {
                rej(error);
            });
    });
};

  addId = async ({ id_u }) => {
    //tambahkan diatas menjadi    addPost = async ({ text, localUri }) => {
    //const remoteUri = await this.uploadPhotoAsync(localUri);

    return new Promise((res, rej) => {
        this.firestore
            .collection("IdClarifai")
            .add({
                id_u,
                uid: this.uid,
            })
            .then(ref => {
                res(ref);
            })
            .catch(error => {
                rej(error);
            });
    });
};


  uploadPhotoAsync = async uri => {
      const path = `photos/${this.uid}/${Date.now()}.jpg`;

      return new Promise(async (res, rej) => {
          const response = await fetch(uri);
          const file = await response.blob();

          let upload = firebase
              .storage()
              .ref(path)
              .put(file);

          upload.on(
              "state_changed",
              snapshot => {},
              err => {
                  rej(err);
              },
              async () => {
                  const url = await upload.snapshot.ref.getDownloadURL();
                  res(url);
              }
          );
      });
  };



   get firestore() {
      return firebase.firestore();
  }

  get uid() {
      return (firebase.auth().currentUser || {}).uid;
  }

  get timestamp() {
      return Date.now();
  }

}


Fire.shared = new Fire();
export default Fire;