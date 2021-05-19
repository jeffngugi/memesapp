import React, { Component, } from "react"
import {Dimensions} from 'react-native'
import PropTypes from 'prop-types'
import {TouchableWithoutFeedback } from "react-native-gesture-handler"
import FastImage from 'react-native-fast-image'

    export default class ScaledImage extends Component {
        state = {}

        componentDidMount() {
            const { uri, width, height, source } = this.props;
            this.setState({ source: source, width: width || height, height: height || width });
        }
        componentWillReceiveProps(nextProps) {
            if (nextProps.source !== this.state.source) {
              this.setState({ source: nextProps.source })
            }
          }

        render() {
            return (
               <TouchableWithoutFeedback onPress={this.props.onPress} style={{elevation: 5}}>
                <FastImage
                    source={this.state.source}
                    onLoad={(value) => {
                        const { height, width } = value.nativeEvent;
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
                    style={[{ height: this.state.height, width: (Dimensions.get('window').width * 90) / 100,
                        alignSelf: 'center', marginHorizontal: 10 }, this.props.style]}
                    onLongPress={this.props.onLongPress}
                    resizeMode="contain"
                /></TouchableWithoutFeedback>
                
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