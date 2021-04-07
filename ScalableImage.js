import React, { Component, } from "react"
import {Dimensions, Image} from 'react-native'
import PropTypes from 'prop-types'
import { TouchableOpacity } from "react-native-gesture-handler";

    export default class ScaledImage extends Component {
        state = {}

        componentDidMount() {
            const { uri, width, height, source } = this.props;
            this.setState({ source: source, width: width || height, height: height || width });
        }

        render() {
            return (
               <TouchableOpacity onPress={this.props.onPress} style={{elevation: 5}}>
                <Image
                    source={this.state.source}
                    onLoad={(value) => {
                        const { height, width } = value.nativeEvent.source;
                        if (this.props.width && !this.props.height) {
                            this.setState({
                                width: this.props.width,
                                height: height * (this.props.width / width)
                            });
                        } else if (!this.props.width && this.props.height) {
                            this.setState({
                                width: width * (this.props.height / height),
                                height: this.props.height
                            });
                        } else {
                            this.setState({ width: width, height: height });
                        }

                    }}
                    style={[{ height: this.state.height, width: (Dimensions.get('window').width * 90) / 100, resizeMode:"contain",
                        alignSelf: 'center' }, this.props.style]}
                    containerStyle={{marginHorizontal: 10}}
                    loadingIndicatorSource={this.props.loadingIndicatorSource}
                    onLongPress={this.props.onLongPress}
                /></TouchableOpacity>
                
            );
        }
    }

    ScaledImage.propTypes = {
        uri: PropTypes.string,
        require: PropTypes.string,
        width: PropTypes.number,
        height: PropTypes.number,
        onPress: PropTypes.func,
        onLongPress: PropTypes.func
    };