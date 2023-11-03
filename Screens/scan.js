import React, { Component, Fragment } from "react";
import {
  TouchableOpacity,
  Text,
  Linking,
  View,
  Image,
  ImageBackground,
  BackHandler,
} from "react-native";
import QRCodeScanner from "react-native-qrcode-scanner";
import styles from "./Styles";

class Scan extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scan: false,
      ScanResult: false,
      result: null,
    };
  }

  componentDidMount() {
    this.backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
      if (this.state.ScanResult) {
        this.setState({ scan: true, ScanResult: false });
        return true; 
      }
      return false; 
    });
  }

  componentWillUnmount() {
    this.backHandler.remove(); // Remove the listener when the component unmounts
  }

  onSuccess = (e) => {
    const check = e.data.substring(0, 4);
    console.log("scanned data" + check);
    this.setState({
      result: e,
      scan: false,
      ScanResult: true,
    });
    if (check === "http") {
      Linking.openURL(e.data).catch((err) =>
        console.error("An error occurred", err)
      );
    } else {
      this.setState({
        result: e,
        scan: false,
        ScanResult: true,
      });
    }
  };

  activeQR = () => {
    this.setState({ scan: true });
  };

  scanAgain = () => {
    this.setState({ scan: true, ScanResult: false });
  };

  render() {
    const { scan, ScanResult, result } = this.state;
    return (
      <View style={styles.scrollViewStyle}>
        <Fragment>
          {!scan && !ScanResult && (
            <View style={styles.cardView}>
              <Text numberOfLines={8} style={styles.descText}>
                Please press 'Scan QR Code' below to start scanning.
              </Text>
              <Image
                source={require("../assets/camera.png")}
                style={{ margin: 20 }}
              ></Image>
              <TouchableOpacity onPress={this.activeQR} style={styles.buttonScan}>
                <View style={styles.buttonWrapper}>
                  <Text style={{ ...styles.buttonTextStyle, color: "#2196f3" }}>
                    Scan QR Code
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
         {ScanResult && (
  <Fragment>
    <Text style={styles.textTitle1}>Result</Text>
    <View style={ScanResult ? styles.scanCardView : styles.cardView}>
      <Text>Type: {result.type}</Text>
      <Text>Result: {result.data}</Text>
      <Text>RawData: {result.rawData}</Text>

      {/* Add a button or touchable area to go back to the scan screen */}
      <TouchableOpacity onPress={this.scanAgain}>
        <Text>Go back</Text>
      </TouchableOpacity>
    </View>
  </Fragment>
)}
          {scan && (
            <QRCodeScanner
              reactivate={true}
              showMarker={true}
              ref={(node) => {
                this.scanner = node;
              }}
              onRead={this.onSuccess}
              topContent={
                <Text style={styles.centerText}>
                  Please move your camera {"\n"} over the QR Code
                </Text>
              }
              bottomContent={
                <View>
                  <TouchableOpacity
                    style={styles.buttonScan2}
                    onPress={() => this.scanner.reactivate()}
                    onLongPress={() => this.setState({ scan: false })}
                  ></TouchableOpacity>
                </View>
              }
            />
          )}
        </Fragment>
      </View>
    );
  }
}

export default Scan;
