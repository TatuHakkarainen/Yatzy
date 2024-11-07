import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8'
  },
  flex: {
    flexDirection: "row"
  },
  footer: {
    marginTop: 20,
    backgroundColor: '#2A9D8F',
    flexDirection: 'row',
  },
  gameboard: {
    backgroundColor: '#e5e9ec',
    alignItems: 'center',
    justifyContent: 'center'
  },
  row: {
    marginTop: 20,
    padding: 10
  },
  gameinfo: {
    backgroundColor: '#e5e9ec',
    textAlign: 'center',
    justifyContent: 'center',
    fontSize: 20,
    color: '#2A9D8F',
    marginTop: 10
  },
  playername: {
    color: "#264653",
    fontSize: 20,
    textAlign: 'center',
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    color: "#264653",
    marginBottom: 5,
  },
  subheading: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    color: "#264653",
    marginTop: 5,
    marginBottom: 5,
  },
  pointsrow: {
    color: "#264653",
    fontSize: 16,
    textAlign: 'center',
  },
  title: {
    color: '#ffffff',
    fontWeight: 'bold',
    flex: 1,
    fontSize: 24,
    textAlign: 'center',
    margin: 10,
  },
  author: {
    color: '#ffffff',
    fontWeight: '600',
    flex: 1,
    fontSize: 16,
    textAlign: 'center',
    margin: 10,
  },
  playername2: {
    color: "#264653",
    fontSize: 22,
    textAlign: 'center',
    marginTop: 20,
    fontWeight: 'bold',
  },
  button: {
    margin: 30,
    flexDirection: "row",
    padding: 12,
    backgroundColor: "#2A9D8F",
    width: 150,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    color: "#ffffff"
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 18
  },
  throwDicesbutton: {
    backgroundColor: "#2A9D8F",
    borderRadius: 10,
    marginHorizontal: 70,
    marginBottom: 30,
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderColor: "#264653",
    borderWidth: 2,
  },
  OkButton: {
    backgroundColor: "#2A9D8F",
    margin: 70,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderColor: "#264653",
    borderWidth: 2,
    marginTop: 15,
  },
  playButton: {
    backgroundColor: "#2A9D8F",
    borderRadius: 10,
    margin: 70,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderColor: "#264653",
    borderWidth: 2,
    marginTop: 20,
  },
  playButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: 'center',
  },
  gamerules: {
    margin: 5,
    fontSize: 16,
    textAlign: 'left',
    color: '#264653'
  },
  icon: {
    alignSelf: 'center',
    marginBottom: 20,
  },
  gameboardtext: {
    color: "#264653",
    fontSize: 18,
    textAlign: 'left',
    marginTop: 10,
  },
});
