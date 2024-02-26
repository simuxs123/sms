import { Dimensions, StyleSheet } from 'react-native'

const { width } = Dimensions.get('screen')

export default StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    permissionStatus: {
        marginBottom: 20,
        fontSize: 18,
    },
    buttonWrapper: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 50,
    },
    scrollView: {
        flex: 1,
    },
    textInfo: {
        color: '#000',
    },
    textInput: {
        paddingLeft: 16,
        fontSize: 14,
        borderWidth: 1,
        borderColor: '#3F44511F',
        borderRadius: 4,
        height: 44,
        color: '#000000',
        opacity: 0.75,
        width: 150,
        marginVertical:20,
      },
})