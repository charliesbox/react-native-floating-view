// @flow

import React, { Component, type Node } from 'react';
// eslint ignore next $FlowFixMe
import { StyleSheet, Animated, ScrollView, View, Easing } from 'react-native';
import type { Props, ScrollEvent } from './FloatingScrollView.type';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  animatedView: {
    position: 'absolute',
    right: 30,
  },
});

class FloatingScrollView extends Component<Props> {
  isAnimating: boolean;
  scrollPoint: number;
  animatedValue: Animated.Value;
  innerScrollView: Node;

  static defaultProps = {
    onScroll: () => {},
    offset: 50,
    height: 50,
    bottom: 30,
  };

  constructor(props: Props) {
    super(props);
    this.isAnimating = false;
    this.scrollPoint = 0;
  }

  componentWillMount() {
    this.animatedValue = new Animated.Value(this.props.bottom);
  }

  onScroll = (event: ScrollEvent) => {
    this.props.onScroll(event);

    const offsetY = event.nativeEvent.contentOffset.y;

    if (offsetY < 0 || this.isAnimating) {
      return;
    }

    const offset = this.scrollPoint - offsetY;

    if (offset < -this.props.offset) {
      this.toggleFab(offsetY, -this.props.height);
    }

    if (offset > this.props.offset) {
      this.toggleFab(offsetY, this.props.bottom);
    }
  };

  toggleFab(newPoint: number, position: number) {
    this.isAnimating = true;
    Animated.timing(this.animatedValue, {
      toValue: position,
      duration: 200,
      easing: Easing.in(Easing.quad),
    }).start(() => {
      this.isAnimating = false;
      this.scrollPoint = newPoint;
    });
  }

  render() {
    const { childrenStyles, floatingView, children } = this.props;
    return (
      <View style={styles.container}>
        <ScrollView
          ref={scrollComponent => {
            this.innerScrollView = scrollComponent;
          }}
          scrollEventThrottle={16}
          onScroll={this.onScroll}
          style={styles.scrollView}
        >
          {children}
        </ScrollView>
        <Animated.View
          style={[
            styles.animatedView,
            childrenStyles,
            { bottom: this.animatedValue },
          ]}
        >
          {floatingView}
        </Animated.View>
      </View>
    );
  }
}

export default FloatingScrollView;
