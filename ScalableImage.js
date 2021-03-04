import React, { Component, } from "react"
import {Dimensions} from 'react-native'
import { Image } from "react-native-elements"
import PropTypes from 'prop-types'

    export default class ScaledImage extends Component {
        state = {}

        componentDidMount() {
            const { uri, width, height, source } = this.props;
            this.setState({ source: source, width: width || height, height: height || width });
        }

        render() {
            return (
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
                    style={[{ height: this.state.height, width: (Dimensions.get('window').width * 90) / 100,  borderRadius: 20, marginVertical: 10, resizeMode:"contain",
                        alignSelf: 'center' }, this.props.style]}
                    onPress={this.props.onPress}
                    onLongPress={this.props.onLongPress}
                />
                
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